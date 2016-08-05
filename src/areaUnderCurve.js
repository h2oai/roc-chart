import d3 from 'd3';

export default function (data, height, xScale, yScale) {
  const areaGenerator = d3.svg.area()
    .x(d => xScale(d.fpr))
    .y0(height)
    .y1(d => yScale(d.tpr));
  return areaGenerator(data);
}
