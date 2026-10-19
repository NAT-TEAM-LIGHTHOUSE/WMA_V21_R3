import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
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
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
})
export class GanttChartComponent  implements OnInit {


  @Input() data: any;
  @Input() frame: any;
  id="chartdiv";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    // this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    // this.displayChart();
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.data =  this.frame.chartData; 
      this.displayChart();
      })
    }, 100);

    
    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
    })
  }


displayChart(){
  let root = am5.Root.new("chartdiv");
root.dateFormatter.setAll({
  dateFormat: "yyyy-MM-dd HH:mm",
  dateFields: ["valueX", "openValueX"]
});


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
  layout: root.verticalLayout,
  paddingLeft: 0
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}))

let colors = chart.get("colors");

// Data
let data = [
  {
    category: "John",
    fromDate: "2018-01-01 08:00",
    toDate: "2018-01-01 10:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(0), 0)
    }
  },
  {
    category: "John",
    fromDate: "2018-01-01 12:00",
    toDate: "2018-01-01 15:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(0), 0.4)
    }
  },
  {
    category: "John",
    fromDate: "2018-01-01 15:30",
    toDate: "2018-01-01 21:30",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(0), 0.8)
    }
  },

  {
    category: "Jane",
    fromDate: "2018-01-01 09:00",
    toDate: "2018-01-01 12:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(2), 0)
    }
  },
  {
    category: "Jane",
    fromDate: "2018-01-01 13:00",
    toDate: "2018-01-01 17:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(2), 0.4)
    }
  },

  {
    category: "Peter",
    fromDate: "2018-01-01 11:00",
    toDate: "2018-01-01 16:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(4), 0)
    }
  },
  {
    category: "Peter",
    fromDate: "2018-01-01 16:00",
    toDate: "2018-01-01 19:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(4), 0.4)
    }
  },

  {
    category: "Melania",
    fromDate: "2018-01-01 16:00",
    toDate: "2018-01-01 20:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(6), 0)
    }
  },
  {
    category: "Melania",
    fromDate: "2018-01-01 20:30",
    toDate: "2018-01-02 00:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(6), 0.4)
    }
  },

  {
    category: "Donald",
    fromDate: "2018-01-01 13:00",
    toDate: "2018-01-02 00:00",
    columnSettings: {
      fill: am5.Color.brighten(colors.getIndex(8), 0)
    }
  }
];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "category",
    renderer: am5xy.AxisRendererY.new(root, {
      inversed: true,
      minorGridEnabled: true
    }),
    tooltip: am5.Tooltip.new(root, {
      themeTags: ["axis"],
      animationDuration: 200
    })
  })
);

yAxis.data.setAll([
  { category: "John" },
  { category: "Jane" },
  { category: "Peter" },
  { category: "Melania" },
  { category: "Donald" }
]);

let xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "minute", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 90
    })
  })
);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  openValueXField: "fromDate",
  valueXField: "toDate",
  categoryYField: "category",
  sequencedInterpolation: true
}));

series.columns.template.setAll({
  templateField: "columnSettings",
  strokeOpacity: 0,
  tooltipText: "{category}: {openValueX} - {valueX}"
});

series.data.processor = am5.DataProcessor.new(root, {
  dateFields: ["fromDate", "toDate"],
  dateFormat: "yyyy-MM-dd HH:mm"
});
series.data.setAll(data);

// Add scrollbars
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);
}

}
