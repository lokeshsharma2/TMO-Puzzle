import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators'

/**
* Chart configuration constants
*/
export const CHART_CONST = {
  TYPE: 'LineChart',
  COLUMN_NAME: ['period', 'close'],
  TITLE: 'Stock price',
  WIDTH: '600',
  HEIGHT: '400'
}

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})


export class ChartComponent implements OnInit, OnDestroy {
  @Input() data$: Observable<any>;
  public chartData: [];
  private chartDataSub: Subject<void> = new Subject<void>();
  public chart:IChart;
  

  /**
  * Constructor for chart compoent
  * @param ChangeDetectorRef
  */
  constructor(private cd: ChangeDetectorRef) {}

  /**
  * ngOnInit lifecycle hook to initiale google chart
  * @retun void
  */
  ngOnInit():void {
    this.chart = {
      title: CHART_CONST.TITLE,
      type: CHART_CONST.TYPE,
      data: [],
      columnNames: CHART_CONST.COLUMN_NAME,
      options: { title: CHART_CONST.TITLE, width: CHART_CONST.WIDTH, height: CHART_CONST.HEIGHT}
    };

    /**
    * Handler for chardData and inititate change decector if data is not same as earlier
    */
    this.data$.pipe(takeUntil(this.chartDataSub)).pipe(distinctUntilChanged())
    .subscribe(newData => {
        this.chartData = newData
        this.cd.detectChanges();
    });
  }

  /**
    * ngDestroy lifecycle hook to unsubscribe data when component get destroy.
  */
  ngOnDestroy() {
    this.chartDataSub.next();
    this.chartDataSub.complete();
  }
}

/**
* Interfaces for Chart configuration
*/
export interface IChart {
  title: string;
  type: string;
  data: [];
  columnNames: string[];
  options: IChartOptions;
}

export interface IChartOptions{
  title: string, 
  width: string, 
  height: string 
}
