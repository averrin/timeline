// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';
// import Container from 'createjs';


let stage;

const style = {
  dotBG: '#2c5e40',
  textFG: '#EFECE7',
  width: 1280,
  height: 300,
  itemHeight: 20,
  itemHeightBottom: 30,
  hStep: 5,
  mainBG: '#111',
  itemZoom: 1.3,
  itemAlpha: 0.7,
  textFont: '9pt Ubuntu, Sans',
};

class Range {
  constructor(parent, range) {
    this.data = parent.data;
    this.range = range;
    this.index = parent.data.years.indexOf(this.range.year);
    let i = parent.data.map[this.range.year].indexOf(this.range);
    this.container = new createjs.Container();

    let step = style.width / this.data.years.length;
    let mstep = step / 12;

    this.x = step * this.index;
    this.y = style.height / 2;
    this.width = (this.range.yearEnd - this.range.year) * step +
      (this.range.monthEnd - this.range.month) * mstep;
    this.height =
      (this.range.studyType ? style.itemHeightBottom : style.itemHeight) +
      i * style.hStep;

    this.render();
  }

  render() {
    let step = style.width / this.data.years.length;
    let mstep = step / 12;
    let item = new createjs.Shape();
    item.graphics.beginFill(this.range.color)
      .drawRect(0, 0, this.width, this.height);
    item.x = this.x + (this.range.month - 1) * mstep;
    item.y = this.y - style.itemHeight - 2;
    if (this.range.studyType) {
      item.y = this.y + 2;
    }
    let originalY = item.y;
    item.scaleX = 0;
    item.alpha = style.itemAlpha;
    this.container.addChild(item);

    let anim = createjs.Tween.get(item)
      .to({scaleX: 1}, this.width * 4, createjs.Ease.cubicOut).call(() => {
        let l = this.addLabel(item);
        this.container.addChild(l);
        this.container.on('mouseover', (e) => {
          let animOver = createjs.Tween.get(item);
          let animOverL = createjs.Tween.get(l);
          animOverL.to({scaleX: 1.2, scaleY: 1.2}, 100);
          if (!this.range.studyType) {
            animOver.to({
              alpha: 1, scaleY: style.itemZoom,
              y: originalY - style.itemHeight * (style.itemZoom - 1)
            }, 100);
          } else {
            animOver.to({alpha: 1, scaleY: style.itemZoom}, 100);
          }
        });
        this.container.on('mouseout', (e) => {
          let animOut = createjs.Tween.get(item);
          let animOverL = createjs.Tween.get(l);
          animOverL.to({scaleX: 1, scaleY: 1}, 100);
          animOut.to({alpha: style.itemAlpha, scaleY: 1, y: originalY}, 100);
        });
      });
      // }
    // }
  }
  addLabel(item) {
    let label;
    let angle = 0;
    let r = this.range;
    let container = new createjs.Container();
    if (!r.studyType) {
      label = new createjs.Text(r.company, style.textFont, style.textFG);
      container.x = this.width / 2 + item.x - 10;
      container.y = item.y - 20;
      angle = -45;
    } else {
      label = new createjs.Text(r.institution, style.textFont, style.textFG);
      container.x = this.width / 2 + item.x - label.getMeasuredWidth() / 2;
      container.y = item.y + style.itemHeightBottom + 16;
    }
    container.addChild(label);

    container.alpha = 0;
    container.rotation = 0;
    let anim = createjs.Tween.get(container)
      .to({alpha: 1, rotation: angle}, 300, createjs.Ease.cubicOut).call(() => {
        let ha = new createjs.Shape();
        ha.graphics.beginFill('red')
          .drawRect(0, 0, label.getMeasuredWidth(), label.getMeasuredHeight() + 2);
        container.hitArea = ha;
      });
    return container;
  }
}

// class TimeMark extends Container {
class TimeMark {
  constructor(parent, year) {
    // super();
    this.year = year;
    this.index = parent.data.years.indexOf(year);
    this.data = parent.data;
    this.container = new createjs.Container();
    let step = style.width / parent.data.years.length;
    let mstep = step / 12;
    let dot = new createjs.Shape();
    dot.graphics.beginFill(style.dotBG)
      .setStrokeStyle(0.5).s(style.textFG).drawCircle(0, 0, 1);
    dot.x = step * this.index;
    dot.y = style.height / 2;
    let anim = createjs.Tween.get(dot)
      .to({scaleX: 5, scaleY: 5}, 100, createjs.Ease.cubicOut);
    let label = new createjs.Text(this.year, style.textFont, style.textFG);
    label.x = dot.x + 8;
    label.y = dot.y + 4;

    this.container.addChild(dot);
    this.container.addChild(label);
    let ha = new createjs.Shape();
    ha.graphics.beginFill('#000')
      .drawRect(dot.x - 3, dot.y - 3, 20 + label.getMeasuredWidth(), 30);
    this.container.hitArea = ha;
    let originalX = label.x;
    this.container.on('mouseover', (e) => {
      let animOver = createjs.Tween.get(dot);
      animOver.to({scaleX: 7, scaleY: 7}, 100);
      let animOverL = createjs.Tween.get(label);
      animOverL.to({rotation: 30, x: originalX + 5}, 100);
    });
    this.container.on('mouseout', (e) => {
      let animOut = createjs.Tween.get(dot);
      animOut.to({scaleX: 5, scaleY: 5}, 100);
      let animOutL = createjs.Tween.get(label);
      animOutL.to({rotation: 0, x: originalX}, 100);
    });
  }
}

class Timeline {
  constructor(data) {
    this.data = this.processData(data);
    this.stage = new createjs.Stage('timeline');
    this.marks = [];
    this.ranges = [];
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', this.stage);
    this.render();
  }

  render() {
    let bg = new createjs.Shape();
    bg.graphics.beginFill(style.mainBG)
      .drawRect(0, 0, style.width, style.height);
    this.stage.addChild(bg);
    let line0 = new createjs.Shape();
    let line = new createjs.Shape();
    line.graphics.beginFill(style.textFG)
      .drawRect(0, style.height / 2 - 2, 1, 4);
    let anim = createjs.Tween.get(line);
    let step = style.width / this.data.years.length;
    let scale = step;
    for (let [i, y] of this.data.years.entries()) {
      anim.to({scaleX: scale}, 200, createjs.Ease.cubicOut)
        .call(() => {
          if (y != 0) {
            let mark = new TimeMark(this, y);
            this.marks.push(mark);
            if (this.data.map[y]) {
              for (let [i, r] of this.data.map[y].entries()) {
                let range = new Range(this, r);
                this.ranges.push(range);
                this.stage.addChild(range.container);
              }
            }
            this.stage.addChild(mark.container);
          }
        });
      scale += step;
    }

    let work = new createjs.Text('work', style.textFont, style.textFG);
    work.x = 10;
    work.y = style.height / 2 - 2 - 20;
    let edu = new createjs.Text('education', style.textFont, style.textFG);
    edu.x = 10;
    edu.y = style.height / 2 + 2 + 4;

    this.stage.addChild(line);
    this.stage.addChild(work);
    this.stage.addChild(edu);

    let avatar = new createjs.Bitmap(this.data.basics.picture);
    avatar.x = 0;
    avatar.y = 0;
    let name = new createjs.Text(
      this.data.basics.name, 'bold 15pt Sans', style.textFG);
    name.x = 100;
    name.y = 6;
    let summary = new createjs.Text(
      this.data.basics.summary, '10pt Sans', style.textFG);
    summary.x = 100;
    summary.y = 36;
    this.stage.addChild(avatar);
    this.stage.addChild(name);
    this.stage.addChild(summary);

    this.stage.enableMouseOver();
    this.stage.update();
  }

  processData(data) {
    let map = {};
    let _years = [0];
    let min = new Date().getFullYear();
    let max = 0;
    for (let r of data.work.concat(data.education)) {
      if (r.startDate) {
        let y = parseInt(r.startDate.split('-')[0]);
        r.year = y;
        r.month = parseInt(r.startDate.split('-')[1]);

        if (!map[y]) {
          map[y] = [];
        }
        map[y].push(r);
        if (y < min) {
          min = y;
        }
      }
      if (!r.endDate) {
        r.endDate = (new Date().getFullYear() + 1) + '-03-01';
      }
      r.yearEnd = parseInt(r.endDate.split('-')[0]);
      r.monthEnd = parseInt(r.endDate.split('-')[1]);

    }
    if (max == 0) {
      max = new Date().getFullYear();
    }
    for (let n = min; n <= max; n++) {
      _years.push(n);
    }
    _years.push('near future');
    data.years = _years;
    data.map = map;
    return data;
  }

}

function init(event) {
  let data = event.result;
  let timeline = new Timeline(data);
}

$(() => {
  let queue = new createjs.LoadQueue(true);
  queue.on('fileload', init, this);
  queue.loadFile('timeline.json');
});
