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

    // this is to add y axis    
    var yAxis = d3.axisLeft(yScale)
        .ticks(5);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // For the bar shape
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

    // Initial rendering with binding of the text labels
    var labels = svg.selectAll(".label")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            return xScale(i) + (xScale.bandwidth() / 2);
        })
        .attr("y", function(d) {
            var labelY = yScale(d);
            return (labelY < padding) ? padding + 10 : labelY - 5;  // Adjusted the y position
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Add button for adding new data
    d3.select("#chart")
        .append("button")
        .attr("id", "addDataButton")
        .text("Add Data");

    // Add button for removing data
    d3.select("#chart")
        .append("button")
        .attr("id", "removeDataButton")
        .text("Remove Data");

    // Function for updating the chart
    function updateChart() {
        // Update the xScale domain to reflect the new dataset length
        xScale.domain(d3.range(dataset.length));

        // Update the yScale to account for the new maximum value if necessary
        yScale.domain([0, d3.max(dataset)]);

        // Bind the data to bars and add new elements for new data points
        var bars = svg.selectAll("rect")
            .data(dataset);

        // Enter and merge for new data
        bars.enter()
            .append("rect")
            .attr("x", w)  // Start the new bars from the far right
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return h - padding - yScale(d);
            })
            .attr("fill", "slategray")
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
            .attr("x", w)  // Slide them out to the right
            .remove();  // Remove from DOM

        // Bind the data to text labels and update them
        var labels = svg.selectAll(".label")
            .data(dataset);

        labels.enter()
            .append("text")
            .attr("class", "label")
            .text(function(d) {
                return d;
            })
            .attr("x", w)  // Start the new labels from the far right
            .attr("y", function(d) {
                var labelY = yScale(d);
                return (labelY < padding) ? padding + 10 : labelY - 5;  // Adjusted y position
            })
            .attr("text-anchor", "middle")
            .merge(labels)
            .transition()
            .duration(500)
            .text(function(d) {
                return d;
            })
            .attr("x", function(d, i) {
                return xScale(i) + (xScale.bandwidth() / 2);
            })
            .attr("y", function(d) {
                var labelY = yScale(d);
                return (labelY < padding) ? padding + 10 : labelY - 5;  // Adjusted y position
            });

        // Exit and remove labels that no longer have corresponding data
        labels.exit()
            .transition()
            .duration(500)
            .attr("x", w)  // Slide them out to the right
            .remove();

        // Update the y-axis
        svg.select(".axis")
            .transition()
            .duration(500)
            .call(yAxis);
    }

    // Event listener for adding data
    d3.select("#addDataButton").on("click", function() {
        // Generate a new random value and add to dataset
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber);

        // Update the chart
        updateChart();
    });

    // Event listener for removing data
    d3.select("#removeDataButton").on("click", function() {
        // Remove the first element of the dataset
        dataset.shift();
        
        // Update the chart
        updateChart();
    });
}

// Initialize the chart on page load
window.onload = init;

