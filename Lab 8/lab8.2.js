function init() {
    // Width and height
    var w = 500;
    var h = 300;

    // Define map projection
    var projection = d3.geoMercator()
        .center([145, -36.5]) // Centered on Victoria
        .translate([w / 2, h / 2])
        .scale(2450);

    // Set up the paths
    var path = d3.geoPath().projection(projection);

    // Set the color range (using a color scale from ColorBrewer)
    var color = d3.scaleQuantize()
        .range(d3.schemePurples[9]); // 9 shades of purple

    // Create SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Tooltip div (custom style)
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f4f4f4")
        .style("padding", "5px")
        .style("border", "1px solid #ddd")
        .style("border-radius", "3px")
        .style("visibility", "hidden");

    // Load in the unemployment data
    d3.csv("VIC_LGA_unemployment.csv").then(function (data) {
        // Set the input domain for the color scale
        color.domain([
            d3.min(data, d => +d.unemployed),
            d3.max(data, d => +d.unemployed)
        ]);

        // Load in GeoJSON data for LGA boundaries
        d3.json("LGA_VIC.json").then(function (json) {
            // Merge the CSV data with the GeoJSON data
            data.forEach(function (csvData) {
                var LGAName = csvData.LGA; // CSV LGA name
                var unemployed = +csvData.unemployed; // CSV unemployment data

                // Find the matching GeoJSON feature for each LGA
                for (var i = 0; i < json.features.length; i++) {
                    var jsonLGA = json.features[i].properties.LGA_name;
                    if (jsonLGA === LGAName) {
                        // Copy the unemployment data into the GeoJSON
                        json.features[i].properties.unemployed = unemployed;
                        break; // Stop loop once match is found
                    }
                }
            });

            // Bind the data and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    // Use the color scale for the unemployment value
                    var unemployed = d.properties.unemployed;
                    return unemployed ? color(unemployed) : "#ccc"; // Default to grey if no data
                });

            // Load city data and place circles
            d3.csv("VIC_city.csv").then(function (cityData) {
                // Add circles for each city
                svg.selectAll("circle")
                    .data(cityData)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        // Longitude and latitude to x coordinate
                        return projection([+d.lon, +d.lat])[0];
                    })
                    .attr("cy", function (d) {
                        // Longitude and latitude to y coordinate
                        return projection([+d.lon, +d.lat])[1];
                    })
                    .attr("r", 4) // Radius of the circle
                    .style("fill", "red") // Circle color
                    .on("mouseover", function (event, d) {
                        // Check if the city name exists in the data
                        if (d.place) {
                            tooltip.style("visibility", "visible")
                                .text(d.place); // Show city name
                        } else {
                            console.log("City name missing in data:", d);
                        }
                    })
                    .on("mousemove", function (event) {
                        tooltip.style("top", (event.pageY - 10) + "px")
                            .style("left", (event.pageX + 10) + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.style("visibility", "hidden");
                    });
            }).catch(function(error) {
                console.error("Error loading city data:", error);
            });
        }).catch(function(error) {
            console.error("Error loading GeoJSON data:", error);
        });
    }).catch(function(error) {
        console.error("Error loading unemployment data:", error);
    });
}

window.onload = init;
