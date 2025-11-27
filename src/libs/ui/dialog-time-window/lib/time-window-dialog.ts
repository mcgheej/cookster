import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TIMESLOTS } from '@util/app-config/index';
import { Plan, TimeWindow } from '@util/data-types/index';
import { getHours, getMinutes, subMinutes } from 'date-fns';

const hourslotWidthPx = 40;
const windowBarWidthPx = hourslotWidthPx * 24;

export interface TimeWindowDialogData {
  plan: Plan;
}

interface WindowBarRegion {
  leftPx: number;
  widthPx: number;
}

@Component({
  selector: 'ck-time-window-dialog',
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './time-window-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeWindowDialog implements OnInit {
  private readonly dialogRef: MatDialogRef<TimeWindowDialog, TimeWindow> = inject(MatDialogRef);
  private readonly data: TimeWindowDialogData = inject(MAT_DIALOG_DATA);

  protected timeWindowRegion = signal<WindowBarRegion>({ leftPx: 0, widthPx: 0 });
  protected planWindowRegion = signal<WindowBarRegion>({ leftPx: 0, widthPx: 0 });

  private timeWindow = this.data.plan.properties.timeWindow;
  private plan = this.data.plan;

  private maxStartHours = 0;
  private minEndHours = 0;

  readonly timeslots = [
    ...TIMESLOTS.map((t, i) => {
      return {
        t: t,
        leftPx: i * hourslotWidthPx - hourslotWidthPx / 2,
        widthPx: hourslotWidthPx,
      };
    }),
    ...[{ t: '24:00', leftPx: windowBarWidthPx - hourslotWidthPx / 2, widthPx: hourslotWidthPx }],
  ];

  ngOnInit() {
    this.maxStartHours = Math.max(getHours(subMinutes(this.plan.properties.startTime, 30)), 0);
    this.minEndHours = Math.min(
      getMinutes(this.plan.properties.endTime) <= 30
        ? getHours(this.plan.properties.endTime) + 1
        : getHours(this.plan.properties.endTime) + 2,
      24
    );
    this.planWindowRegion.set({
      leftPx: this.maxStartHours * hourslotWidthPx,
      widthPx: (this.minEndHours - this.maxStartHours) * hourslotWidthPx,
    });
    this.setWindowBarRegions();
  }

  saveChanges() {
    this.dialogRef.close(this.timeWindow);
  }

  clickOnBarBackground(ev: MouseEvent) {
    ev.preventDefault();
    const hours = Math.max(Math.floor((ev.offsetX + hourslotWidthPx / 2) / hourslotWidthPx), 0);
    if (hours <= this.timeWindow.startHours) {
      this.timeWindow = { ...this.timeWindow, startHours: hours };
    } else {
      this.timeWindow = { ...this.timeWindow, endHours: hours };
    }
    this.setWindowBarRegions();
  }

  clickOnTimeWindowBackground(ev: MouseEvent) {
    ev.preventDefault();
    const hours =
      Math.max(Math.floor((ev.offsetX + hourslotWidthPx / 2) / hourslotWidthPx), 0) + this.timeWindow.startHours;
    if (hours <= this.maxStartHours) {
      this.timeWindow = { ...this.timeWindow, startHours: hours };
    } else {
      this.timeWindow = { ...this.timeWindow, endHours: hours };
    }
    this.setWindowBarRegions();
  }

  private setWindowBarRegions() {
    this.timeWindowRegion.set({
      leftPx: this.timeWindow.startHours * hourslotWidthPx,
      widthPx: (this.timeWindow.endHours - this.timeWindow.startHours) * hourslotWidthPx,
    });
  }
}
