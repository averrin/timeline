// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';

let stage;
let dots = [];

const style = {
  dotBG: '#9edab6',
  textFG: '#232323',
  width: 1200,
  height: 300,
};

function addCircle(y, i, step) {
  let dot = new createjs.Shape();
  dot.graphics.beginFill(style.dotBG)
    .setStrokeStyle(0.5).s(style.textFG).drawCircle(0, 0, 1);
  dot.x = step * i;
  dot.y = style.height / 2;
  dots.push(dot);
  let anim = createjs.Tween.get(dot)
    .to({scaleX: 5, scaleY: 5}, 100, createjs.Ease.cubicOut);
  stage.addChild(dot);
  let label = new createjs.Text(y, '9pt Sans', style.textFG);
  label.x = dot.x + 8;
  label.y = dot.y + 15;
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
  let _years = [0];
  let min = 3000;
  let max = 0;
  for (let r of data.work.concat(data.education)) {
    if (r.endDate) {
      let e = parseInt(r.endDate.split('-')[0]);
      if (e > max) {
        max = e;
      }
    }
    if (r.startDate) {
      let e = parseInt(r.startDate.split('-')[0]);
      if (e < min) {
        min = e;
      }
    }
  }
  for (let n = min; n <= max; n++) {
    _years.push(n);
  }

  console.log(min, max, _years);
  stage = new createjs.Stage('timeline');
  let line0 = new createjs.Shape();
  let line = new createjs.Shape();
  line.graphics.beginFill(style.textFG).drawRect(0, style.height / 2 - 2, 1, 4);
  let anim = createjs.Tween.get(line);
  let years = _years.sort();
  let step = style.width / years.length;
  let scale = step;
  for (let [i, y] of years.entries()) {
    anim.to({scaleX: scale}, 200, createjs.Ease.cubicOut)
      .call(() => {
        if (y != 0) {
          addCircle(y, i, step);
        }
      });
    scale += step;
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
