export default function (svg, tpr, width, height, label, aucFormat, auc) {
  svg.append('g')
    .attr('class', `${tpr}text`)
    .style('opacity', 0)
    .attr('transform', `translate(${0.5 * width}, ${0.79 * height})`)
    .append('text')
      .attr('class', 'AUCText')
      .text(label)
      .style({
        fill: 'white',
        'font-size': () => width / 25
      });

  svg.append('g')
    .attr('class', `${tpr}text`)
    .style('opacity', 0)
    .attr('transform', `translate(${0.5 * width}, ${0.84 * height})`)
    .append('text')
      .attr('class', 'AUCText')
      .text(`AUC = ${aucFormat(auc)}`)
      .style({
        fill: 'white',
        'font-size': () => width / 25
      });
}
