
	/**
	 * Created by ev1 on 12.02.2016.
	 */
	/*
	 chartPlace: chart ın gösterileceği div id olarak girilir.
	 chartType:line,pie
	 chartData: [{},{},...] şeklindeki object/json verisi
		 {
		   date: newDate,
		   visits: value, 	axis1 drawchart da {valueField:'visits'} options olarak girilir.
		   hits: value,		axis2 drawchart da {valueField:'hits'} options olarak girilir.
		   views: value		axis3 drawchart da {valueField:'views'} options olarak girilir.
		 }

	 catField:  linechart çiziminde X eksenindeki değerlerin nereden alınacağı
				Piechart da titleField olarak kullanılır.
	 Pie chart da aşağıdakiler göz önüne alınmaz.
	 catOptions:...
	*/

function ChartsBase(options){//chartPlace,chartType,chartData,catField,catOptions){
	var self=this;


	self.chartPlace=options.place;
	self.chartType=options.type;
	self.sameAxis=options.sameAxis;
	self.stockPanel='';

	if(options.data === undefined){
		options.data=null;
	}
	self.chartData=options.data;


	// Line chart
	this.lineChartOptions={
		title:'?????',
		bullet: "round",
		hideBulletsCount: 50,
		bulletBorderThickness:1,
		bulletBorderAlpha: 1,
		bulletColor: "#FFF",
		bulletSize: 5,
		lineThickness: 2,
		useLineColorForBulletBorder: true
	};

	// X Ekseni genelde tarih
	this.categoryOptions={
		parseDates: true, // veriler tarih bazlı olduğundan , parseDates  true yapılıyor
		minPeriod : "DD", // veriler günlük bazlı, minPeriod  DD
		minorGridEnabled:true,
		//axisColor:"#DADADA",
		twoLineMode:true,
		//position:'top',
		// tarih formatının gözterim şeklini düzenliyoruz.
		dateFormats : [{
				period: 'DD',
				format: 'DD'
			}, {
				period: 'WW',
				format: 'MMM DD'
			}, {
				period: 'MM',
				format: 'MMM'
			}, {
				period: 'YYYY',
				format: 'YYYY'
			}]
	};

	// Y - Eksenleri
	this.axisOptions={
		//title:'??????',
		//position:"left", // right
		axisColor :"#000",
		axisThickness:2,
		gridAlpha:0,
		titleBold:false

		//labelsEnabled:true
	};

	// pie chart için
	this.pieChartOptions={
		outlineColor:"#FFF",
		outlineAlpha:0.8,
		outlineThickness:2
	};

	switch(self.chartType){
		case 'stock':
			self.chart = new AmCharts.AmStockChart();
			self.chart.language='tr';

			var periodSelector = new AmCharts.PeriodSelector();
			periodSelector.position = "top";
			periodSelector.periods = [
				{
					period: "JJ",
					count: 6,
					label: "6 Saat"},// şu andan itibaren 6 saat geriye
				{
					period: "DD",
					count: 1,
					label: "1 Gün"},// şu andan itibaren 1 gün geriye
				{
					period: "DD",
					count: 10,
					label: "10 Gün"},// şu andan itibaren 10 gün geriye
				{
					period: "MM",
					count: 1,
					label: "1 Ay"}, // şu andan itibaren ay başına kadar
				{
					period: "YYYY",
					count: 1,
					label: "1 yıl"}, // şu andan itibarent 1 yıl geriye
				{
					period: "YTD",
					label: "YTD"}, // şu andan itibaren 1 ocak a kadar
				{
					period: "MAX",  // tüm datalar
					label: "MAX"
				}];
			self.chart.periodSelector = periodSelector;

			//self.drawChart=self.stockChart;

			// Dataset
			var dataSet1=new AmCharts.DataSet();
			dataSet1.dataProvider=self.chartData.k30;
			dataSet1.title = "0 - 30 cm.";
			dataSet1.fieldMappings = [
					{fromField:"value", toField:"value"},
					{fromField:"sumiktari", toField:"sumiktari"}];
			dataSet1.categoryField = options.catid;

			var dataSet2=new AmCharts.DataSet();
			dataSet2.dataProvider=self.chartData.k60;
			dataSet2.title = "30 - 60 cm.";
			dataSet2.fieldMappings = [
				{fromField:"value", toField:"value"},
				{fromField:"sumiktari", toField:"sumiktari"}];
			dataSet2.categoryField = options.catid;
			dataSet2.compared=true;

			var dataSet3=new AmCharts.DataSet();
			dataSet3.dataProvider=self.chartData.k90;
			dataSet3.title = "60 - 90 cm.";
			dataSet3.fieldMappings = [
				{fromField:"value", toField:"value"},
				{fromField:"sumiktari", toField:"sumiktari"}];
			dataSet3.categoryField = options.catid;
			dataSet3.compared=true;

			var dataSet4=new AmCharts.DataSet();
			dataSet4.dataProvider=self.chartData.kLow;
			dataSet4.title = "Alt Eşik";
			dataSet4.fieldMappings = [
				{fromField:"value", toField:"value"},
				{fromField:"sumiktari", toField:"sumiktari"}];
			dataSet4.categoryField = options.catid;
			dataSet4.compared=true;

			var dataSet5=new AmCharts.DataSet();
			dataSet5.dataProvider=self.chartData.kHigh;
			dataSet5.title = "Üst Eşik";
			dataSet5.fieldMappings = [
				{fromField:"value", toField:"value"},
				{fromField:"sumiktari", toField:"sumiktari"}];
			dataSet5.categoryField = options.catid;
			dataSet5.compared=true;
			// Dataset end ---------------------------------

			self.chart.dataSets = [dataSet1, dataSet2, dataSet3, dataSet4, dataSet5];

			// apply custom style for value axes
			var valueAxesSettings = new AmCharts.ValueAxesSettings();
			valueAxesSettings.axisAlpha = 0.5;
			valueAxesSettings.tickLength = 0;
			valueAxesSettings.minimum = 0;
			self.chart.valueAxesSettings = valueAxesSettings;

			var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
			categoryAxesSettings.axisAlpha = 0;

			// apply custom style for panels settings
			// Gerekirse kullan

			// add first value axis
			var valueAxis1 = new AmCharts.ValueAxis();
			valueAxis1.offset = 0;
			valueAxis1.minimum = 0;
			valueAxis1.inside = false;
			valueAxis1.precision = 1;

			// Stock Panel 1
			var stockPanel1 = new AmCharts.StockPanel();
			stockPanel1.recalculateToPercents='never';
			stockPanel1.title = "%Pv";
			stockPanel1.percentHeight = 70;
			stockPanel1.precision = 1;
			stockPanel1.mouseWheelScrollEnabled = true;
			stockPanel1.mouseWheelZoomEnabled = true;
			//stockPanel1.addValueAxis(valueAxis1);

			//add second value axes
			var valueAxis2 = new AmCharts.ValueAxis();
			valueAxis2.offset = 0;
			valueAxis2.minimum = 0;
			valueAxis2.inside = false;
			valueAxis2.precision = 0;
			//stockPanel2.addValueAxis(valueAxis1); // self?

			// Stock Panel 2
			var stockPanel2 = new AmCharts.StockPanel();
			stockPanel2.recalculateToPercents='never';
			stockPanel2.title = "litre";
			stockPanel2.percentHeight = 30;
			stockPanel2. mouseWheelScrollEnabled = true;
			stockPanel2. mouseWheelZoomEnabled = true;
			//stockPanel2.addValueAxis(valueAxis2);


			// graph of first stock panel
			var graph1 = new AmCharts.StockGraph();
			graph1.valueField = "value";
			graph1.comparable = true;
			graph1.compareField = "value";
			//graph1.bullet = "round";
			graph1.bulletBorderColor = "#FFFFFF";
			graph1.bulletBorderAlpha = 1;
			graph1.balloonText = "[[title]]:<b>[[value]]</b>";
			graph1.compareGraphBalloonText = "[[title]]:<b>[[value]]</b>";
			//graph1.compareGraphBullet = "round";
			graph1.compareGraphBulletBorderColor = "#FFFFFF";
			graph1.compareGraphBulletBorderAlpha = 1;
			graph1.hideBulletsCount = 50;
			stockPanel1.addStockGraph(graph1);



			// graph of second stock panel
			var graph2 = new AmCharts.StockGraph();
			graph2.valueField = "sumiktari";
			graph2.type = "column";
			graph2.showBalloon = true;
			graph2.fillAlphas = 1;
			graph2.cornerRadiusTop = 1;
			stockPanel2.addStockGraph(graph2);

			// create stock legend
			var stockLegend1 = new AmCharts.StockLegend();
			stockLegend1.periodValueTextComparing = "[[value.close]]%";
			stockLegend1.periodValueTextRegular = "[[value.close]]";
			stockLegend1.align = "right";
			stockLegend1.fontSize = 14;
			stockPanel1.stockLegend = stockLegend1;

			var stockLegend2 = new AmCharts.StockLegend();
			stockLegend2.periodValueTextRegular = "[[value.close]]";
			stockLegend2.labelText="Uygulanan Sulama Suyu";
			stockLegend2.align = "right";
			stockLegend2.fontSize = 14;
			stockLegend2.switchable=false;
			stockPanel2.stockLegend = stockLegend2;

			self.chart.panels = [stockPanel1, stockPanel2];

			// Scrollbar
			var sbsettings = new AmCharts.ChartScrollbarSettings();
			sbsettings.graph = graph2;
			sbsettings.oppositeAxis = false;
			sbsettings.backgroundAlpha = 0;
			sbsettings.backgroundColor="#888888";
			sbsettings.graphFillAlpha = 0;
			sbsettings.graphLineAlpha = 0.5;
			sbsettings.selectedGraphFillAlpha = 0;
			sbsettings.selectedGraphLineAlpha = 1;
			sbsettings.autoGridCount = true;
			sbsettings.updateOnReleaseOnly = false;
			sbsettings.color ="#AAAAA";
			sbsettings.height = 60;
			self.chart.chartScrollbarSettings = sbsettings;

			/*
			var categorySettings = new AmCharts.CategoryAxesSettings();
			categorySettings.startOnAxis = true;
			self.chart.CategoryAxesSettings = categorySettings;

			var valueSettings  = new AmCharts.ValueAxesSettings();
			valueSettings.inside = true;
			self.chart.ValueAxesSettings = valueSettings;
			*/

/*
			// DATA SET SELECTOR
			var dataSetSelector = new AmCharts.DataSetSelector();
			dataSetSelector.position = "left";
			self.chart.dataSetSelector = dataSetSelector;
*/
			self.chart.write(self.chartPlace);
			self.drawChart=self.stockChart;
			break;
		case 'pie':
			self.chart = new AmCharts.AmPieChart();
			self.chart.language='tr';

			self.chart.titleField=options.catid;
			self.drawChart=self.pieChart;
			self.chart.dataProvider=self.chartData;
			break;
		default:
			self.chart = new AmCharts.AmSerialChart();
			self.chart.language='tr';
			self.chart.categoryField = options.catid;
			self.categoryAxis(options.catOptions);
			self.drawChart=self.lineChart;
			self.addScrollbar();
			self.addCursor();
			self.addLegend();
			self.chart.dataProvider=self.chartData;
	}

	//self.chart.pathToImages = "amcharts/images/";
	self.chart.useDataSetColors =false;


};

ChartsBase.prototype.setLanguage=function(lang) {
	var self=this;
	if ('en' == lang)
		self.chart.language = null;
	else
		self.chart.language = lang;
	self.chart.validateData();
}
/*
ChartsBase.prototype.dataUpdateHandler=function(){
	console.log(this)
	// different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
	this.chart.zoomToIndexes(10, 20);

};
*/
ChartsBase.prototype.addScrollbar=function(){
	var self=this;
	// SCROLLBAR
	var chartScrollbar = new AmCharts.ChartScrollbar();
	//chartScrollbar.graph='visits'; ??
	//chartScrollbar.scrollbarHeight=10;
	self.chart.addChartScrollbar(chartScrollbar);

};

ChartsBase.prototype.addCursor=function(){
	var self=this;
	// CURSOR
	var chartCursor = new AmCharts.ChartCursor();
	chartCursor.cursorAlpha = 0.1;
	chartCursor.fullWidth = true;
	chartCursor.valueLineBalloonEnabled = true;
	chartCursor.valueLineEnabled=true;
	//chartCursor.pan=true;
	//chartCursor.cursorPosition="mouse";
	self.chart.addChartCursor(chartCursor);

};

ChartsBase.prototype.addLegend=function(){
	var self=this;

	// LEGEND
	var legend = new AmCharts.AmLegend();
	legend.marginLeft = 110;
	legend.useGraphSettings = true;
	self.chart.addLegend(legend);
};
//--------------------------------------------------------------

/*
	X- ekesini
*/
ChartsBase.prototype.categoryAxis=function(options){
	var self=this;

	if(options === undefined){
		options={};
	}

	// Options daki özellikler korunarak default özellikler eklenir.
	options=extend2(options,self.categoryOptions);

	var valueax = self.chart.categoryAxis;
	// Value ekseninin default özellikleri yernine tanımlanan yeni özelliklere göre düzenlenir.
	valueax=extend(valueax,options);
	return valueax;
};

/*
	Y Eksenlerinin tanımlanması
*/
ChartsBase.prototype.valueAxis=function(options){
	var self=this;


	if(options === undefined){
		options={};
	}

	// Options daki özellikler korunarak default özellikler eklenir.
	options=extend2(options,self.axisOptions);

	var valueax = new AmCharts.ValueAxis();

	// Value ekseninin default özellikleri yernine tanımlanan yeni özelliklere göre düzenlenir.
	valueax=extend(valueax,options);

	self.chart.addValueAxis(valueax);

	return valueax;
};
/*
	options parametresinde tanımlanan özellikleri değişirmeden
	default özellikleri ekler.
	graph değişkenine yeni options özellikleriyle atama yapar.
*/
ChartsBase.prototype.lineChartGraph=function(options){
	var self=this;
	//console.log(options);
	if(options === undefined){
		options={};
	}

	// Parametredeki özellikler değiştirilmeden default özellikler eklenir.
	options=extend2(options,self.lineChartOptions);
	//console.log(options);
	var graph = new AmCharts.AmGraph();
	// grap değişkenine tanımlanan özellikler atanır.
	graph=extend(graph,options);

	self.chart.addGraph(graph);
};

/*
	Linechart için kullanılacak graph cizim.
*/
ChartsBase.prototype.lineChart=function(valOptions,axisOptions){
	var self=this;

	// Tanımsızlıklar varsa varsayılan objeleri oluştur.
	if(valOptions === undefined){
		valOptions={};
	}

	if(axisOptions === undefined){
		axisOptions={};
	}

	// eksenlerde gösterilecek yazı tanımsızsa, valuefield varsayılan olarak kullanılsın.
	if(!valOptions.title){
		valOptions.title=valOptions.valueField;
	}

	// eksenler için title yoksa valOptions daki title'ı kullan.
	if(!axisOptions.title){
		axisOptions.title=valOptions.title;
	}

	// çizgi renkleri tanımlandıysa
	if(valOptions.lineColor ){
		axisOptions.axisColor=valOptions.lineColor ;
	}

	if(self.sameAxis){
		if(!self.valAxis){
			self.valAxis=self.valueAxis(axisOptions);
		}
		var valAxis=self.valAxis;
	}else{
		var valAxis=self.valueAxis(axisOptions);
	}

	valOptions=extend(valOptions,{valueAxis:valAxis})
	self.lineChartGraph(valOptions);

	self.chart.write(self.chartPlace);
};
/* Pie chart için
*/

ChartsBase.prototype.pieChart=function(options){
	var self=this;

	// Tanımsızlıklar varsa varsayılan objeleri oluştur.
	if(options === undefined){
		options={};
	}

	options=extend2(options,self.pieChartOptions);
	self.chart=extend(self.chart,options);

	self.chart.write(self.chartPlace);
};

ChartsBase.prototype.stockChart=function(options) {
	var self=this;
};