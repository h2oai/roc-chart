export default function (svg, model, width, height, label, aucFormat, auc) {
  svg.append('g')
    .attr('class', `${model}text`)
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
    .attr('class', `${model}text`)
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
