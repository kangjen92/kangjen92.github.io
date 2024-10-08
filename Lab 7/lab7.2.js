function drawDonutChart() {
    // Set up data and SVG canvas
    var data = [10, 20, 30, 40, 50];  // Example dataset with 5 numbers

    var w = 300;  // Width and height of the SVG canvas
    var h = 300;
    var outerRadius = w / 2;  // Outer radius of the pie
    var innerRadius = outerRadius / 2;  // Set innerRadius for a donut chart

    // Create the SVG canvas
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");  // Move chart center to middle of SVG

    // Create the pie and arc generators
    var pie = d3.pie();  // Create a pie layout
    var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);  // Donut chart with inner radius

    // Set color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);  // Using d3.schemeCategory10 for colors

    // Set up arcs and bind data
    var arcs = svg.selectAll("g.arc")
                  .data(pie(data))  // Bind data to pie layout
                  .enter()
                  .append("g")
                  .attr("class", "arc");

    // Draw the arcs and add colors
    arcs.append("path")
        .attr("d", arc)  // Create the arc paths
        .attr("fill", function(d, i) {
            return color(i);  // Apply color from the color scale
        });

    // Add text labels to each slice
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";  // Position labels at the center of each slice
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.data;  // Display the value for each slice
        });

    // Add a title for the chart
    svg.append("text")
       .attr("x", 0)
       .attr("y", -outerRadius - 20)
       .attr("text-anchor", "middle")
       .attr("font-size", "16px")
       .attr("font-weight", "bold")
       .text("Donut Chart");
}

// Call the function to draw the donut chart on page load
window.onload = drawDonutChart;
