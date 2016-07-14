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
      margin: { top: 30, right: 20, bottom: 70, left: 61 },
      width: 470,
      height: 450,
      interpolationMode: 'basis',
      ticks: undefined,
      tickValues: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      fpr: 'fpr',
      tprVariables: [{
        name: 'tpr0',
      }],
      animate: true,
      hideTicks: false,
      hideAxes: undefined,
      hideBoundaries: undefined
    };

    // console.log('options passed to rocChart.plot', options);

    // Put all of the options into a variable called cfg
    if (typeof options !== 'undefined') {
      for (const i in options) {
        if (typeof options[i] !== 'undefined') { cfg[i] = options[i]; }
      }// for i
    }// if

    const tprVariables = cfg.tprVariables;
    // if values for labels are not specified
    // set the default values for the labels to the corresponding
    // true positive rate variable name
    tprVariables.forEach((d) => {
      if (typeof d.label === 'undefined') {
        d.label = d.name;
      }
    });

    // console.log('tprVariables', tprVariables);

    const interpolationMode = cfg.interpolationMode;
    const fpr = cfg.fpr;
    const width = cfg.width;
    const height = cfg.height;
    const animate = cfg.animate;
    const margin = cfg.margin;
    const hideAxes = cfg.hideAxes;
    const hideBoundaries = cfg.hideBoundaries;

    const format = d3.format('.2');
    const aucFormat = d3.format('.4r');

    const x = d3.scale.linear()
      .range([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    const color = d3.scale.category10();
    // const color = d3.scale.ordinal().range(['steelblue', 'red', 'green', 'purple']);

    // prepare the axes if specified in the config
    let axes;
    if (!hideAxes) {
      axes = prepareAxes(cfg, format, x, y); // eslint-disable-line
    }

    const svg = d3.select(selector)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

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
    tprVariables.forEach(d => {
      const tpr = d.name;
      const points = generatePoints(data, fpr, tpr);
      const auc = calculateArea(points);
      d.auc = auc;
    });

    // console.log('tprVariables', tprVariables);

    // draw curves, areas, and text for each
    // true-positive rate in the data
    tprVariables.forEach((d, i) => {
      // console.log('drawing the curve for', d.label)
      // console.log('color(', i, ')', color(i));
      // console.log('x scale', x);
      // console.log('y scale', y);
      const tpr = d.name;
      drawArea(data, chartArea, height, tpr, fpr, x, y, color(i));
      drawCurve(data, chartArea, tpr, fpr, color(i), x, y, areaID, interpolationMode);
      drawAUCText(chartArea, tpr, width, height, d.label, aucFormat, d.auc);
    });

    //
    // animate through areas for each curve
    //
    if (animate && animate !== 'false') {
      // sort tprVariables ascending by AUC
      const tprVariablesAscByAUC = tprVariables.sort((a, b) => a.auc - b.auc);

      // console.log('tprVariablesAscByAUC', tprVariablesAscByAUC);
      for (let k = 0; k < tprVariablesAscByAUC.length; k++) {
        areaID = `#${tprVariablesAscByAUC[k].name}Area`;
        chartArea.select(areaID)
          .transition()
            .delay(2000 * (k + 1))
            .duration(250)
            .style('opacity', 0.4)
          .transition()
            .delay(2000 * (k + 2))
            .duration(250)
            .style('opacity', 0);

        const textClass = `.${tprVariablesAscByAUC[k].name}text`;
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

    if (options.hideTicks) {
      svg.selectAll('.tick')
        .style('opacity', 0);
    }

    if (typeof hideBoundaries === 'undefined') { drawBoundaries(chartArea, width, height); }
  }
};
