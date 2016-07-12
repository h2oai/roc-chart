export default function (data, x, y) {
  const points = [];
  data.forEach(d => { points.push([Number(d[x]), Number(d[y])]); });
  return points;
}
