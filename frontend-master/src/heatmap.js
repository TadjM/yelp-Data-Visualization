import React, { Component } from 'react';
import * as d3 from 'd3';

// dimensions

class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newData: []
        }
    }

    componentDidMount() {
        this.setState({
            newData: this.props.data2
        })
        this.createChart();
    }
    componentDidUpdate(prevProps, prevState) {
        // only update chart if the data has changed
        if (prevProps !== this.props) {
            this.updateChart()
        }
    }


    getBusinessName(business_id){
        
    }


    createChart() {

        const { data, data2 } = this.props



        var margin = { top: 120, right: 40, bottom: 40, left: 110 };

        var width = 1500 - margin.right - margin.left,
            height = 900 - margin.top - margin.bottom;

        var x_elements = d3.set(data.map(function (item) { return item.business_id; })).values(),
            y_elements = d3.set(data.map(function (item) { return item.attribute; })).values();

        var itemSize = x_elements > 100 ? 13 : 20,
            cellSize = itemSize - 1

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var xScale = d3.scaleBand()
            .domain(x_elements)
            .rangeRound([0, x_elements.length * itemSize]);

        var xAxis = d3.axisTop(xScale)
            .tickFormat(function (d) {
                return d;
            })

        var yScale = d3.scaleBand()
            .domain(y_elements)
            .rangeRound([0, y_elements.length * itemSize]);

        var yAxis = d3.axisLeft(yScale)
            .tickFormat(function (d) {
                return d;
            })

        var green_color = d3.scaleLinear()
            .domain(d3.range(0, 1, 0.2))
            .range(["#006400", "#008a00", "#00b000", "#00d600", "#00ff00"]);

        var svg = d3.select('#heatmap')
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom * 2)
            .append("g")
            .attr("id", "update")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cells = svg.selectAll('rect')
            .data(data)
            .enter().append('g').append('rect')
            .attr('class', 'cell')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('y', function (d) { return yScale(d.attribute); })
            .attr('x', function (d) { return xScale(d.business_id); })
            .attr('fill', function (d) { return green_color(d.correlation); })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.correlation)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .style("text-anchor", "end");

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", ".5em")
            .attr("transform", function (d) {
                return "rotate(-65)";
            });

    }

    updateChart() {

        const { data } = this.props


        // var itemSize = data.length > 100 ? 13 : 20,
        //     cellSize = itemSize - 1,
        var margin = { top: 120, right: 20, bottom: 20, left: 110 };

        var width = 1500 - margin.right - margin.left,
            height = 900 - margin.top - margin.bottom;

        var x_elements = d3.set(data.map(function (item) { return item.business_id; })).values(),
            y_elements = d3.set(data.map(function (item) { return item.attribute; })).values();

        var itemSize = x_elements > 100 ? 13 : 20,
            cellSize = itemSize - 1;
        console.log("xsize ", x_elements.length, " ysize ", y_elements.length);

        var xScale = d3.scaleBand()
            .domain(x_elements)
            .rangeRound([0, x_elements.length * itemSize]);

        var xAxis = d3.axisTop(xScale)
            .tickFormat(function (d) {
                return d;
            })

        var yScale = d3.scaleBand()
            .domain(y_elements)
            .rangeRound([0, y_elements.length * itemSize]);

        var yAxis = d3.axisLeft(yScale)
            .tickFormat(function (d) {
                return d;
            })

        var green_color = d3.scaleLinear()
            .domain(d3.range(0, 1, 0.2))
            .range(["#006400", "#008a00", "#00b000", "#00d600", "#00ff00"]);

        d3.select('#heatmap').selectAll("#update").remove();

        var svg = d3.select('#heatmap')
            .select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("id", "update")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var cells = svg.selectAll('rect')
            .data(data)
            .enter().append('g').append('rect')
            .attr('class', 'cell')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('y', function (d) { return yScale(d.attribute); })
            .attr('x', function (d) { return xScale(d.business_id); })
            .attr('fill', function (d) { return green_color(d.correlation); });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .style("text-anchor", "end");

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", ".5em")
            .attr("transform", function (d) {
                return "rotate(-65)";
            });
    }

    render() {
        console.log("data2", this.props.data2);
        return (
            <div id="heatmap" >
                <h3>Heat Map</h3>
            </div>
        )
    }
}

export default HeatMap;
