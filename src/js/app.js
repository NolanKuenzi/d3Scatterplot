import "../css/style.css";
import * as d3 from "d3";

const width = 1000;
const height = 600;

let svg = d3.select("svg")
			  .attr("id", "svg")
              .attr("width", width)
              .attr("height", height);

const margin = {top: 55, right: 90, bottom: 60, left: 80};
const viewWidth = +svg.attr("width") - margin.left - margin.right;
const viewHeight = +svg.attr("height") - margin.top - margin.bottom;

svg = svg.append("g")
    	 .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function scatterPlotGraph() {
const req = new XMLHttpRequest();
  req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", true);
  req.send();
  req.onload = function() {
const data = JSON.parse(req.responseText);

const parseYear = d3.timeParse("%Y");

const xAxisScale = d3.scaleTime()
  				     .domain([d3.min(data, d => parseYear(d.Year - 1)), d3.max(data, d => parseYear(d.Year + 1))])
  				     .range([0, viewWidth]);

const xAxisCall = d3.axisBottom(xAxisScale)

const xAxis = svg.append("g")
				 .attr("id", "x-axis")
				 .attr("transform", "translate(" + 0 + "," + viewHeight + ")")
				 .call(xAxisCall)
				 .selectAll(".tick line")

const parseTime = d3.timeParse("%M:%S");

const yAxisScale = d3.scaleTime()
					 .domain([d3.max(data, d => parseTime(d.Time)), d3.min(data, d => parseTime(d.Time))])
					 .range([viewHeight, 0]);

const mins_secs = d3.timeFormat("%M:%S");

const yAxisCall = d3.axisLeft(yAxisScale)
					.tickFormat(mins_secs);

const yAxis = svg.append("g")
				 .attr("id", "y-axis")
				 .call(yAxisCall);	

const toolTip = d3.select("body")
                  .append("div")
                  .attr("id", "toolTip");		
							  
	  svg.append("rect")
		 .attr("id", "legend")
		 .attr("x", 840)
		 .attr("y", 250)
		 .attr("height", "18")
		 .attr("width", "18")
		 .style("fill", "#00bfff")

	  svg.append("text")
		 .text("No doping allegations")
		 .attr("x", 730)
		 .attr("y", 262.5)
		 .style("font-size", "12px")

	  svg.append("rect")
		 .attr("id", "legend")
		 .attr("x", 840)
		 .attr("y", 270)
		 .attr("height", "18")
		 .attr("width", "18")
		 .style("fill", "#830303")

	  svg.append("text")
		 .text("Riders with doping allegations")
		 .attr("x", 690)
		 .attr("y", 282.5)
		 .style("font-size", "12px")

	svg.append("text")
       .attr("text-anchor", "end")
       .attr("x", -25)
       .attr("y", -45)
       .attr("transform", "rotate(-90)")
	   .text("Time in Minutes")
	   .style("font-size", "20px")

const circles = d3.select("svg")
				  .append("g")
				  .selectAll("circle")
				  .data(data)
				  .enter()
				  .append("circle")
				  .attr("class", "dot")
				  .attr("id", "dotId")
				  .attr("data-xvalue", d => d.Year)
				  .attr("data-yvalue", d => d.Time)
				  .attr("cx", d => xAxisScale(parseYear(d.Year)) + margin.left)
				  .attr("cy", d => yAxisScale(parseTime(d.Time)) + margin.top)
				  .attr("r", 7)
    			  .style("fill", d => d.Doping === "" ? "#00bfff" : "#830303")
    			  .style("stroke", "black")
    			  .on("mouseover", function(d) {
    			  	toolTip
    			      .attr("data-year", d.Year)
    			      .style("left", d3.event.pageX + 15 + "px")
	                  .style("top", d3.event.pageY + -15 + "px")
	                  .style("display", "inline-block")
	                  .html(() => `${d.Name}: ${d.Nationality} <br> Year: ${d.Year}, Time: ${d.Time} <br><br> ${d.Doping}`)
    			  })
    			  .on("mouseleave", function(d) {
    			  	toolTip
    			  	  .style("display", "none")
    			  });

    		/* For Mobile Devices */
   	const clear = document.querySelector("body");
   	clear.addEventListener("touchstart", function(e) {
   	const clearToolTip = document.querySelectorAll("#toolTip");
   		if (e.target.id !== "dotId") {
   			for (let i = 0; i < clearToolTip.length; i++) {
   				clearToolTip[i].style.display = "none";
   			} 
   		}
	 });
  
  };
}
scatterPlotGraph();


