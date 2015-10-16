// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';

$(() => {
  let queue = new createjs.LoadQueue(true);
  queue.on('fileload', init, this);
  queue.loadFile('timeline.json');
});

function init(event) {
  let data = event.item;
  console.log(data);
  let stage = new createjs.Stage('timeline');
  let circle = new createjs.Shape();
  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  stage.update();
}
