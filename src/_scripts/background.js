import style from './style';

export default class Background {
  constructor() {
    this.stage = new createjs.Stage('background');
    createjs.Ticker.addEventListener('tick', this.stage);
    this.stage.canvas.width = style.width;
    this.stage.canvas.height = style.height;
    let d = style.BGDistance;
    this.nodes = [];
    for (let i = 0; i < style.width / d; i++) {
      this.nodes.push([]);
      for (let j = 0; j < style.height / d; j++) {
        let node = new createjs.Shape();
        node.graphics.beginFill('#50465e')
          .drawRect(0, 0, 2, 2);
        node.x = i * d;
        node.y = j * d;
        node.scaleX = 0;
        node.scaleY = 0;
        this.nodes[i].push(node);
        this.stage.addChild(node);
        let animator = createjs.Tween.get(node);
        animator.wait(40 * (i + j)).to({
          scaleX: 1.5, scaleY: 1.5
        }, 300, createjs.Ease.elasticOut).call(()=> {
          node.graphics.beginFill('#443b52')
            .drawRect(0, 0, 2, 2);
        }).to({
          scaleX: 1, scaleY: 1
        }, 500, createjs.Ease.elasticOut).call(()=> {
          node.graphics.beginFill(style.BGColor)
            .drawRect(0, 0, 2, 2);
        });
      }
    }
    this.stage.update();
  }
}
