// Capstone for CSE 478 by Yousef Sandoqa 
const tools = d3.select(".tooltip");
const bar = d3.select("#barChart");
const scat = d3.select("#scatterPlot");
const mar = { top: 50, right: 60, bottom: 100, left: 70 };
const w = 800 - mar.left - mar.right;
const h = 400 - mar.top - mar.bottom;
let data;
// Created margins and bar/scatter plot dimensions
d3.csv("cleaned_data.csv").then(data1 => {
    data = data1;
    visualUp("All");
    d3.select("#genderFilter").on("change", function () {
        visualUp(this.value);
    });
}); 
//read the cleaned data and call the visualUp function
function visualUp(gender) {
    const filtered = gender === "All" ? data : data.filter(d => d.Gender === gender);
    drawBarChart(filtered);
    drawScatterPlot(filtered);
}
// allows for filtering between genders, and draws the bar and scatter plots
// using the filtered data
function drawBarChart(data) {
    bar.selectAll("*").remove();
    const svg = bar.append("g")
        .attr("transform", `translate(${mar.left},${mar.top})`);
    const counts = d3.rollup(data, v => v.length, d => d.Depression);
    const dataset = Array.from(counts, ([depression, count]) => ({
    label: depression === "1" ? "Depressed" : "Not Depressed",
    count: count
}));
// Create a dataset for the bar chart
const x = d3.scaleBand().domain(dataset.map(d => d.label)).range([0, w]).padding(0.3);
const y = d3.scaleLinear().domain([0, d3.max(dataset, d => d.count)]).nice().range([h, 0]);
// Create x and y scales
svg.append("g")
    .attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(x));
svg.append("g")
    .call(d3.axisLeft(y));
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", d => x(d.label))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => h - y(d.count))
    .attr("fill", d => d.label === "Depressed" ? "#FFA500" : "#1f77b4")
    .attr("font-size", "26px")
    .on("mouseover", (event, d) => {
    tools.transition().duration(200).style("opacity", 1);
    tools.html(`${d.label}<br/>Count: ${d.count}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", () => tools.transition().duration(300).style("opacity", 0));
}
// Draws the bar chart using the filtered data
// The bar chart shows the number of people who are depressed and not depressed
function drawScatterPlot(data) {
    scat.selectAll("*").remove();
    const svg = scat.append("g").attr("transform", `translate(${mar.left},${mar.top})`);
    data.forEach(d => {
        d.Age = +d.Age;
        d.Hours = +d["Work/Study Hours"];
});
// Convert Age and Hours to numbers 
const x = d3.scaleLinear().domain(d3.extent(data, d => d.Hours)).nice().range([0, w]);
const y = d3.scaleLinear().domain(d3.extent(data, d => d.Age)).nice().range([h, 0]);
// Create x and y scales
svg.append("g")
    .attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(x).ticks(5));
svg.append("g")
    .call(d3.axisLeft(y).ticks(5));
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.Hours))
    .attr("cy", d => y(d.Age))
    .attr("r", 5)
    .attr("fill", d => d.Depression === "1" ? "#FFA500" : "#1f77b4")
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => {
    tools.transition().duration(200).style("opacity", 1);
    tools.html(`Age: ${d.Age}<br/>Hours: ${d.Hours}<br/>Depression: ${d.Depression === "1" ? "Yes" : "No"}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", () => tools.transition().duration(300).style("opacity", 0));
// Draws the scatter plot using the filtered data
// The scatter plot shows the relationship between age and work/study hours
svg.append("text")
    .attr("x", w / 2)
    .attr("y", h + mar.bottom - 10)
    .attr("text-anchor", "middle")
    .text("Work/Study Hours");
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - mar.left + 20)
    .attr("x", 0 - (h / 2))
    .attr("text-anchor", "middle")
    .text("Age");
svg.append("text")
    .attr("x", w / 2)
    .attr("y", 0 - mar.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Scatter Plot of Age vs Work/Study Hours");
}
// Draws the scatter plot using the filtered data
// The scatter plot shows the relationship between age and work/study hours and depression status