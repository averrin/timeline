import style from './style';

export default class Range {
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
  }
  addLabel(item) {
    let label;
    let  subtitle;
    let angle = 0;
    let r = this.range;
    let container = new createjs.Container();
    if (!r.studyType) {
      label = new createjs.Text(r.company, style.textFont, style.textFG);
      container.x = this.width / 2 + item.x - 20;
      container.y = item.y - 24;
      subtitle = r.position;
      if (r.partial) {
        subtitle += ' (partial)';
      }
      angle = -45;
    } else {
      label = new createjs.Text(r.institution, style.textFont, style.textFG);
      container.x = this.width / 2 + item.x - label.getMeasuredWidth() / 2;
      container.y = item.y + style.itemHeightBottom + 12;
      subtitle = r.area;
    }
    container.addChild(label);
    let sub = new createjs.Text(subtitle, style.subtitleFont, style.subtitleFG);
    sub.x = 14;
    sub.y = label.getMeasuredHeight() + 2;
    container.addChild(sub);

    container.alpha = 0;
    container.rotation = 0;
    let anim = createjs.Tween.get(container)
      .to({alpha: 1, rotation: angle}, 300, createjs.Ease.cubicOut).call(() => {
        let ha = new createjs.Shape();
        ha.graphics.beginFill('red')
          .drawRect(0, -4,
            Math.max(label.getMeasuredWidth(), sub.getMeasuredWidth() + 14), label.getMeasuredHeight() * 2 + 8);
        container.hitArea = ha;
        // container.addChild(ha);
      });
    return container;
  }
}
