import areaUnderCurve from './areaUnderCurve';

export default function (data, svg, height, tpr, fpr, x, y, fill) {
  // draw the area under the ROC curves
  svg.append('path')
    .attr('class', 'area')
    .attr('id', `${tpr}Area`)
    .style({
      fill,
      opacity: 0
    })
    .attr('d', areaUnderCurve(data, height, tpr, fpr, x, y));
}
