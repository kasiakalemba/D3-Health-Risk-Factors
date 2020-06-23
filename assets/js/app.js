// STATE DATA INTERACTIVE CHART

// 1. Set up the SVG area 
// Make the width and height
var svgWidth = 1200;
var svgHeight = 700;

// Set margins 
var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

// Adjust width and heigh for margins  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Append a div class to the scatter element
var scatter = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

// Select Scatter 
var svg = scatter.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Make a chart group 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// 2. Initial Params and function when loaded
var chosenXAxis = "income";
var chosenYAxis = "obesity";

// Function used for updating x-scale 
function xScale(stateData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
    d3.max(stateData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}

// Function used for updating y-scale 
function yScale(stateData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
    d3.max(stateData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}

// Function used for updating xAxis 
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Function used for updating yAxis 
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// Function used for updating circles group 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]))

  return circlesGroup;
}

// Function for updating labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  textGroup.transition()
    .duration(1000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]));

  return textGroup
}

// Function used for updating tooltips
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  if (chosenXAxis === "income") {
    var xLabel = "Income:";
  }
  else if (chosenXAxis === 'poverty') {
    var xLabel = 'Poverty';
  }

  else {
    var xLabel = 'Age:';
  }

  if (chosenYAxis === 'obesity') {
    var yLabel = "Obesity"
  }
  else if (chosenYAxis === 'healthcare') {
    var yLabel = 'Healthcare';
  }
  else {
    var yLabel = 'Smokers:';
  }

  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function (d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

  return circlesGroup;
}


// 3. Load actual data 
d3.csv("allData.csv").then(function (stateData) {

  // Parse Data/Cast as numbers
  stateData.forEach(function (data) {

    // x axis values
    data.income = +data.income;
    data.age = +data.age;
    data.poverty = +data.poverty;

    // y axis values
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);
  // Scale Y
  var yLinearScale = yScale(stateData, chosenYAxis);

  // Make X axis 
  var bottomAxis = d3.axisBottom(xLinearScale);
  // Make Y axis 
  var leftAxis = d3.axisLeft(yLinearScale);


  // Append X axis to the chart 
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append Y axis to the chart 
  var yAxis = chartGroup.append("g")
    .classed('y-axis', true)
    .call(leftAxis);

  // Create Circles for state labels 
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .classed('stateCircle', true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    .attr("opacity", ".5");

  // Add text to them for state abbr
  var textGroup = chartGroup.selectAll(".stateText")
    .data(stateData)
    .enter()
    .append("text")
    .classed('stateText', true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr('dy', 3)
    .attr('font-size', '10px')
    .text(function (d) { return d.abbr });

  // Create X axis labels
  var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")

  var income = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Income");

  var age = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  var poverty = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Poverty");

  var yLabels = chartGroup.append('g')
    .attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);


  // Create Y labels
  var obesity = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', 0)
    .attr('y', 0 - 20)
    .attr('dy', '1em')
    .attr("value", "obesity")
    .classed("active", true)
    .text("Obesity %");

  var smokes = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', 0)
    .attr('y', 0 - 40)
    .attr('dy', '1em')
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes");

  var healthcare = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', 0)
    .attr('y', 0 - 60)
    .attr('dy', '1em')
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Healthcare");


  // Update the toolTip
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  xLabels.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");

      if (value !== chosenXAxis) {

        // Replace chosenXAxis with value
        chosenXAxis = value;

        xLinearScale = xScale(stateData, chosenXAxis);

        // Updates x axis 
        xAxis = renderXAxis(xLinearScale, xAxis);

        // Update circles with a new x value
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // Ppdate text within circles
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // Update tooltip
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Changes classes for active/inactive look
        if (chosenXAxis === "income") {
          income
            .classed("active", true)
            .classed("inactive", false);
          age
            .classed("active", false)
            .classed("inactive", true);
          poverty
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenXAxis === "age") {
          income
            .classed("active", false)
            .classed("inactive", true);
          age
            .classed("active", true)
            .classed("inactive", false);
          poverty
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          income
            .classed("active", false)
            .classed("inactive", true);
          age
            .classed("active", false)
            .classed("inactive", true);
          poverty
            .classed("active", true)
            .classed("inactive", false);
        }

      }
    });


  yLabels.selectAll("text")
    .on("click", function () {
      // Get value of selection
      var value = d3.select(this).attr("value");

      if (value !== chosenYAxis) {

        // Replace chosenXAxis with value
        chosenYAxis = value;

        yLinearScale = yScale(stateData, chosenYAxis);

        // Update x axis
        yAxis = renderYAxis(yLinearScale, yAxis);

        // Update circles with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // Update text with new values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // Update tooltips
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Changes classes to change active/inactive looks
        if (chosenYAxis === "obesity") {
          obesity
            .classed("active", true)
            .classed("inactive", false);
          smokes
            .classed("active", false)
            .classed("inactive", true);
          healthcare
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenYAxis === "smokes") {
          obesity
            .classed("active", false)
            .classed("inactive", true);
          smokes
            .classed("active", true)
            .classed("inactive", false);
          healthcare
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          obesity
            .classed("active", false)
            .classed("inactive", true);
          smokes
            .classed("active", false)
            .classed("inactive", true);
          healthcare
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});


