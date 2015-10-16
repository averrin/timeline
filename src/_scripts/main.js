// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';

let stage;
let dots = [];

function addCircle(y, i) {
  console.log(y, i);
  let dot = new createjs.Shape();
  dot.graphics.beginFill('#9edab6')
    .setStrokeStyle(0.5).s('#232323').drawCircle(0, 0, 1);
  dot.x = 100 * i;
  dot.y = 150;
  dots.push(dot);
  let anim = createjs.Tween.get(dot)
    .to({scaleX: 5, scaleY: 5}, 100, createjs.Ease.cubicOut);
  stage.addChild(dot);
  let label = new createjs.Text(2000 + y, '9pt Sans', '#232323');
  label.x = 100 * i + 8;
  label.y = 165;
  stage.addChild(label);

  dot.on('mouseover', (e) => {
    let animOver = createjs.Tween.get(dot);
    animOver.to({scaleX: 7, scaleY: 7}, 100);
  });
  dot.on('mouseout', (e) => {
    let animOut = createjs.Tween.get(dot);
    animOut.to({scaleX: 5, scaleY: 5}, 100);
  });
}

function init(event) {
  let data = event.result;
  stage = new createjs.Stage('timeline');
  let line0 = new createjs.Shape();
  let line = new createjs.Shape();
  line.graphics.beginFill('#232323').drawRect(0, 148, 1, 4);
  let anim = createjs.Tween.get(line);
  let scale = 100;
  for (let [i, y] of [0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].entries()) {
    anim.to({scaleX: scale}, 200, createjs.Ease.cubicOut)
      .call(() => {
        if (y != 0) {
          addCircle(y, i);
        }
      });
    scale += 100;
  }

  stage.addChild(line);
  stage.enableMouseOver();
  stage.update();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', stage);
}

$(() => {
  let queue = new createjs.LoadQueue(true);
  queue.on('fileload', init, this);
  queue.loadFile('timeline.json');
});
