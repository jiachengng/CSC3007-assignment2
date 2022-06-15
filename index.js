// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 150, left: 100 },
  width = 900 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// 2020 crime rate data
d3.csv("cases-recorded-for-selected-major-offences.csv").then(function (data) {
  console.log(data);

  // Xaxis
  const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.level_2))
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "15px")
    .style("color", "black");

  // Yaxis
  const y = d3.scaleLinear()
  .domain([0, 17000])
  .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .style("color", "black")
    .style("font-size", "15px");

  // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
    d3.select(this)
      .style("stroke", "red")
      .style("opacity", 1)
      .style("stroke-width", 3);
  };
  var mousemove = function (d, i) {
    Tooltip.html("Total Cases: " + i.value)
      .style("left", d3.mouse(this)[0] + 70 + "px")
      .style("top", d3.mouse(this)[1] + "px");
  };
  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.level_2)) // X axis, types of crime
    .attr("y", (d) => y(d.value)) // Y axis, number of times crime occured
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", "#008080")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});