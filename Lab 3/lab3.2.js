function init() {
    var w = 800; // bigger svg
    var h = 400; 
    var padding = 40; 
    var rightPadding = 35; 
    var numXTicks = 10; // Control the number of x-axis ticks
    var numYTicks = 6;  // Control the number of y-axis ticks

    var dataset = [
        [2, 8],
        [3, 5],
        [5, 17],
        [6, 6],
        [6, 12],
        [7, 20],
        [8, 22],
        [10, 11],
        [5, 12],
        [6, 17],
    ];

    var XScale = d3.scaleLinear()
        .domain([d3.min(dataset, function (d) {
            return d[0];
        }), d3.max(dataset, function (d) {
            return d[0];
        })])
        .range([padding, w - padding - rightPadding]);

    var YScale = d3.scaleLinear()
        .domain([d3.min(dataset, function (d) {
            return d[1];
        }), d3.max(dataset, function (d) {
            return d[1];
        })])
        .range([h - padding, padding]);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return XScale(d[0]);
        })
        .attr("cy", function (d) {
            return YScale(d[1]);
        })
        .attr("r", 5)
        .attr("fill", function (d) {
            if (d[0] > 400 || d[1] > 80 || d[0] < 20 || d[1] > 90) {  
                return "red"; 
            } else {
                return "slategrey";
            }
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return "(" + d[0] + ", " + d[1] + ")";
        })
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("x", function (d) {
            return XScale(d[0]) + 8;
        })
        .attr("y", function (d) {
            return YScale(d[1]) - 8;
        });

    // Create the x-axis with a specified number of ticks
    var xAxis = d3.axisBottom(XScale)
        .ticks(numXTicks); // Suggests the number of ticks

    // Append the x-axis to the svg and position it at the bottom
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft(YScale)
        .ticks(numYTicks); // Suggests the number of ticks

    // Append the y-axis to the svg and position it on the left
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", w / 2) // Put the label to the right
        .attr("y", h - 5) // Position above the axis
        .text("Tree Age (year)");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "right")
        .attr("transform", "rotate(-90)")
        .attr("y", 13) // Position to the right of the axis
        .attr("x", -(h / 1.5)) // position just outside of
        .text("Tree Height (m)");
}

// Initialize the chart on page load
window.onload = init;

