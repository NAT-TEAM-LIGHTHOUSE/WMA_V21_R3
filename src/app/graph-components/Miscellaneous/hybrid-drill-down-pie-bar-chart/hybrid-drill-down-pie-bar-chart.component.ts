import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

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
  implements AfterViewInit, OnDestroy {

  private root!: am5.Root;

  constructor() {}

  ngAfterViewInit(): void {
    this.displayChart();
  }

  displayChart(): void {

    // ===============================
    // Chart Data
    // ===============================

    const data: ChartData[] = [

      {
        category: "Critical",
        value: 89,

        sliceSettings: {
          fill: am5.color(0xdc4534)
        },

        breakdown: [
          {
            category: "Sales inquiries",
            value: 29
          },
          {
            category: "Support requests",
            value: 40
          },
          {
            category: "Bug reports",
            value: 11
          },
          {
            category: "Other",
            value: 9
          }
        ]
      },

      {
        category: "Acceptable",
        value: 71,

        sliceSettings: {
          fill: am5.color(0xd7a700)
        },

        breakdown: [
          {
            category: "Sales inquiries",
            value: 22
          },
          {
            category: "Support requests",
            value: 30
          },
          {
            category: "Bug reports",
            value: 11
          },
          {
            category: "Other",
            value: 10
          }
        ]
      },

      {
        category: "Good",
        value: 120,

        sliceSettings: {
          fill: am5.color(0x68ad5c)
        },

        breakdown: [
          {
            category: "Sales inquiries",
            value: 60
          },
          {
            category: "Support requests",
            value: 35
          },
          {
            category: "Bug reports",
            value: 15
          },
          {
            category: "Other",
            value: 10
          }
        ]
      }

    ];

    // ===============================
    // Create Root
    // ===============================

    this.root = am5.Root.new("chartdiv");

    const root = this.root;

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

    if (this.root) {
      this.root.dispose();
    }

  }

}