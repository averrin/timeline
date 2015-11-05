import style from './style';
import POI from './poi';
import TimeMark from './timemark';
import Range from './range';

export default class Timeline {
  constructor(stage, data) {
    this.stage = stage;
    this.data = this.processData(data);
    this.stage.canvas.width = style.width;
    this.stage.canvas.height = style.height;
    this.marks = [];
    this.ranges = [];
    this.render();
  }

  render() {
    // let bg = new createjs.Shape();
    // bg.graphics.beginFill(style.mainBG)
    //   .drawRect(0, 0, style.width, style.height);
    // this.stage.addChild(bg);
    let line = new createjs.Shape();
    line.graphics.beginFill(style.lineFG)
      .drawRect(0, style.height / 2 - 2, 1, 4);
    let anim = createjs.Tween.get(line);
    let step = style.width / this.data.years.length;
    let scale = step;
    for (let [i, y] of this.data.years.entries()) {
      anim.to({scaleX: scale}, 200, createjs.Ease.cubicOut)
        .call(() => {
          if (y !== 0) {
            let mark = new TimeMark(this, y);
            this.marks.push(mark);
            if (this.data.map[y]) {
              for (let r of this.data.map[y]) {
                let range = new Range(this, r);
                this.ranges.push(range);
                this.stage.addChild(range.container);
              }
            }
            this.stage.addChild(mark.container);
          }
          if (y === 'near future') {
            this.drawPOI();
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

    this.stage.enableMouseOver();
    this.stage.update();
  }

  drawPOI() {
    for (let p of this.data.poi) {
      let poi = new POI(this, p);
      this.stage.addChild(poi.container);
    }
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

    for (let p of data.poi) {
      p.year = parseInt(p.date.split('-')[0]);
      p.month = parseInt(p.date.split('-')[1]);
    }
    data.years = _years;
    data.map = map;
    return data;
  }

}
