function load_charts() {
  DATALENGTH = 75; // number of dataPoints visible at any point
  // DataPoints
  ORANGE_DPS = [];
  GREEN_DPS = [];
  BLUE_DPS = [];
  PINK_DPS = [];
  // Setup charts;
  ORANGE_CHART = new CanvasJS.Chart("colony_orange_chart", {
  	axisY:{includeZero:false,interval:500},
    axisX:{interval:10,tickThickness:1},
  	data: [{type:"line",dataPoints:ORANGE_DPS,lineColor:"orange",markerColor:"orange"}]
  });
  GREEN_CHART = new CanvasJS.Chart("colony_green_chart", {
  	axisY:{includeZero:false,interval:500},
    axisX:{interval:10,tickThickness:1},
  	data: [{type:"line",dataPoints:GREEN_DPS,lineColor:"green",markerColor:"green"}]
  });
  BLUE_CHART = new CanvasJS.Chart("colony_blue_chart", {
  	axisY:{includeZero:false,interval:500},
    axisX:{interval:10,tickThickness:1},
  	data: [{type:"line",dataPoints:BLUE_DPS,lineColor:"blue",markerColor:"blue"}]
  });
  PINK_CHART = new CanvasJS.Chart("colony_pink_chart", {
  	axisY:{includeZero:false,interval:500},
    axisX:{interval:10,tickThickness:1},
    // Pink colour is too light to see properly
  	data: [{type:"line",dataPoints:PINK_DPS,lineColor:"purple",markerColor:"purple"}]
  });
}

function update_chart(data_points, chart, x_val, y_val) {
	data_points.push({
		x: x_val,
		y: y_val
	});
	if (data_points.length > DATALENGTH) {
		data_points.shift();
	}
	chart.render();
}
