import curve from './curve';

export default function (data, svg, tpr, fpr, stroke, x, y, areaID, interpolationMode) {
  // draw the ROC curves
  svg.append('path')
    .attr('class', 'curve')
    .style('stroke', stroke)
    .attr('d', curve(data, tpr, fpr, interpolationMode, x, y))
    .on('mouseover', () => {
      areaID = `#${tpr}Area`;
      svg.select(areaID)
        .style('opacity', 0.4);

      const aucText = `.${tpr}text`;
      svg.selectAll(aucText)
        .style('opacity', 0.9);
    })
    .on('mouseout', () => {
      areaID = `#${tpr}Area`;
      svg.select(areaID)
        .style('opacity', 0);

      const aucText = `.${tpr}text`;
      svg.selectAll(aucText)
        .style('opacity', 0);
    });
}
