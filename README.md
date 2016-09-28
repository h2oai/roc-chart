## roc-chart

the #d3js bl.ock [Animated ROC Chart](http://bl.ocks.org/micahstubbs/f2aff83148a5f64f3222) packaged up as an node module. 

#### example  

to install `rocChart`:


``` 
$ npm i rocChart --save  
```

then, in your project:

```
import rocChart from 'rocChart';

export function drawROCChart() {
  const data = // your data
   
  rocChart.plot('body', data, options);
}
```

![roc-chart-1](http://i.giphy.com/3o6ZtoQ6Fi64DImnmw.gif)

#### options

pass an options object containing the values for these propteries to configure the ROC Chart:

**curveColors** an array of strings containing CSS color names or color hex codes. the values in this array are used to set the stroke color of each ROC curve.

`'curveColors': ['blue', 'orange', 'steelblue', 'red', 'green', 'purple']`

`TODO: document remaining options`