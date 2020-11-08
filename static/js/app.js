
// @TODO: YOUR CODE HERE!
// // Margin for SVG graphics
var margin = {
  top: 20,
  bottom: 60,
  right: 20,
  left: 120,
  xscale: 130,
  xlabel: 110,
  ylabel: 110
};

var svgWidth = 960;
var svgHeight = 700;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 80,
//   left: 100
// };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the SVG canvas 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// The axis label below the X axis
svg.append("g").attr("class", "x_axis_label");
var xlabel = d3.select(".x_axis_label");

// x-axis label: Poverty (%)
xlabel
  .append("text")
  .attr("y", -26)
  .attr("label_name", "poverty")
  .attr("label_axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// x, y coordinates for x-axis label  
// y coordinate of Poverty is (height - margin.bottom - 26)
// .attr("y", -26) determines how close to the x-axis scale
xlabel.attr(
  "transform",
  "translate(" +
  ((width - margin.xlabel) / 2 + margin.xlabel) + ", " +
  (height - margin.bottom) +
  ")"
);

// Part 1: The axis label next to the Y axis
svg.append("g").attr("class", "y_axis_label");
var ylabel = d3.select(".y_axis_label");

// y-axis label: Lacks Healthcare (%)
ylabel
  .append("text")
  .attr("y", -26)
  .attr("label_name", "healthcare")
  .attr("label_axis", "y")
  .attr("class", "aText active y")
  .text("Lacks Healthcare (%)");

// x, y coordinates for x-axis label
// y coordinate of healthcare is ((height + margin.ylabel) / 2 - margin.ylabel - 26)
// Because of rotate(-90), // .attr("y", -26) determines how close to the y-axis scale
ylabel.attr(
  "transform",
  "translate(" +
  margin.left + ", " +
  ((height + margin.ylabel) / 2 - margin.ylabel) + ")rotate(-90)"
);



d3.csv("static/data/data.csv").then(function (healthData) {
  var currentAxisLabelX = "poverty";
  var currentAxisLabelY = "healthcare";

  //X-axis scale
  var xMin;
  var xMax;

  xMin = d3.min(healthData, function (d) {
    return parseFloat(d[currentAxisLabelX]) * 0.90;
  });

  xMax = d3.max(healthData, function (d) {
    return parseFloat(d[currentAxisLabelX]) * 1.10;
  });

  var x_Scale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin.xscale, width - margin.right]);

  var xAxis = d3.axisBottom(x_Scale);

  xAxis.ticks(10);

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin.xscale) + ")");

  // Y-axis scale
  var yMin;
  var yMax;

  yMin = d3.min(healthData, function (d) {
    return parseFloat(d[currentAxisLabelY]) * 0.90;
  });

  yMax = d3.max(healthData, function (d) {
    return parseFloat(d[currentAxisLabelY]) * 1.10;
  });

  var y_Scale = d3
    .scaleLinear()
    .domain([yMin, yMax])

    .range([height - margin.xscale, margin.right]);

  var yAxis = d3.axisLeft(y_Scale);

  yAxis.ticks(10);

  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin.xscale) + ", 0)");


  //Create the circle bubbles
  circleRadius = 15;

  var circle_bubble = svg.selectAll("g theCircles").data(healthData).enter();

  circle_bubble
    .append("circle")
   
    .attr("cx", function (d) {
      return x_Scale(d[currentAxisLabelX]);
    })
    .attr("cy", function (d) {
      return y_Scale(d[currentAxisLabelY]);
    })
    .attr("r", circleRadius)
    .attr("class", function (d) {
      return "stateCircle " + d.abbr;
    })

  //Add the (abbr state) text inside the circle bubbles, and center it.
  circle_bubble
    .append("text")
    .text(function (d) {
      return d.abbr;
    })
    
    .attr("dx", function (d) {
      return x_Scale(d[currentAxisLabelX]);
    })
    .attr("dy", function (d) {
      return y_Scale(d[currentAxisLabelY]) + circleRadius / 2.5;
    })
    .attr("font-size", circleRadius)
    .attr("class", "stateText")


})



