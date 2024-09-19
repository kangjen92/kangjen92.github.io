function init () {
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

    // this is to add y-axis
    var yAxis = d3.axisLeft(yScale)
        .ticks(5);

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
            var labelY = yScale(d) - 0;
            return labelY < padding ? padding + 10 : labelY;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Add buttons for easing effects and updating
    ["Update", "Ease Circle In", "Ease Circle Out", "Ease Elastic Out"].forEach(function(buttonText, i) {
        d3.select("#chart")
            .append("button")
            .attr("id", buttonText.replace(/\s+/g, '') + "Button") // Clean up button IDs
            .text(buttonText);
    });

    // Function to update chart with different easing
    function updateChart(easeFunction) {
        var newDataset = [];
        for (var i = 0; i < dataset.length; i++) {
            newDataset.push(Math.floor(Math.random() * maxValue));
        }

        yScale.domain([0, d3.max(newDataset)]);

        // Update bars
        svg.selectAll("rect")
            .data(newDataset)
            .transition()
            .duration(1000)
            .ease(easeFunction)
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("height", function(d) {
                return h - padding - yScale(d);
            });

        // Update text labels
        svg.selectAll(".bar-label")
            .data(newDataset)
            .transition()
            .duration(1000)
            .ease(easeFunction)
            .text(function(d) {
                return d;
            })
            .attr("y", function(d) {
                var labelY = yScale(d) - 0;
                return labelY < padding ? padding + 10 : labelY;
            });

        // Update y-axis
        svg.select(".axis")
            .transition()
            .duration(1000)
            .ease(easeFunction)
            .call(yAxis);
    }

    // Attach button event listeners
    d3.select("#UpdateButton").on("click", function() {
        updateChart(d3.easeLinear);
    });

    d3.select("#EaseCircleInButton").on("click", function() {
        updateChart(d3.easeCircleIn);
    });

    d3.select("#EaseCircleOutButton").on("click", function() {
        updateChart(d3.easeCircleOut);
    });

    d3.select("#EaseElasticOutButton").on("click", function() {
        updateChart(d3.easeElasticOut);
    });
}

// Initialize the chart on page load
window.onload = init;
