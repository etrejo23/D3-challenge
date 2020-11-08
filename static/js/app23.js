// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

 // functions used for updating circles text with a transition on
 // new circles for both X and Y coordinates
 function renderXText(circlesGroup, newXScale, chosenXaxis) {
 
    circlesGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "% In Poverty";
  }
  else {
    label = "Age (Median)";
  }

//   var toolTip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("static/data/data.csv").then(function(healthData, err) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.abbr = data.abbr;
    data.state = data.state
    console.log(data.poverty)
    console.log(data.healthcare)
    console.log(data.age)
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");






    let circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .classed("stateText", true);
   

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyPercentage = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("% In Poverty");

  // var ageLabel = labelsGroup.append("text")
  //   .attr("x", 0)
  //   .attr("y", 40)
  //   .attr("value", "age") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("Age (Median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare");

   

  //updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
         // updates circles text with new x values
        circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

        // // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyPercentage
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyPercentage
            .classed("active", true)
            .classed("inactive", false);
        }
      }
      return circlesGroup;
    });
}).catch(function(error) {
  console.log(error);
});
