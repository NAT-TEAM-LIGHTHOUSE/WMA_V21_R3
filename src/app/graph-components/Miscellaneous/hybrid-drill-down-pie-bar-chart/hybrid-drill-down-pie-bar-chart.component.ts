import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface BreakdownData {
  category: string;
  value: number;
}

interface ChartData {
  category: string;
  value: number;
  sliceSettings: {
    fill: am5.Color;
  };
  breakdown: BreakdownData[];
}

@Component({
  standalone: true,
  imports: [],
  selector: 'app-hybrid-drill-down-pie-bar-chart',
  templateUrl: './hybrid-drill-down-pie-bar-chart.component.html',
  styleUrls: ['./hybrid-drill-down-pie-bar-chart.component.scss'],
})
export class HybridDrillDownPieBarChartComponent
  implements OnInit, AfterViewInit, OnDestroy {

  private static nextChartId = 0;
  private root!: am5.Root;
  private subDataSubscription?: Subscription;
  private chartData: ChartData[] = [];
  @Input() frame: any;
  @Input() data: any;
  @Input() subData?: Subject<any>;
  id = '';

  constructor() {}

  ngOnInit(): void {
    this.id = `hybridDrillDownChart${HybridDrillDownPieBarChartComponent.nextChartId++}`;
  }

  ngAfterViewInit(): void {
    const initialData = Array.isArray(this.data) && this.data.length
      ? this.data
      : this.frame?.chartData;
    this.chartData = this.toChartData(initialData);
    this.displayChart();

    this.subDataSubscription = this.subData?.subscribe(rows => {
      if (Array.isArray(rows) && rows.length) {
        this.chartData = this.toChartData(rows);
        this.displayChart();
      }
    });
  }

  private toChartData(rows: any): ChartData[] {
    if (!Array.isArray(rows)) {
      return [];
    }

    const seriesFields = Array.from(new Set(rows.flatMap(row =>
      Object.keys(row).filter(key => /^Y\d+$/.test(key))
    ))).sort((first, second) => Number(first.slice(1)) - Number(second.slice(1)));
    const categoryMap = new Map<string, Map<string, number>>();

    for (const row of rows) {
      const category = String(row.X1 ?? '');
      if (!category) {
        continue;
      }

      let breakdown = categoryMap.get(category);
      if (!breakdown) {
        breakdown = new Map<string, number>();
        categoryMap.set(category, breakdown);
      }

      for (const field of seriesFields) {
        const label = String(row[`${field}_label`] || field);
        const value = Number(row[field]);
        if (Number.isFinite(value) && value > 0) {
          breakdown.set(label, (breakdown.get(label) || 0) + value);
        }
      }
    }

    const colors = [0xdc4534, 0xd7a700, 0x68ad5c, 0x4387c5, 0x8a63b8, 0xe27b35];
    return Array.from(categoryMap, ([category, breakdown], index) => {
      const details = Array.from(breakdown, ([detailCategory, value]) => ({
        category: detailCategory,
        value
      }));
      return {
        category,
        value: details.reduce((total, detail) => total + detail.value, 0),
        sliceSettings: { fill: am5.color(colors[index % colors.length]) },
        breakdown: details
      };
    }).filter(item => item.value > 0);
  }

  displayChart(): void {
    if (!this.id || !this.chartData.length) {
      return;
    }

    this.root?.dispose();

    // ===============================
    // Create Root
    // ===============================

    this.root = am5.Root.new(this.id);

    const root = this.root;
    const data = this.chartData;

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // ===============================
    // Main Container
    // ===============================

    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout
      })
    );

    // ===============================
    // Column Chart
    // ===============================

    const columnChart = container.children.push(
      am5xy.XYChart.new(root, {
        width: am5.p50,
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout
      })
    );

    // Y Axis

    const yRenderer = am5xy.AxisRendererY.new(root, {});

    yRenderer.grid.template.setAll({
      location: 1
    });

    const yAxis = columnChart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer
      })
    );

    // X Axis

    const xAxis = columnChart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1
        })
      })
    );

    // Column Series

    const columnSeries = columnChart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Breakdown",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        categoryYField: "category"
      })
    );

    columnSeries.columns.template.setAll({
      tooltipText: "{categoryY}: {valueX}"
    });

    columnChart.appear(1000, 100);

    // ===============================
    // Pie Chart
    // ===============================

    const pieChart = container.children.push(
      am5percent.PieChart.new(root, {
        width: am5.p50,
        innerRadius: am5.percent(50)
      })
    );

    // Pie Series

    const pieSeries = pieChart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      })
    );

    pieSeries.slices.template.setAll({
      templateField: "sliceSettings",
      strokeOpacity: 0
    });

    // ===============================
    // Center Labels
    // ===============================

    const label1 = pieChart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: "",
        fontSize: 35,
        fontWeight: "bold",
        centerX: am5.p50,
        centerY: am5.p50
      })
    );

    const label2 = pieChart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: "",
        fontSize: 12,
        centerX: am5.p50,
        centerY: am5.p50,
        dy: 30
      })
    );

    // ===============================
    // Slice Selection
    // ===============================

    // let currentSlice: am5percent.PieSlice | undefined;

   let currentSlice: any;

pieSeries.slices.template.on(
  "active",
  (active, slice) => {

    if (!active || !slice.dataItem) {
      return;
    }

    if (currentSlice && currentSlice !== slice) {
      currentSlice.set("active", false);
    }

    const color = slice.get("fill");

    const dataItem: any = slice.dataItem;

    const selectedData =
      dataItem.dataContext as ChartData;

    // Center percentage
    label1.setAll({
      fill: color,
      text: root.numberFormatter.format(
        Number(dataItem.get("valuePercentTotal")),
        "#.'%'"
      )
    });

    // Center category
    label2.set(
      "text",
      selectedData.category
    );

    // Column color
    columnSeries.columns.template.setAll({
      fill: color,
      stroke: color
    });

    // Breakdown
    columnSeries.data.setAll(
      selectedData.breakdown
    );

    yAxis.data.setAll(
      selectedData.breakdown
    );

    currentSlice = slice;

  }
);
    // Hide Pie Labels

    pieSeries.labels.template.set(
      "forceHidden",
      true
    );

    pieSeries.ticks.template.set(
      "forceHidden",
      true
    );

    // Set Pie Data

    pieSeries.data.setAll(data);

    // ===============================
    // Select First Slice
    // ===============================

    pieSeries.events.on(
      "datavalidated",
      () => {

        const firstSlice =
          pieSeries.slices.getIndex(0);

        if (firstSlice) {
          firstSlice.set("active", true);
        }

      }
    );

  }

  ngOnDestroy(): void {
    this.subDataSubscription?.unsubscribe();
    if (this.root) {
      this.root.dispose();
    }

  }

}