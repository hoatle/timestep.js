/**
 * timeStep
 *
 * useful for accelerating callback step during time frames (steps).
 *
 * Usage:
 *
 * timeStep(stepFn, stepNumber, minTime, maxTime, [easing])
 *
 * Example:
 *
 * // Example 1:
 * timeStep(function(ctx) {
 *  console.log('at step: ' + ctx.step);
 *  //stop at step 30
 *  if (ctx.step === 30) {
 *    ctx.stop();
 *  }
 * }, 50, 500, 2500); //liner easing by default
 *
 * // Example 2:
 * var easeInCubic = function(t, b, c, d) {
 *   return c*(t/=d)*t*t + b;
 * };
 *
 * timeStep(function(ctx) {
 *  console.log('at step: ' + ctx.step);
 * }, 50, 500, 2500, easeInCubic);
 *
 * // Example 3:
 *
 * timeStep.extendEasing({
 *   easeInSine: function (t, b, c, d) {
 *     return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
 *   }
 * });
 *
 * timeStep(function(ctx) {
 *  console.log('at step: ' + ctx.step);
 * }, 50, 500, 2500, 'easeInSine');
 *
 * @author hoatle
 * @since 2014-03-20
 */

var timeStep = (function(window) {

  var
  isString = function(obj) {
    return toString.call(obj) == '[object String]';
  },
  isObject = function(obj) {
    return toString.call(obj) == '[object Object]';
  };

  var supportedEasingMap = {
    linear: function(t, b, c, d) {
      return c * (t / d) + b;
    }
  };


  function timeStep(step, stepNumber, minTime, maxTime, easing) {
    var timeoutIds = [],
        time = 0,
        prevTime,
        stopped = false;

    easing = easing || supportedEasingMap.linear;

    if (isString(easing)) {
      easing = supportedEasingMap[easing] || supportedEasingMap.linear;
    }

    var ctx = {
      stop: function() {
        stopped = true;
      },
      step: -1
    };

    for (var i = 0; i < stepNumber; i++) {

      (function(s) {
        var timeoutId = window.setTimeout(function() {
          if (stopped) {
            for (var j = 0, len = timeoutIds.length; j <  len; j++) {
              window.clearTimeout(timeoutIds[j]);
            }
            return;
          }
          ctx.step = s;
          step(ctx);
        }, time);

        timeoutIds.push(timeoutId);

      })(i);
      prevTime = time;
      time = easing(i, minTime, maxTime, stepNumber);
      if (Math.abs(time - prevTime) < minTime) {
        time = prevTime + minTime;
      }
    }
  }

  /**
   * extend supported easing
   *
   * timeStep.extend(map);
   * timeStep.extend(key, value);
   *
   * @param key
   * @param fn
   */
  timeStep.extendEasing = function(key, fn) {
    if (isObject(key)) {
      for (var k in key) {
        if (key.hasOwnProperty(k)) {
          supportedEasingMap[k] = key[k];
        }
      }
    } else if (isString(key)) {
      supportedEasingMap[key] = fn;
    }
  };

  return timeStep;

})(window);
