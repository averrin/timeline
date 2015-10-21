'use strict';

import $ from 'jquery';
import style from './style';
import Timeline from './timeline';
// import Container from 'createjs';

function init(event) {
  let data = event.result;
  let timeline = new Timeline(data);
}

$(() => {
  let queue = new createjs.LoadQueue(true);
  queue.on('fileload', init, this);
  queue.loadFile('timeline.json');
});
