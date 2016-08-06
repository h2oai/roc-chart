import drawArea from './src/drawArea';
import drawCurve from './src/drawCurve';
import drawAUCText from './src/drawAUCText';
import generatePoints from './src/generatePoints';
import calculateArea from './src/calculateArea';
import prepareAxes from './src/prepareAxes';
import drawAxes from './src/drawAxes';
import drawBoundaries from './src/drawBoundaries';
import d3 from 'd3';

module.exports = {
  plot: function plot(selector, data, options) {
    // set default configuration
    const cfg = {
      margin: { top: 60, right: 60, bottom: 60, left: 60 },
      width: 470,
      height: 470,
      interpolationMode: 'basis',
      ticks: undefined,
      tickValues: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      animate: undefined,
      hideTicks: undefined,
      hideAxes: undefined,
      hideBoundaries: undefined,
      hideAUCText: undefined,
      curveColors: undefined
    };

    // Put all of the options into a variable called cfg
    if (typeof options !== 'undefined') {
      for (const i in options) {
        if (typeof options[i] !== 'undefined') { cfg[i] = options[i]; }
      }// for i
    }// if

    const interpolationMode = cfg.interpolationMode;
    const animate = cfg.animate;
    const hideAxes = cfg.hideAxes;
    const hideBoundaries = cfg.hideBoundaries;
    const hideTicks = cfg.hideTicks;
    const hideAUCText = cfg.hideAUCText;
    const curveColors = cfg.curveColors;

    // use these dimensions for the parent SVG
    const innerWidth = cfg.width;
    const innerHeight = cfg.height;
    const margin = cfg.margin;

    let svgWidth;
    if (String(innerWidth).indexOf('%') > -1) {
      svgWidth = innerWidth;
    } else {
      svgWidth = innerWidth + margin.left + margin.right;
    }

    let svgHeight;
    if (String(innerHeight).indexOf('%') > -1) {
      svgHeight = innerHeight;
    } else {
      svgHeight = innerHeight + margin.top + margin.bottom;
    }

    // use these dimensions for everything else
    // and know that they will be SVG-scaled
    // since we set the viewBox attribute
    const width = 100;
    const height = 100;

    const format = d3.format('.2');
    const aucFormat = d3.format('.4r');

    const x = d3.scale.linear()
      .range([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    let color;
    if (typeof curveColors !== 'undefined') {
      color = d3.scale.ordinal().range(curveColors);
    } else {
      color = d3.scale.category10();
      // color = d3.scale.ordinal().range(['steelblue', 'red', 'green', 'purple']);
    }

    // prepare the axes if specified in the config
    let axes;
    if (!hideAxes) {
      axes = prepareAxes(cfg, format, x, y); // eslint-disable-line
    }

    const svg = d3.select(selector)
      .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', '0 0 100 100')
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const chartArea = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    x.domain([0, 1]);
    y.domain([0, 1]);

    // draw the axes if specified in the config
    if (typeof hideAxes === 'undefined') {
      drawAxes(svg, axes, height, width);
    }
    // draw the random guess line
    chartArea.append('line')
      .attr('class', 'curve')
      .style('stroke', 'black')
      .attr({
        x1: 0,
        x2: width,
        y1: height,
        y2: 0
      })
      .style({
        'stroke-width': () => {
          if (width > 200) return '2px';
          return '1px';
        },
        'stroke-dasharray': '8',
        opacity: 0.4
      });

    let areaID;

    // calculate the area under each curve
    data.forEach(d => {
      const points = generatePoints(d.values, 'fpr', 'tpr');
      const auc = calculateArea(points);
      d.auc = auc;
    });

    // draw curves, areas, and text for each
    // true-positive rate in the data

    // draw areas
    data.forEach((d, i) => {
      drawArea(d.values, chartArea, height, d.name, x, y, color(i));
    });

    // draw curves on top of areas to ensure that curve mouseover works
    data.forEach((d, i) => {
      const label = d.label || d.name;
      drawCurve(d.values, chartArea, d.name, color(i), x, y, areaID, interpolationMode);
      drawAUCText(chartArea, d.name, width, height, label, aucFormat, d.auc);
    });

    //
    // animate through areas for each curve
    //
    if (typeof animate !== 'undefined') {
      // sort data ascending by AUC
      const dataAscByAUC = data
        .sort((a, b) => a.auc - b.auc);

      for (let k = 0; k < dataAscByAUC.length; k++) {
        areaID = `#${dataAscByAUC[k].name}Area`;
        chartArea.select(areaID)
          .transition()
            .delay(2000 * (k + 1))
            .duration(250)
            .style('opacity', 0.4)
          .transition()
            .delay(2000 * (k + 2))
            .duration(250)
            .style('opacity', 0);

        const textClass = `.${dataAscByAUC[k].name}text`;
        chartArea.selectAll(textClass)
          .transition()
            .delay(2000 * (k + 1))
            .duration(250)
            .style('opacity', 0.9)
          .transition()
            .delay(2000 * (k + 2))
            .duration(250)
            .style('opacity', 0);
      }
    }

    // styles
    svg.selectAll('text')
      .style({
        // 'font-size': '12px',
        'font-family': 'Open Sans'
      });

    svg.selectAll('path.curve')
      .style({
        'stroke-width': () => {
          if (width > 200) return '3px';
          return '1px';
        },
        fill: 'none',
        opacity: 0.7
      });

    svg.selectAll('.axis path')
      .style({
        fill: 'none',
        stroke: 'grey',
        'stroke-width': () => {
          if (width > 200) return '2px';
          return '1px';
        },
        'shape-rendering': 'crispEdges',
        opacity: 1
      });

    svg.selectAll('.axis line')
      .style({
        fill: 'none',
        stroke: 'grey',
        'stroke-width': () => {
          if (width > 200) return '2px';
          return '1px';
        },
        'shape-rendering': 'crispEdges',
        opacity: 1
      });

    svg.selectAll('.d3-tip')
      .style({
        'font-family': 'Verdana',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '8px',
        color: 'white',
        'z-index': 5070
      });

    // if hideTicks is truthy, then hide the ticks
    if (typeof hideTicks !== 'undefined') {
      svg.selectAll('.tick')
        .style('opacity', 0);
    }

    if (typeof hideAUCText !== 'undefined') {
      svg.selectAll('.AUCText')
        .style('opacity', 0);
    }

    if (typeof hideBoundaries === 'undefined') { drawBoundaries(chartArea, width, height); }
  }
};
