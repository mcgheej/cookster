import { Injectable } from '@angular/core';
import { TileConurbation } from './tile-conurbation';
import { ActivityDB } from '@util/data-types/lib/activity-db';
import { DisplayTile } from '@util/data-types/index';
import { addMinutes, subMinutes } from 'date-fns';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { TilerConfig } from './tiler-config';

@Injectable()
export class Tiler {
  conurbations: TileConurbation[] = [];

  generateDisplayTiles(activities: ActivityDB[], planEnd: Date, config: TilerConfig): DisplayTile[] {
    if (activities.length === 0) {
      return [];
    }

    this.buildConurbations(activities, planEnd);

    return this.finishDisplayTiles(config);
  }

  buildConurbations(activities: ActivityDB[], planEnd: Date): void {
    this.conurbations = [];
    const tiles = activities.map((a) => this.activityToDisplayTile(a, planEnd)).sort(sortByStartThenEnd);
    let conurb = new TileConurbation(tiles[0]);
    tiles.slice(1).forEach((tile) => {
      if (!conurb.addItem(tile)) {
        this.conurbations.push(conurb);
        conurb = new TileConurbation(tile);
      }
    });
    this.conurbations.push(conurb);
  }

  private finishDisplayTiles(config: TilerConfig): DisplayTile[] {
    let displayTiles: DisplayTile[] = [];
    this.conurbations.forEach((conurb) => {
      displayTiles = [...displayTiles, ...conurb.generateTiles(config)];
    });
    return displayTiles;
  }

  private activityToDisplayTile(activity: ActivityDB, planEnd: Date): DisplayTile {
    const startTime = subMinutes(planEnd, activity.startTimeOffset);
    const endTime = addMinutes(startTime, activity.duration);
    return {
      activity,
      topPx: 0,
      leftPx: 0,
      widthPx: 0,
      heightPx: 0,
      startMinsFromMidnight: getMinutesSinceMidnight(startTime),
      endMinsFromMidnight: getMinutesSinceMidnight(endTime),
    } as DisplayTile;
  }
}

function sortByStartThenEnd(a: DisplayTile, b: DisplayTile): number {
  if (a.startMinsFromMidnight < b.startMinsFromMidnight) {
    return -1;
  }
  if (a.startMinsFromMidnight > b.startMinsFromMidnight) {
    return 1;
  }
  return a.endMinsFromMidnight - b.endMinsFromMidnight;
}
