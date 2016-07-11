import curve from './curve';

export default function (data, svg, tpr, fpr, stroke, x, y, areaID, interpolationMode) {
  // draw the ROC curves
  svg.append('path')
    .attr('class', 'curve')
    .style('stroke', stroke)
    .attr('d', curve(data, tpr, fpr, interpolationMode, x, y))
    .on('mouseover', function(d) {
      areaID = '#' + tpr + 'Area';
      svg.select(areaID)
        .style('opacity', .4)

      var aucText = '.' + tpr + 'text'; 
      svg.selectAll(aucText)
        .style('opacity', .9)
      })
    .on('mouseout', function(){
      areaID = '#' + tpr + 'Area';
      svg.select(areaID)
        .style('opacity', 0)

      var aucText = '.' + tpr + 'text'; 
      svg.selectAll(aucText)
        .style('opacity', 0)
    });
}
