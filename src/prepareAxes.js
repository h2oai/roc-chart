import d3 from 'd3';

export default function (cfg, format, xScale, yScale) {
  const axes = {};
  axes.x = d3.svg.axis()
    .scale(xScale)
    .orient('top')
    .outerTickSize(0);

  axes.y = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .outerTickSize(0);

  // set the axis ticks based on input parameters,
  // if ticks or tickValues are specified
  if (typeof cfg.ticks !== 'undefined') {
    axes.x.ticks(cfg.ticks);
    axes.y.ticks(cfg.ticks);
  } else if (typeof cfg.tickValues !== 'undefined') {
    axes.x.tickValues(cfg.tickValues);
    axes.y.tickValues(cfg.tickValues);
  } else {
    axes.x.ticks(5);
    axes.y.ticks(5);
  }

  // apply the format to the ticks we chose
  axes.x.tickFormat(format);
  axes.y.tickFormat(format);

  return axes;
}
