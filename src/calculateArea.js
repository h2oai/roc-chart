export default function (points) {
  // use numerical integration to calcuate area
  let area = 0.0;
  const length = points.length;
  if (length <= 2) { return area; }
  points.forEach((d, i) => {
    const x = 0;
    const y = 1;
    if('undefined' !== typeof points[i-1]){
      area += (points[i][x] - points[i-1][x]) * (points[i-1][y] + points[i][y]) / 2;
    } 
  });
  return area;
}
