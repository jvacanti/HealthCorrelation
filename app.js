var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/data.csv", function (err, cData) {
  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  cData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.abbr = data.abbr;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([4, d3.max(cData, function(data){ 
      return +data.healthcare})])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([8, d3.max(cData, function(data){ 
      return +data.poverty})])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(cData)
  .enter()
  .append("circle")
  .attr("cx", function(data, index){
    return xLinearScale(data.healthcare)})
  .attr("cy", function(data, index){ 
    return yLinearScale(data.poverty)})
  .attr("r", "10")
  .attr("fill", "purple")
  .attr("opacity", ".5");

  var textGroup = chartGroup.selectAll("g")
  .data(cData)
  .enter()
  .append("text")
  .attr("x", function(data, index){
   return xLinearScale(data.healthcare)})
  .attr("y", function(data){
    return yLinearScale(data.poverty)})
  .attr("fill", "white")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text(function(data){ return data.abbr});

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data){
      return (`${data.abbr}<br>Poverty (%): ${data.poverty}<br>Lacks Healthcare (%): ${data.healthcare}`
    )});

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
      return toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      return toolTip.hide(data);
    });

  textGroup.on("mouseover", function (data) {
    return toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      return toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("In Poverty  (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");
});
