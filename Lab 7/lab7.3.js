function init() {
    // Set up the dataset
    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    // Set up the SVG canvas dimensions
    var w = 500;  // Increased width to accommodate legend on the right
    var h = 300;
    var padding = 30;

    // Append an SVG element to the DOM
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)  // Adjusted width
                .attr("height", h);

    // Colors for each category (apples, oranges, grapes)
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    // Set up the stack layout
    var stack = d3.stack()
                  .keys(["apples", "oranges", "grapes"]);

    var series = stack(dataset);  // Apply the stack layout to the dataset

    // Set up xScale and yScale
    var xScale = d3.scaleBand()
                   .domain(d3.range(dataset.length))
                   .range([padding, w - padding - 100])  // Adjusted to leave space for legend
                   .padding(0.1);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset, function(d) {
                       return d.apples + d.oranges + d.grapes;  // Total per group
                   })])
                   .range([h - padding, padding]);

    // Bind the stacked data to groups
    var groups = svg.selectAll("g.layer")
                    .data(series)
                    .enter()
                    .append("g")
                    .attr("class", "layer")
                    .style("fill", function(d, i) {
                        return colors(i);  // Assign color to each category
                    });

    // Draw the rectangles
    var rects = groups.selectAll("rect")
                      .data(function(d) { return d; })  // Bind data to each rectangle
                      .enter()
                      .append("rect")
                      .attr("x", function(d, i) {
                          return xScale(i);  // Position along the x-axis
                      })
                      .attr("y", function(d) {
                          return yScale(d[1]);  // Top position based on the upper bound
                      })
                      .attr("height", function(d) {
                          return yScale(d[0]) - yScale(d[1]);  // Height of the rectangle based on the difference
                      })
                      .attr("width", xScale.bandwidth());  // Set the width of each bar

    // Add a legend to the right of the chart
    var legend = svg.append("g")
                    .attr("transform", "translate(" + (w - 80) + "," + (padding + 10) + ")");  // Position legend to the right

    var categories = ["apples", "oranges", "grapes"];

    // Create legend entries
    var legendEntries = legend.selectAll("g.legend")
                              .data(categories)
                              .enter()
                              .append("g")
                              .attr("class", "legend")
                              .attr("transform", function(d, i) {
                                  return "translate(0," + i * 20 + ")";  // Spacing between legend entries
                              });

    // Add colored rectangles for the legend
    legendEntries.append("rect")
                 .attr("x", 0)
                 .attr("y", 0)
                 .attr("width", 10)
                 .attr("height", 10)
                 .attr("fill", function(d, i) {
                     return colors(i);  // Match color with corresponding category
                 });

    // Add text labels for each category
    legendEntries.append("text")
                 .attr("x", 15)
                 .attr("y", 10)
                 .attr("text-anchor", "start")
                 .text(function(d) {
                     return d;  // Display the category name
                 });
}

// Initialize the chart on page load
window.onload = init;

