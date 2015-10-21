import style from './style';

// class TimeMark extends Container {
export default class TimeMark {
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
    let label = new createjs.Text(this.year, style.textFont, this.year == 'near future' ? style.textFG : style.yearFG);
    label.x = dot.x + 8;
    label.y = dot.y + 4;

    this.container.addChild(dot);
    this.container.addChild(label);
    let ha = new createjs.Shape();
    ha.graphics.beginFill('#000')
      .drawRect(dot.x - 3, dot.y - 3, 20 + label.getMeasuredWidth(), 30);
    this.container.hitArea = ha;
    let originalX = label.x;
    if (this.year == 'near future') {
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
}
