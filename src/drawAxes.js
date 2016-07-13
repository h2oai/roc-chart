export default function (svg, axes, height, width) {
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(axes.x)
    .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .style('text-anchor', 'middle')
      .text('False Positive Rate');

  const xAxisG = svg.select('g.x.axis');
/*
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
*/
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
    .call(axes.y)
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
}
