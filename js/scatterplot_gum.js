var margin1 = {top: 20, right: 20, bottom: 40, left: 40},
    width1 = 760 - margin1.left - margin1.right,
    height1 = 500 - margin1.top - margin1.bottom;

var chart1 = d3.select("#chart1")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("text-align", "center")
    .style("width", "300px")
    .style("height", "98px")
    .style("padding-top", "14px")
    .style("font", "8px")
    .style("background", "lightgrey")
    .style("border", "0px")
    .style("border-radius", "8px")
    .style("pointer-events", "none")
    .style("opacity", 0);

d3.json("./data/gum.json", function(error, data1) {

  var x1 = d3.scaleLinear()
    .domain([1835, 1945])
    .range([0, width1]);

  var xAxis1 = chart1.append("g")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(x1));

  var y1 = d3.scaleLinear()
    .domain([0, 600])
    .range([height1, 0]);

  var yAxis1 = chart1.append("g")
    .call(d3.axisLeft(y1));

  var zoom1 = d3.zoom()
      .scaleExtent([0.5, 10])
      .extent([[0, 0], [width1, height1]])
      .on("zoom", updateChart1);

  chart1.append("rect")
      .attr("width", width1)
      .attr("height", height1)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')')
      .call(zoom1);

  var clip1 = chart1.append("defs").append("chart:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", width1)
    .attr("height", height1)
    .attr("x", 0)
    .attr("y", 0);

  var scatter1 = chart1.append("g")
    .attr("clip-path", "url(#clip)");

  scatter1.selectAll(".dot")
      .data(data1)
    .enter().append("circle")
      .style("fill", "steelblue")
      .style("stroke", "black")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function (d) { return x1(d.year); })
      .attr("cy", function (d) {return y1(d.vx); })
      .on("mouseover", function(d) {
        tooltip1.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip1.html("Place of export: " + d["cntr_desc"] + "<br/> Year: " + d["year"] + "<br/> Quantity: " + d["vx"] + " metric tons")
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip1.transition()
          .duration(500)
          .style("opacity", 0);
      });

    function updateChart1() {

      var newX1 = d3.event.transform.rescaleX(x1);
      var newY1 = d3.event.transform.rescaleY(y1);

      xAxis1.call(d3.axisBottom(newX1))
      yAxis1.call(d3.axisLeft(newY1))

      scatter1.selectAll("circle")
        .attr("cx", function(d) {return newX1(d.year)})
        .attr("cy", function(d) {return newY1(d.vx)});

    }

});
