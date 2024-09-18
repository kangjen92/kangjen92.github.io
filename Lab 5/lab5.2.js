function init() {
    var w = 500;
    var h = 300;
    var padding = 30;
    var maxValue = 25;  // Define the maximum value for random numbers
    var dataset = [14, 18, 20, 16, 11, 19, 17, 12, 13, 15];

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([padding, w - padding])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([h - padding, padding]);

    // Add y-axis
    var yAxis = d3.axisLeft(yScale)
        .ticks(5);  // Number of ticks on the y-axis

    // Append y-axis to the SVG
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Append bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return h - padding - yScale(d);
        })
        .attr("fill", "slategray");

    // Append text labels for bars
    svg.selectAll(".bar-label")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            return xScale(i) + (xScale.bandwidth() / 2);
        })
        .attr("y", function(d) {
            return yScale(d) - 0;
        })
        .attr("text-anchor", "middle");

    // Add button for generating random data
    d3.select("#chart")
        .append("button")
        .attr("id", "updateButton")
        .text("Update");

    // Update the y-axis
    svg.select(".axis").call(yAxis);

    d3.select("#updateButton").on("click", function() {
        // Generate random dataset
        var numValues = dataset.length;
        var newDataset = [];

        for (var i = 0; i < numValues; i++) {
            var newNumber = Math.floor(Math.random() * maxValue);
            newDataset.push(newNumber);
        }

        // Update the yScale with the new dataset's maximum value
        yScale.domain([0, d3.max(newDataset)]);

        // Update bars with transitions
        svg.selectAll("rect")
            .data(newDataset)
            .transition()
            .delay(function(d, i) {
                return i / dataset.length * 100;
            })
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("height", function(d) {
                return h - padding - yScale(d);
            });

        // Update text labels with transitions
        svg.selectAll(".bar-label")
            .data(newDataset)
            .text(function(d) {
                return d;
            })
            .transition()
            .delay(function(d, i) {
                return i / dataset.length * 100;
            })
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .attr("y", function(d) {
                var labelY = yScale(d) - 0;
                return labelY < padding ? padding + 10 : labelY; // Ensure label visibility
            });
    });
}

// Initialize the chart on page load
window.onload = init;
