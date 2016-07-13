export default function (selector, width, height) {
  selector.append('rect')
    .attr({
      x: -1,
      y: -1,
      width: width + 1,
      height: height + 1
    })
    .style({
      stroke: '#999999',
      'stroke-opacity': 1,
      'stroke-width': 1,
      fill: 'none',
      'pointer-events': 'none'
    });
}
