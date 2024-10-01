function init() {
    var w = 500;
    var h = 300;
    var padding = 30;
    var maxValue = 25;
    var dataset = [14, 18, 20, 16, 11, 19, 17, 12, 13, 15];
    var ascending = true;  // Variable to track the sorting order

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

    // this is to add y axis   
    var yAxis = d3.axisLeft(yScale)
        .ticks(5);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    function updateChart() {
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset)]);

        // Bind the data to bars and add new elements for new data points
        var bars = svg.selectAll("rect")
            .data(dataset);

        // Enter and merge for new data
        bars.enter()
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
            .attr("fill", "slategray")
            .on("mouseover", function(event, d) {
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                var yPosition = parseFloat(d3.select(this).attr("y")) - 5;

                // Initial rendering with binding of the text labels with tooltip this time
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "black")
                    .text(d);

                d3.select(this)
                    .attr("fill", "orange");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").remove();
                d3.select(this)
                    .attr("fill", "slategray");
            })
            .merge(bars)
            .transition()
            .duration(500)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return h - padding - yScale(d);
            });

        // Exit and remove bars that no longer have corresponding data
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w) // Slide out of view
            .remove();

         // Update the y-axis
        svg.select(".axis")
            .transition()
            .duration(500)
            .call(yAxis);
    }

    // Initialize chart
    updateChart();

    // Add sorting button
    d3.select("#chart")
        .append("button")
        .attr("id", "sortButton")
        .text("Sort Data")
        .on("click", function() {
            dataset.sort(function(a, b) {
                return ascending ? d3.ascending(a, b) : d3.descending(a, b);
            });

            ascending = !ascending;  // Toggle the sorting order

            updateChart();  // Redraw the chart with sorted data
        });

    // Add button for adding new data
    d3.select("#chart")
        .append("button")
        .attr("id", "addDataButton")
        .text("Add Data")
        // Event listener for adding data
        .on("click", function() {
        // Generate a new random value and add to dataset
            var newNumber = Math.floor(Math.random() * maxValue);
            dataset.push(newNumber);
            // Update the chart
            updateChart();
        });

    // Add button for removing data
    d3.select("#chart")
        .append("button")
        .attr("id", "removeDataButton")
        .text("Remove Data")
        // Event listener for removing data
        .on("click", function() {
            dataset.shift();
            // Update the chart
            updateChart();
        });
}

// Initialize the chart on page load
window.onload = init;
