import { DisplayTile } from '@util/data-types/index';
import { TilerConfig } from './tiler-config';

/**
 * TileConurbation Class
 * =====================
 * A tile is a rectangle rendered in a Resource Lane that represents an Activity. A Tile Conurbation is
 * a group of tiles that overlap in time, where each tile sits alongside one or more other tiles in the
 * conurbation.
 *
 * The TileConurbation class is used to build a conurbations, each conurbation
 * consisting of a set of conurbation rows. These are held in the classes "stack"
 * property.
 *
 * The conurbation is built by first creating an instance of TileConurbation and passing
 * in the first DisplayTile item to be added to the conurbation. The addItem method is then called
 * to add subsequent items to the conurbation. Note that the items must be sorted by
 * startMinsFromMidnight property ascending and then by the endMinsFromMidnight property ascending
 * before they are used to construct the conurbation.
 */
export class TileConurbation {
  private _stack: Array<Array<DisplayTile | null>> = [];
  get stack(): Array<Array<DisplayTile | null>> {
    return this._stack;
  }

  private _maxDepth = 0;
  get maxDepth(): number {
    return this._maxDepth;
  }

  /**
   *
   * @param item The item to be added to the conurbation.
   *
   * The constructor creates a new conurbation with the item passed in as the first item.
   * The item is added to the first row of the conurbation. The max depth of the conurbation
   * is set to 1.
   */
  constructor(item: DisplayTile) {
    this._stack.push([item]);
    this._maxDepth = 1;
  }

  /**
   *
   * @param item The item to be added to the conurbation.
   * @returns true if the item was added to the conurbation, false otherwise.
   */
  addItem(item: DisplayTile): boolean {
    let result = false;
    let firstEmptySlot = -1;

    // Get the last row from the stack and create a new row from it.
    // This is done to avoid mutating the original row in the stack if
    // the new item needs to be added to the row.
    const newRow = [...this._stack[this._stack.length - 1]];

    // Iterate over the row and check if the item overlaps with any of the
    // items in the row.
    newRow.map((p, i) => {
      if (p) {
        if (this.itemsOverlap(p, item)) {
          result = true;
        } else {
          newRow[i] = null;
          if (firstEmptySlot === -1) {
            firstEmptySlot = i;
          }
        }
      } else if (firstEmptySlot === -1) {
        firstEmptySlot = i;
      }
    });

    // If the item does not overlap with any of the items in the row,
    // return false to indicate the item does not belong in this
    // conurbation.
    if (!result) {
      return false;
    }

    // Iterate through the row from the end and remove any trailing nulls.
    // This is done to avoid having empty slots at the end of the row.
    for (let i = newRow.length - 1; i >= 0; i--) {
      if (newRow[i] === null) {
        newRow.splice(i, 1);
      } else {
        break;
      }
    }

    // If there are no empty slots in the row, add the item to the end of the row.
    // Otherwise, add the item to the first empty slot in the row.
    if (firstEmptySlot === -1) {
      newRow.push(item);
      this._maxDepth = Math.max(this._maxDepth, newRow.length);
    } else {
      newRow[firstEmptySlot] = item;
    }

    // Add the new row to the stack and return true to indicate the item was added
    // to the conurbation.
    this._stack.push(newRow);
    return result;
  }

  generateTiles(config: TilerConfig): DisplayTile[] {
    if (this._stack.length === 0) {
      return [];
    }

    const { pixelsPerHour, laneWidthPx, leftMarginPx = 0, rightMarginPx = 0, gapPx = 0 } = config;
    const { startHours } = config.timeWindow;
    const tiles: DisplayTile[] = [];
    const tileWidthPx = (laneWidthPx - (leftMarginPx + rightMarginPx + gapPx * (this._maxDepth - 1))) / this._maxDepth;

    for (let col = 0; col < this.maxDepth; col++) {
      let spaceToRight = 0;
      let item: DisplayTile | null = null;
      for (let r = 0; r < this._stack.length; r++) {
        const row = this._stack[r];
        if (item === null) {
          if (row.length > col && row[col]) {
            // start of item
            item = row[col] as DisplayTile;
            spaceToRight = this.getSpaceToRight(col, row, this.maxDepth);
          }
        } else if (col >= row.length || row[col] === null) {
          // end of item
          const extraWidth = (tileWidthPx + gapPx) * spaceToRight;
          tiles.push(
            this.generateTile(item, col, tileWidthPx, extraWidth, leftMarginPx, gapPx, pixelsPerHour, startHours)
          );
          item = null;
        } else if (row[col] && item.activity.id !== row[col]?.activity.id) {
          // end of item and start of new item
          const extraWidth = (tileWidthPx + gapPx) * spaceToRight;
          tiles.push(
            this.generateTile(item, col, tileWidthPx, extraWidth, leftMarginPx, gapPx, pixelsPerHour, startHours)
          );
          item = row[col] as DisplayTile;
          spaceToRight = this.getSpaceToRight(col, row, this.maxDepth);
        } else {
          // Item continues down column
          spaceToRight = Math.min(spaceToRight, this.getSpaceToRight(col, row, this.maxDepth));
        }
      }
      if (item) {
        // end of item
        const extraWidth = (tileWidthPx + gapPx) * spaceToRight;
        tiles.push(
          this.generateTile(item, col, tileWidthPx, extraWidth, leftMarginPx, gapPx, pixelsPerHour, startHours)
        );
        item = null;
      }
    }

    return tiles;
  }

  private getSpaceToRight(col: number, row: Array<DisplayTile | null>, maxDepth: number): number {
    let space = 0;
    for (let c = col + 1; c < maxDepth; c++) {
      if (row[c]) {
        break;
      }
      space += 1;
    }
    return space;
  }

  private generateTile(
    item: DisplayTile,
    col: number,
    tileWidth: number,
    extraWidth: number,
    leftOffset: number,
    gap: number,
    pixelsPerHour: number,
    startHours: number
  ): DisplayTile {
    const leftPx = leftOffset + col * (tileWidth + gap);
    const topPx = ((item.startMinsFromMidnight - startHours * 60) / 60) * pixelsPerHour;
    const heightPx = (item.activity.duration / 60) * pixelsPerHour - 2;
    const tile = {
      ...item,
      topPx,
      leftPx,
      widthPx: tileWidth + extraWidth,
      heightPx,
      styles: {},
    };
    return tile;
  }

  private itemsOverlap(a: DisplayTile, b: DisplayTile): boolean {
    return !(a.startMinsFromMidnight >= b.endMinsFromMidnight || b.startMinsFromMidnight >= a.endMinsFromMidnight);
  }
}
