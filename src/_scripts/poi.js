import style from './style';

export default class POI {
  constructor(parent, poi) {
    this.poi = poi;
    this.container = new createjs.Container();
    this.index = parent.data.years.indexOf(this.poi.year);
    this.data = parent.data;
    this.render();
  }

  render() {
    let step = style.width / this.data.years.length;
    let mstep = step / 12;
    let dot = new createjs.Shape();
    dot.graphics.beginFill(style.poiBG)
      .setStrokeStyle(0.5).s(style.poiFG).drawCircle(0, 0, 1);
    dot.x = step * this.index + mstep * this.poi.month;
    dot.y = style.height / 2;
    let anim = createjs.Tween.get(dot)
      .to({scaleX: 5, scaleY: 5}, 100, createjs.Ease.cubicOut);

    let line = new createjs.Shape();
    line.graphics.beginFill(style.poiBG).drawRect(-2, 0, 4, 1);
    line.x = dot.x;
    line.y = dot.y;

    let animL = createjs.Tween.get(line)
      .to({scaleY: style.poiHeight}, 300, createjs.Ease.cubicOut);

    let label = new createjs.Text(this.poi.title, style.textFont, style.textFG);
    label.alpha = 0;
    label.x = 0;
    label.y = 0;
    let animT = createjs.Tween.get(label)
      .to({alpha: 1}, 300, createjs.Ease.cubicOut);

    let sub = new createjs.Text(this.poi.subtitle, style.subtitleFont, style.subtitleFG);
    sub.x = 0;
    sub.y = label.getMeasuredHeight() + 2;

    let text_container = new createjs.Container();
    text_container.x = dot.x + 12;
    text_container.y = dot.y + style.poiHeight - label.getMeasuredHeight() - 20;
    text_container.addChild(label);
    text_container.addChild(sub);

    let ha = new createjs.Shape();
    ha.graphics.beginFill('red')
      .drawRect(0, -4,
        Math.max(label.getMeasuredWidth(), sub.getMeasuredWidth()), label.getMeasuredHeight() * 2 + 8);
    this.container.hitArea = ha;
    ha.x = text_container.x;
    ha.y = text_container.y;
    // this.container.addChild(ha);
    this.container.on('mouseover', (e) => {
      let animOver = createjs.Tween.get(dot);
      animOver.to({scaleX: 7, scaleY: 7}, 100);
      let animOverL = createjs.Tween.get(text_container);
      animOverL.to({scaleX: 1.2, scaleY: 1.2}, 100);
      let animOverLL = createjs.Tween.get(line);
      animOverLL.to({scaleY: style.poiHeight + 6}, 100);
    });
    this.container.on('mouseout', (e) => {
      let animOut = createjs.Tween.get(dot);
      animOut.to({scaleX: 5, scaleY: 5}, 100);
      let animOverL = createjs.Tween.get(text_container);
      animOverL.to({scaleX: 1, scaleY: 1}, 100);
      let animOverLL = createjs.Tween.get(line);
      animOverLL.to({scaleY: style.poiHeight}, 100);
    });
    this.container.addChild(dot);
    this.container.addChild(line);
    this.container.addChild(text_container);
  }
}
