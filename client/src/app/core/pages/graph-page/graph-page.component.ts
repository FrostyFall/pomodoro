import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, mergeMap, takeUntil } from 'rxjs';
import * as Highcharts from 'highcharts';

import { SharedModule } from 'src/app/shared/shared.module';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Pages, dayNames, monthNames } from 'src/app/shared/constants';
import { GraphService } from '../../services/graph.service';
import { findDatesIndex, getWeekDates } from '../../utils/date-functions';
import { ILog } from '../../interfaces';
import { ChartStyles } from '../../constants/chart-styles';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class GraphPageComponent implements OnInit, OnDestroy {
  chartObject: Highcharts.Chart | null = null;
  workLogs: ILog[] = [];
  shortBreakLogs: ILog[] = [];
  longBreakLogs: ILog[] = [];
  destroy$ = new Subject<void>();

  constructor(
    private readonly graphService: GraphService,
    private readonly menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.menuService.togglePage(Pages.Graph);
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubscriptions(): void {
    this.graphService
      .getWorkLogs()
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((value: ILog[]) => {
          this.workLogs = value;
          return this.graphService.getShortBreakLogs();
        }),
        mergeMap((value: ILog[]) => {
          this.shortBreakLogs = value;
          return this.graphService.getLongBreakLogs();
        })
      )
      .subscribe({
        next: (value: ILog[]) => {
          this.longBreakLogs = value;
          this.instantiateChart();
        },
      });
  }

  private instantiateChart(): void {
    const weekDates = getWeekDates();
    const weekDatesStr = getWeekDates().map(
      (date) =>
        `${dayNames[date.getDay()]}, ${
          monthNames[date.getMonth()]
        } ${date.getDate()}`
    );

    const workData = Array(7).fill(0);
    const shortBreakData = Array(7).fill(0);
    const longBreakData = Array(7).fill(0);

    this.workLogs.forEach((entry) => {
      workData[findDatesIndex(entry, weekDates)] += 1;
    });
    this.shortBreakLogs.forEach((entry) => {
      shortBreakData[findDatesIndex(entry, weekDates)] += 1;
    });
    this.longBreakLogs.forEach((entry) => {
      longBreakData[findDatesIndex(entry, weekDates)] += 1;
    });

    this.chartObject = Highcharts.chart({
      chart: {
        renderTo: 'container',
        backgroundColor: ChartStyles.BackgroundColor,
      },
      title: {
        text: 'Timer Starts',
        style: {
          color: ChartStyles.TitleColor,
        },
      },
      xAxis: {
        categories: weekDatesStr,
      },
      yAxis: {
        title: {
          text: 'Timer done times',
        },
      },
      series: [
        {
          name: 'Work',
          type: ChartStyles.GraphType_1,
          borderColor: ChartStyles.GraphColor_1,
          color: ChartStyles.GraphColor_1,
          data: workData,
        },
        {
          name: 'Short Break',
          type: ChartStyles.GraphType_2,
          borderColor: ChartStyles.GraphColor_2,
          color: ChartStyles.GraphColor_2,
          data: shortBreakData,
        },
        {
          name: 'Long Break',
          type: ChartStyles.GraphType_3,
          borderColor: ChartStyles.GraphColor_3,
          color: ChartStyles.GraphColor_3,
          data: longBreakData,
        },
      ],
      legend: {
        itemStyle: {
          color: ChartStyles.LegendColor,
        },
      },
    });
  }
}
