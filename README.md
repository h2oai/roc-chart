## roc-chart

the #d3js bl.ock [Animated ROC Chart](http://bl.ocks.org/micahstubbs/f2aff83148a5f64f3222) packaged up as an node module. 

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
   
  rocChart.plot('body', data, options);
}
```

see this working [example project](https://github.com/h2oai/visualizations/tree/roc-chart-example-project/roc-chart-example-project) that uses the [webpack](https://webpack.github.io/) module bundler to load our friendly [rocChart](https://github.com/h2oai/roc-chart) module and plot an ROC chart.   
`TODO: link to rocChart module on internal Sonatype Nexus repository page`  

![roc-chart-1](http://i.giphy.com/3o6ZtoQ6Fi64DImnmw.gif)

#### input data format

The input data is an array of objects  
Each object has a key `name` whose value is the name of a statistical model, like `deeplearning`  
Each object also has key called `values` whose value is yet another array of objects.
Each object in this nested array contains a true positive rate `tpr` key value pair and a false positive rate `fpr` key value pair

```javascript
[
  {
    "name": "deeplearning",
    "values": [
      {
        "fpr": 0,
        "tpr": 0.002
      },
      {
        "fpr": 0,
        "tpr": 0.006
      },
      {
        "fpr": 0,
        "tpr": 0.01
      },
      {
        "fpr": 0,
        "tpr": 0.012
      }
      // ...
```

#### options

pass an options object containing the values for these propteries to configure the ROC Chart:

**curveColors** an array of strings containing CSS color names or color hex codes. the values in this array are used to set the stroke color of each ROC curve.

`'curveColors': ['blue', 'orange', 'steelblue', 'red', 'green', 'purple']`

`TODO: document remaining options`