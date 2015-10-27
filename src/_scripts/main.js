'use strict';

import $ from 'jquery';
import style from './style';
import Timeline from './timeline';
// import Container from 'createjs';

function init(event) {
  let data = event.result;
  window.data = data;
  let timeline = new Timeline(data);
}

window.reload = () => {
  new Timeline(window.data);
};

$(() => {
  let queue = new createjs.LoadQueue(true);
  queue.on('fileload', init, this);
  queue.loadFile('timeline.json');
});

// Nunjucks filters

function limitTo(input, limit) {
  'use strict';
  if (typeof limit !== 'number') {
    return input;
  }
  if (typeof input === 'string') {
    if (limit >= 0) {
      return input.substring(0, limit);
    } else {
      return input.substr(limit);
    }
  }
  if (Array.isArray(input)) {
    limit = Math.min(limit, input.length);
    if (limit >= 0) {
      return input.splice(0, limit);
    } else {
      return input.splice(input.length + limit, input.length);
    }
  }
  return input;
}
window.limitTo = limitTo;
