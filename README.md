## roc-chart

the #d3js bl.ock [Animated ROC Chart](http://bl.ocks.org/micahstubbs/f2aff83148a5f64f3222) packaged up as an node module.

the `data` parameter to `rocChart.plot()` should be an array of objects.

#### example  

install `rocChart` from the terminal:  


```
$ # TODO: add instructions for installing from internal Sonatype Nexus npm repository
$ npm i rocChart --save
```

then, in your project:

```
import rocChart from 'rocChart';

export function drawROCChart() {
  const data = // TODO: add example data
   
  rocChart.plot('body', data);
}
```

see this working [example project](https://github.com/h2oai/visualizations/tree/roc-chart-example-project/roc-chart-example-project) that uses the [webpack](https://webpack.github.io/) module bundler to load our friendly [rocChart](https://www.npmjs.com/package/dropline) module and plot an ROC chart. 

![roc-chart-1](http://i.giphy.com/3o6ZtoQ6Fi64DImnmw.gif)