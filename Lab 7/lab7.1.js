function init() {
    var w = 600;
    var h = 300;
    var margin = { top: 20, right: 20, bottom: 50, left: 65 };

    // Create an SVG element with margins
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    var xScale = d3.scaleTime().range([0, w]);
    var yScale = d3.scaleLinear().range([h, 0]);

    // Define area generator
    var area = d3.area()
                 .x(function(d) { return xScale(d.date); })
                 .y0(h)  // Baseline for the area (bottom of the chart)
                 .y1(function(d) { return yScale(d.number); });  // Top of the area

    // Load the CSV data
    d3.csv("Unemployment_78-95.csv").then(function(data) {
        // Parse the data
        data.forEach(function(d) {
            d.date = new Date(d.year, d.month - 1); // Combine year and month into a Date object
            d.number = +d.number; // Convert number to numeric format
        });

        // Set the domains of the scales based on the data
        xScale.domain(d3.extent(data, function(d) { return d.date; }));
        yScale.domain([0, d3.max(data, function(d) { return d.number; })]);

        // Add the area chart
        svg.append("path")
           .datum(data)
           .attr("class", "area")
           .attr("d", area)
           .style("fill", "lightgray");

        // Add the x-axis
        var xAxis = d3.axisBottom(xScale)
                      .ticks(10);  // Adjust tick count if necessary

        svg.append("g")
           .attr("transform", "translate(0," + h + ")")  // Place the x-axis at the bottom
           .call(xAxis);

        // Add the y-axis
        var yAxis = d3.axisLeft(yScale)
                      .ticks(6);  // Adjust tick count if necessary

        svg.append("g")
           .call(yAxis);

        // Add labels to the axes
        // X-axis label
        svg.append("text")
           .attr("x", w / 2)
           .attr("y", h + margin.bottom - 10)
           .attr("text-anchor", "middle")
           .text("Year");

        // Y-axis label
        svg.append("text")
           .attr("text-anchor", "middle")
           .attr("transform", "rotate(-90)")
           .attr("x", -h / 2)
           .attr("y", -margin.left + 15)
           .text("Number of Unemployed");

        // Annotation for 500,000 Unemployment Level 
        svg.append("line")
           .attr("class", "line halfMilMark")
           .attr("x1", 0)
           .attr("y1", yScale(500000))
           .attr("x2", w)
           .attr("y2", yScale(500000))
           .style("stroke", "red")
           .style("stroke-width", "2px")
           .style("stroke-dasharray", "5,5");

        svg.append("text")
           .attr("class", "halfMilLabel")
           .attr("x", 10)
           .attr("y", yScale(500000) - 7)
           .attr("fill", "red")
           .text("Half a million unemployed");
    });
}

// Initialize the chart on page load
window.onload = init;
