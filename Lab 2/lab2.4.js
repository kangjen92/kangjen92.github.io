function init(){
    // Example from murray
    var w = 500;
    var h = 100;
    var barPadding = 1;

    let svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    d3.csv("lab2.4 data.csv").then(function(data){
        console.log(data);
        BarChart(data);
    });

    function BarChart(taranSightings){
        svg.selectAll("rect")
            .data(taranSightings)
            .enter()
            .append("rect")
            .attr("x",function(d, i) {
                return i * (w / taranSightings.length);
            })
            .attr("y",function(d){
                return h - (d.Tarantula * 4);
            })
            .attr("width", (w / taranSightings.length - barPadding))
            .attr("height", function(d){
                return d.Tarantula * 4;
            })
            .attr("fill", function(d){
                if (d.Tarantula >= 5 && d.Tarantula <= 11) {
                    return "blue"; // Color for values between 5 and 11
                } 
                else 
                {
                    return "grey"; // Default color for other values
                }
            });

        svg.selectAll("text")
            .data(taranSightings)
            .enter()
            .append("text")
            .text(function(d) {
                return d.Tarantula;
            })
            .attr("fill", "black")
            .attr("x", function(d, i){
                return i * (w / taranSightings.length) + 5;
            })
            .attr("y", function(d){
                return h - (d.Tarantula * 4) - 5;
            });
    }
}

// Initialize the chart on page load
window.onload = init;

