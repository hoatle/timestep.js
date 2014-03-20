timestep.js
===========

timeStep - useful for accelerating callback step during time frames (steps).


Usage
-----

```js
timeStep(stepFn, stepNumber, minTime, maxTime, [easing])
```

Example
-------

```js
// Example 1:
timeStep(function(ctx) {
  console.log('at step: ' + ctx.step);
  //stop at step 30
  if (ctx.step === 30) {
    ctx.stop();
  }
}, 50, 500, 2500); //linear easing by default
```

```js
// Example 2:
var easeInCubic = function(t, b, c, d) {
  return c*(t/=d)*t*t + b;
};

timeStep(function(ctx) {
  console.log('at step: ' + ctx.step);
}, 50, 500, 2500, easeInCubic);
```

```js
//Example 3:
timeStep.extendEasing({
  easeInSine: function (t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  }
});

timeStep(function(ctx) {
  console.log('at step: ' + ctx.step);
}, 50, 500, 2500, 'easeInSine');
```
