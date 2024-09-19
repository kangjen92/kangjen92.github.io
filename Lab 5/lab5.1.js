function init() {
    var w = 500;
    var h = 300;
    var padding = 30;
    var maxValue = 25;
    var dataset = [14, 18, 20, 16, 11, 19, 17, 12, 13, 15];

    var svg = d3.select("#chart")
       .append("svg")
       .attr("width", w)
       .attr("height", h);

    // The x scale and y scale just so the bars doesn't look out of proportion
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([padding, w - padding])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([h - padding, padding]);

    // This is to add y-axis
    var yAxis = d3.axisLeft(yScale)
        .ticks(5);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

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

    // Add text labels for each bar
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
            var labelY = yScale(d) - 0;
            return labelY < padding ? padding + 10 : labelY; // Ensure label visibility
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Add button for generating random data inside #chart
    d3.select("#chart")
        .append("button")
        .attr("id", "updateButton")
        .text("Update");

    d3.select("#updateButton").on("click", function() {
        var numValues = dataset.length;
        var newDataset = [];

        for (var i = 0; i < numValues; i++) {
            var newNumber = Math.floor(Math.random() * maxValue);
            newDataset.push(newNumber);
        }

        yScale.domain([0, d3.max(newDataset)]);

        svg.selectAll("rect")
            .data(newDataset)
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("height", function(d) {
                return h - padding - yScale(d);
            });

        // Update text labels for each bar
        svg.selectAll(".bar-label")
            .data(newDataset)
            .text(function(d) {
                return d;
            })
            .attr("y", function(d) {
                var labelY = yScale(d) - 0;
                return labelY < padding ? padding + 10 : labelY;
            });
    });
}

// Initialize the chart on page load
window.onload = init;

