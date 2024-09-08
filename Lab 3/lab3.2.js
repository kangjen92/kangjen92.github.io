function init() {
    var w = 800; // bigger svg
    var h = 400; 
    var padding = 20; 
    var rightPadding = 30; 
    var numXTicks = 10; // Control the number of x-axis ticks
    var numYTicks = 6;  // Control the number of y-axis ticks
    
    var dataset = [
        [5, 20],
        [100, 90],
        [250, 50],
        [100, 33],
        [330, 95],
        [200, 20],
        [150, 44],
        [25, 67],
        [85, 21],
        [220, 88],
        // Adding some outliers
        [490, 5],  // Outlier with a high x value
        [10, 95],  // Outlier with a high y value
        [5, 150],  // Outlier with a y value above the usual range
        [550, 50], // Outlier with an x value outside the chart width
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
}

// Initialize the chart on page load
window.onload = init;
