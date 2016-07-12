import d3 from 'd3';

export default function (data, tpr, fpr, interpolationMode, xScale, yScale) {
  const lineGenerator = d3.svg.line()
   .interpolate(interpolationMode)
   .x(d => xScale(d[fpr]))
   .y(d => yScale(d[tpr]));
  return lineGenerator(data);
}
