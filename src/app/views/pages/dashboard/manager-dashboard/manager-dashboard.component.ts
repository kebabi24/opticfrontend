import { Component, OnInit, NgZone } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../../core/_base/layout';
import { Widget4Data } from '../../../partials/content/widgets/widget4/widget4.component';
import { Widget1Data } from '../../../partials/content/widgets/widget1/widget1.component';


import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import { DashboardService } from 'src/app/core/erp';

am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_spiritedaway);
// Themes end

//let chart = am4core.create("chartdiv", am4charts.PieChart);

@Component({
  selector: 'kt-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

/*	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data;
  */
  
 dashbordReportsData: any;

 data1: Widget1Data[];
 data2: Widget1Data[];
 
/*	data4: Widget1Data[];
 data5: Widget1Data[];
 data6: Widget1Data[];
 data7: Widget1Data[];
 data8: Widget1Data[];
 data9: Widget1Data[];
 data10: Widget1Data[];
 data11: Widget1Data[];
 data12: Widget1Data[];
 data13: Widget1Data[];
 data14: Widget1Data[];
 data15: Widget1Data[];
 data16: Widget1Data[];
 data17: Widget1Data[];
 data18: Widget1Data[];
 data19: Widget1Data[];
 data20: Widget1Data[];*/

 product_sorted_data;
 salesday: Number;

 //private chart: am4charts.XYChart;


 constructor(
   private zone: NgZone,
   private dahboardService: DashboardService,
   private layoutConfigService: LayoutConfigService,
 ) {
 }

 
onchangelabel(){
  document.getElementById('sale').innerHTML = '9';

}

 ngOnInit(): void {
   
  this.dahboardService.DaySales().subscribe((response: any) => {
  this.salesday = response.data
  window.onload = () => {
    const lang = "fr"
    if ( lang == "fr") {
      this.onchangelabel() } else {
        
      }
  }
         this.data1 = [
         {
           title: 'Nbre de vente Journalier',
           desc: 'Nombre de Vente Ajourdhui',
           value: String(this.salesday),
           valueClass: 'kt-font-brand'
         }
       ];

      })     

/*project*/


/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart10 = am4core.create("chartdiv10", am4charts.XYChart3D);

// Add data
chart10.data = [{
    "projet": "Projet1",
    "CA": 3.5,
    "Cout": 4.2
}, {
    "projet": "Projet2",
    "CA": 1.7,
    "Cout": 3.1
}, {
    "projet": "Projet3",
    "CA": 2.8,
    "Cout": 2.9
}, {
    "projet": "Projet4",
    "CA": 2.6,
    "Cout": 2.3
}, {
    "projet": "Projet5",
    "CA": 1.4,
    "Cout": 2.1
}, {
    "projet": "Projet6",
    "CA": 2.6,
    "Cout": 4.9
}];

// Create axes
let categoryAxis10 = chart10.xAxes.push(new am4charts.CategoryAxis());
categoryAxis10.dataFields.category = "projet";
categoryAxis10.renderer.grid.template.location = 0;
categoryAxis10.renderer.minGridDistance = 30;

let valueAxis10 = chart10.yAxes.push(new am4charts.ValueAxis());
valueAxis10.title.text = "GDP growth ";
valueAxis10.renderer.labels.template.adapter.add("text", function(text) {
  return text + "M";
});

// Create series
let series10 = chart10.series.push(new am4charts.ColumnSeries3D());
series10.dataFields.valueY = "CA";
series10.dataFields.categoryX = "projet";
series10.name = "CA";
series10.clustered = false;
series10.columns.template.tooltipText = "CA: [bold]{valueY}[/]";
series10.columns.template.fillOpacity = 0.9;

let series20 = chart10.series.push(new am4charts.ColumnSeries3D());
series20.dataFields.valueY = "Cout";
series20.dataFields.categoryX = "projet";
series20.name = "Cout";
series20.clustered = false;
series20.columns.template.tooltipText = "Cout: [bold]{valueY}[/]";











am4core.useTheme(am4themes_animated);

let chart = am4core.create('chartdivr', am4charts.XYChart)
chart.colors.step = 2;

chart.legend = new am4charts.Legend()
chart.legend.position = 'top'
chart.legend.paddingBottom = 20
chart.legend.labels.template.maxWidth = 95

let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
xAxis.dataFields.category = 'category'
xAxis.renderer.cellStartLocation = 0.1
xAxis.renderer.cellEndLocation = 0.9
xAxis.renderer.grid.template.location = 0;

let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
yAxis.min = 0;

function createSeries(value, name) {
    let series = chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.valueY = value
    series.dataFields.categoryX = 'category'
    series.name = name

    series.events.on("hidden", arrangeColumns);
    series.events.on("shown", arrangeColumns);

    let bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.interactionsEnabled = false
    bullet.dy = 30;
    bullet.label.text = '{valueY}'
    bullet.label.fill = am4core.color('#ffffff')

    return series;
}

chart.data = [
    {
        category: 'Janvier',
        CA: 40,
        Cout: 55,
    },
    {
        category: 'Fevrier',
        CA: 30,
        Cout: 78,
    },
    {
        category: 'Mars',
        CA: 27,
        Cout: 40,
    },
    {
        category: 'Avril',
        CA: 50,
        Cout: 33,
    },
    {
      category: 'Mai',
      CA: 30,
      Cout: 43,
    },
    {
      category: 'Juin',
      CA: 50,
      Cout: 33,
    },
    {
      category: 'Juillet',
      CA: 55,
      Cout: 29,
    },

]


createSeries('CA', 'CA');
createSeries('Cout', 'Cout');

function arrangeColumns() {

    let series = chart.series.getIndex(0);

    let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
    if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
            let middle = chart.series.length / 2;

            let newIndex = 0;
            chart.series.each(function(series) {
                if (!series.isHidden && !series.isHiding) {
                    series.dummyData = newIndex;
                    newIndex++;
                }
                else {
                    series.dummyData = chart.series.indexOf(series);
                }
            })
            let visibleCount = newIndex;
            let newMiddle = visibleCount / 2;

            chart.series.each(function(series) {
                let trueIndex = chart.series.indexOf(series);
                let newIndex = series.dummyData;

                let dx = (newIndex - trueIndex + middle - newMiddle) * delta

                series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            })
        }
    }
}
/*project*/







       
       let chartr = am4core.create("chartdiv", am4charts.PieChart);	
       chartr.data = [ {
         "Fournisseur": "Fournisseur1",
         "DA": 501.9
       }, {
         "Fournisseur": "Fournisseur2",
         "DA": 301.9
       }, {
         "Fournisseur": "Fournisseur3",
         "DA": 201.1
       }, {
         "Fournisseur": "Fournisseur4",
         "DA": 165.8
       }, {
         "Fournisseur": "Fournisseur5",
         "DA": 139.9
       }, {
         "Fournisseur": "Fournisseur6",
         "DA": 128.3
       }, {
         "Fournisseur": "Fournisseur7",
         "DA": 99
       } ];
      
       // Add and configure Series
       let pieSeries = chartr.series.push(new am4charts.PieSeries());
       pieSeries.dataFields.value = "DA";
       pieSeries.dataFields.category = "Fournisseur";
       pieSeries.slices.template.stroke = am4core.color("#fff");
       pieSeries.slices.template.strokeWidth = 2;
       pieSeries.slices.template.strokeOpacity = 1;
       
       // This creates initial animation
       pieSeries.hiddenState.properties.opacity = 1;
       pieSeries.hiddenState.properties.endAngle = -90;
       pieSeries.hiddenState.properties.startAngle = -90;
      


       let chart1 = am4core.create("chartdiv1", am4charts.XYChart);

chart1.data = [
 {
   "Mois": "Décembre",
   "Nombre": 50441
  },  
  {
"Mois": "Novembre",
"Nombre": 35443
},
{
 "Mois": "Octobre",
 "Nombre": 29580
}, 
{
 "Mois": "Septembre",
 "Nombre": 19665
}, 
{
 "Mois": "Aout",
 "Nombre": 17711
}, 
{
 "Mois": "Juillet",
 "Nombre": 15984
}, 
{
 "Mois": "Juin",
 "Nombre": 10450
}, 
{
 "Mois": "Mai",
 "Nombre": 9822
},
{
 "Mois": "Avril",
 "Nombre": 8322
},
{
 "Mois": "Mars",
 "Nombre": 7009
},
{
 "Mois": "Février",
 "Nombre": 6882
},
{
 "Mois": "Janvier",
 "Nombre": 5200
}
];

chart1.padding(40, 40, 40, 40);

let categoryAxis = chart1.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = "Mois";
categoryAxis.renderer.minGridDistance = 60;
categoryAxis.renderer.inversed = true;
categoryAxis.renderer.grid.template.disabled = true;

let valueAxis = chart1.yAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.extraMax = 0.1;
//valueAxis.rangeChangeEasing = am4core.ease.linear;
//valueAxis.rangeChangeDuration = 1500;

let series1 = chart1.series.push(new am4charts.ColumnSeries());
series1.dataFields.categoryX = "Mois";
series1.dataFields.valueY = "Nombre";
series1.tooltipText = "{valueY.value}"
series1.columns.template.strokeOpacity = 0;
series1.columns.template.column.cornerRadiusTopRight = 10;
series1.columns.template.column.cornerRadiusTopLeft = 10;
//series.interpolationDuration = 1500;
//series.interpolationEasing = am4core.ease.linear;
let labelBullet = series1.bullets.push(new am4charts.LabelBullet());
labelBullet.label.verticalCenter = "bottom";
labelBullet.label.dy = -10;
labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

chart1.zoomOutButton.disabled = true;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series1.columns.template.adapter.add("fill", function (fill, target) {
return chart.colors.getIndex(target.dataItem.index);
});

setInterval(function () {
am4core.array.each(chart.data, function (item) {
  item.Nombre += Math.round(Math.random() * 200 - 100);
  item.Nombre = Math.abs(item.Nombre);
})
chart.invalidateRawData();
}, 2000)

categoryAxis.sortBySeries = series1;


let chart2 = am4core.create("chartdiv2", am4charts.PieChart);

// Add data
chart2.data = [ {
 "Classe": "Classe1",
 "Nombre": 501.9
}, {
 "Classe": "Classe2",
 "Nombre": 301.9
}, {
 "Classe": "Classe3",
 "Nombre": 201.1
}, {
 "Classe": "Classe4",
 "Nombre": 165.8
}, {
 "Classe": "Classe5",
 "Nombre": 139.9
}, {
 "Classe": "Classe6",
 "Nombre": 128.3
}, ];

// Set inner radius
chart2.innerRadius = am4core.percent(50);

// Add and configure Series
let pieSeries2 = chart2.series.push(new am4charts.PieSeries());
pieSeries2.dataFields.value = "Nombre";
pieSeries2.dataFields.category = "Classe";
pieSeries2.slices.template.stroke = am4core.color("#fff");
pieSeries2.slices.template.strokeWidth = 2;
pieSeries2.slices.template.strokeOpacity = 1;

// This creates initial animation
pieSeries2.hiddenState.properties.opacity = 1;
pieSeries2.hiddenState.properties.endAngle = -90;
pieSeries2.hiddenState.properties.startAngle = -90;








let chart3 = am4core.create("chartdiv3", am4charts.XYChart);
chart3.padding(40, 40, 40, 40);

let categoryAxis3 = chart3.yAxes.push(new am4charts.CategoryAxis());
categoryAxis3.renderer.grid.template.location = 0;
categoryAxis3.dataFields.category = "Famille";
categoryAxis3.renderer.minGridDistance = 1;
categoryAxis3.renderer.inversed = true;
categoryAxis3.renderer.grid.template.disabled = true;

let valueAxis3 = chart3.xAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;

let series3 = chart3.series.push(new am4charts.ColumnSeries());
series3.dataFields.categoryY = "Famille";
series3.dataFields.valueX = "Nombre";
series3.tooltipText = "{valueX.value}"
series3.columns.template.strokeOpacity = 0;
series3.columns.template.column.cornerRadiusBottomRight = 5;
series3.columns.template.column.cornerRadiusTopRight = 5;

let labelBullet3 = series3.bullets.push(new am4charts.LabelBullet())
labelBullet3.label.horizontalCenter = "left";
labelBullet3.label.dx = 10;
labelBullet3.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
labelBullet3.locationX = 1;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series3.columns.template.adapter.add("fill", function(fill, target){
 return chart3.colors.getIndex(target.dataItem.index);
});

categoryAxis.sortBySeries = series3;
chart3.data = [
   {
     "Famille": "Famille1",
     "Nombre": 35420
   },
   {
     "Famille": "Famille2",
     "Nombre": 11250
   },
   {
     "Famille": "Famille3",
     "Nombre": 45260
   },
   {
     "Famille": "Famille4",
     "Nombre": 4520
   }
 ]


 




 let chart4 = am4core.create("chartdiv4", am4charts.PieChart);
chart4.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart4.data = [
 {
   Wilaya: "Alger",
   value: 35930
 },
 {
   Wilaya: "Setif",
   value: 25365
 },
 {
   Wilaya: "Oran",
   value: 15214
 },
 {
   Wilaya: "Bejaia",
   value: 3125
 },
 {
   Wilaya: "Constantine",
   value: 14598
 },
 {
   Wilaya: "Ouaregla",
   value: 13598
 }
];
chart4.radius = am4core.percent(70);
chart4.innerRadius = am4core.percent(40);
chart4.startAngle = 180;
chart4.endAngle = 360;  

let series4 = chart4.series.push(new am4charts.PieSeries());
series4.dataFields.value = "value";
series4.dataFields.category = "Wilaya";

series4.slices.template.cornerRadius = 10;
series4.slices.template.innerCornerRadius = 7;
series4.slices.template.draggable = true;
series4.slices.template.inert = true;
series4.alignLabels = false;

series4.hiddenState.properties.startAngle = 90;
series4.hiddenState.properties.endAngle = 90;

chart4.legend = new am4charts.Legend();


 }










}