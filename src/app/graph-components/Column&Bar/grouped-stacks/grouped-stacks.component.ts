import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-grouped-stacks',
  templateUrl: './grouped-stacks.component.html',
  styleUrls: ['./grouped-stacks.component.scss'],
})
export class GroupedStacksComponent  implements OnInit, OnDestroy {


  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  private root: am5.Root | null = null;
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    // this.displayChart();
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        if (!Array.isArray(this.data) || this.data.length === 0) {
          this.data = this.frame?.chartData || [];
        }
        this.displayChart();
      })
    }, 100);

    this.subData?.subscribe(data => {
      if (Array.isArray(data) && data.length > 0) {
        this.data = data;
        this.displayChart();
      }
    })
  }

  ngOnDestroy(): void {
    this.root?.dispose();
    this.root = null;
  }

displayChart(){
  const sourceData = Array.isArray(this.data) ? this.data : [];
  const seriesFields = Array.from(new Set(sourceData.flatMap(item =>
    Object.keys(item).filter(key => /^Y\d+$/.test(key))
  ))).sort((first, second) => Number(first.slice(1)) - Number(second.slice(1)));

  this.root?.dispose();
  this.root = null;
  if (!sourceData.length || !seriesFields.length) {
    return;
  }

  const seriesGroups: string[][] = [];
  for (let index = 0; index < seriesFields.length; index += 2) {
    seriesGroups.push(seriesFields.slice(index, index + 2));
  }

  const chartData: any[] = [];
  seriesGroups.forEach((groupFields, groupIndex) => {
    sourceData.forEach((item, rowIndex) => {
      const chartItem: any = {
        category: `group-${groupIndex}-category-${rowIndex}`,
        displayCategory: item.X1 ?? ''
      };
      for (const field of seriesFields) {
        const value = groupFields.includes(field) ? Number(item[field]) : 0;
        chartItem[field] = Number.isFinite(value) ? value : 0;
      }
      chartData.push(chartItem);
    });

    if (groupIndex < seriesGroups.length - 1) {
      chartData.push({
        category: `group-${groupIndex}-spacer`,
        displayCategory: ''
      });
    }
  });

  const root = am5.Root.new(this.id);
  this.root = root;


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root.verticalLayout
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "category",
  renderer: am5xy.AxisRendererX.new(root, {
    cellStartLocation: 0.1,
    cellEndLocation: 0.9,
    minGridDistance: 10
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.get("renderer").labels.template.adapters.add("text", function(text, target) {
  if (target.dataItem) {
    return (target.dataItem.dataContext as any)?.displayCategory ?? text;
  }
  return text;
});

xAxis.get("renderer").grid.template.set("forceHidden", true);

xAxis.data.setAll(chartData);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function makeSeries(name, fieldName, color) {
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    stacked: true,
    valueYField: fieldName,
    categoryXField: "category",
    stroke: color,
    fill: color
  }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryX}:{valueY}",
    width: am5.percent(90),
    tooltipY: 0
  });

  series.data.setAll(chartData);
  series.appear();
  legend.data.push(series);
}

const seriesColors = [
  am5.color(0x133F3D), am5.color(0x216E6A),
  am5.color(0x20320C), am5.color(0x4A731C),
  am5.color(0x3A1603), am5.color(0x883407)
];
seriesFields.forEach((field, index) => {
  const seriesName = sourceData.find(item => item[`${field}_label`])?.[`${field}_label`] || field;
  makeSeries(seriesName, field, seriesColors[index % seriesColors.length]);
});

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}

}
