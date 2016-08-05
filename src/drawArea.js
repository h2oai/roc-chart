import areaUnderCurve from './areaUnderCurve';

export default function (data, svg, height, model, x, y, fill) {
  // draw the area under the ROC curves
  svg.append('path')
    .attr('class', 'area')
    .attr('id', `${model}Area`)
    .style({
      fill,
      opacity: 0
    })
    .attr('d', areaUnderCurve(data, height, x, y));
}
