export default function (data, tpr, fpr, interpolationMode, xScale, yScale) {
  var lineGenerator = d3.svg.line()
   .interpolate(interpolationMode)
   .x(function(d) { return xScale(d[fpr]); })
   .y(function(d) { return yScale(d[tpr]); });
  return lineGenerator(data);
}