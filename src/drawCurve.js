import curve from './curve';

export default function (data, svg, model, stroke, x, y, areaID, interpolationMode) {
  // draw the ROC curves
  svg.append('path')
    .attr('class', 'curve')
    .style('stroke', stroke)
    .attr('d', curve(data, interpolationMode, x, y))
    .on('mouseover', () => {
      areaID = `#${model}Area`;
      svg.select(areaID)
        .style('opacity', 0.4);

      const aucText = `.${model}text`;
      svg.selectAll(aucText)
        .style('opacity', 0.9);
    })
    .on('mouseout', () => {
      areaID = `#${model}Area`;
      svg.select(areaID)
        .style('opacity', 0);

      const aucText = `.${model}text`;
      svg.selectAll(aucText)
        .style('opacity', 0);
    });
}
