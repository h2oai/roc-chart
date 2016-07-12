import drawArea from './src/drawArea';
import drawCurve from './src/drawCurve';
import drawAUCText from './src/drawAUCText';
import generatePoints from './src/generatePoints';
import calculateArea from './src/calculateArea';
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
      hideTicks: false
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

    const format = d3.format('.2');
    const aucFormat = d3.format('.4r');

    const x = d3.scale.linear().range([0, width]);
    const y = d3.scale.linear().range([height, 0]);
    const color = d3.scale.category10();
    // const color = d3.scale.ordinal().range(['steelblue', 'red', 'green', 'purple']);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('top')
      .outerTickSize(0);

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .outerTickSize(0);

    // set the axis ticks based on input parameters,
    // if ticks or tickValues are specified
    if (typeof cfg.ticks !== 'undefined') {
      xAxis.ticks(cfg.ticks);
      yAxis.ticks(cfg.ticks);
    } else if (typeof cfg.tickValues !== 'undefined') {
      xAxis.tickValues(cfg.tickValues);
      yAxis.tickValues(cfg.tickValues);
    } else {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }

    // apply the format to the ticks we chose
    xAxis.tickFormat(format);
    yAxis.tickFormat(format);

    const svg = d3.select(selector)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

    x.domain([0, 1]);
    y.domain([0, 1]);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .append('text')
          .attr('x', width / 2)
          .attr('y', 40)
          .style('text-anchor', 'middle')
          .text('False Positive Rate');

    const xAxisG = svg.select('g.x.axis');

    // draw the top boundary line
    xAxisG.append('line')
      .attr({
        x1: -1,
        x2: width + 1,
        y1: -height,
        y2: -height
      });

    // draw a bottom boundary line over the existing
    // x-axis domain path to make even corners
    xAxisG.append('line')
      .attr({
        x1: -1,
        x2: width + 1,
        y1: 0,
        y2: 0
      });

    // position the axis tick labels below the x-axis
    xAxisG.selectAll('.tick text')
      .attr('transform', `translate(0, ${25})`);

    // hide the y-axis ticks for 0 and 1
    xAxisG.selectAll('g.tick line')
        .style('opacity', d => {
          switch (d % 1) {
            // if d is an integer
            case 0:
              return 0;
            default:
              return 1;
          }
        });

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35)
        // manually configured so that the label is centered vertically
        .attr('x', 0 - height / 1.56)
        .style('font-size', '12px')
        .style('text-anchor', 'left')
        .text('True Positive Rate');

    const yAxisG = svg.select('g.y.axis');

    // add the right boundary line
    yAxisG.append('line')
      .attr({
        x1: width,
        x2: width,
        y1: 0,
        y2: height
      });

    // position the axis tick labels to the right of
    // the y-axis and
    // translate the first and the last tick labels
    // so that they are right aligned
    // or even with the 2nd digit of the decimal number
    // tick labels
    yAxisG.selectAll('g.tick text')
      .attr('transform', d => {
        if (d % 1 === 0) { // if d is an integer
          return `translate(${-22}, 0)`;
        } else if ((d * 10) % 1 === 0) { // if d is a 1 place decimal
          return `translate(${-32}, 0)`;
        }
        return `translate(${-42}, 0)`;
      });

    // hide the y-axis ticks for 0 and 1
    yAxisG.selectAll('g.tick line')
      .style('opacity', d => {
        switch (d % 1) {
          // if d is an integer
          case 0:
            return 0;
          default:
            return 1;
        }
      });

    // draw the random guess line
    svg.append('line')
      .attr('class', 'curve')
      .style('stroke', 'black')
      .attr({
        x1: 0,
        x2: width,
        y1: height,
        y2: 0
      })
      .style({
        'stroke-width': 2,
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
      drawArea(data, svg, height, tpr, fpr, x, y, color(i));
      drawCurve(data, svg, tpr, fpr, color(i), x, y, areaID, interpolationMode);
      drawAUCText(svg, tpr, width, height, d.label, aucFormat, d.auc);
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
        svg.select(areaID)
          .transition()
            .delay(2000 * (k + 1))
            .duration(250)
            .style('opacity', 0.4)
          .transition()
            .delay(2000 * (k + 2))
            .duration(250)
            .style('opacity', 0);

        const textClass = `.${tprVariablesAscByAUC[k].name}text`;
        svg.selectAll(textClass)
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
        'stroke-width': 3,
        fill: 'none',
        opacity: 0.7
      });

    svg.selectAll('.axis path')
      .style({
        fill: 'none',
        stroke: 'grey',
        'stroke-width': 2,
        'shape-rendering': 'crispEdges',
        opacity: 1
      });

    svg.selectAll('.axis line')
      .style({
        fill: 'none',
        stroke: 'grey',
        'stroke-width': 2,
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
  }
};
