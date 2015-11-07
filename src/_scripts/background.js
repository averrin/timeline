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
    setTimeout(this.completeBG.bind(this), 40 * (style.width / d + style.height / d) + 1000);
    // setTimeout(this.randomEffect.bind(this), 2000);
  }

  completeBG() {
    let bg = this.stage.toDataURL();
    document.body.style.backgroundImage = `url(${bg})`;
    this.stage.removeAllChildren();
    this.stage.clear();
    this.randomEffect();
  }

  randomEffect(row, col) {
    row = row || Math.floor(Math.random() * (this.nodes.length - 6) + 3);
    col = col ||  Math.floor(Math.random() * (this.nodes[0].length - 6) + 3);
    let _row = row - 2;
    let _col = col - 2;

    for (let i = _row; i <= row + 2; i++) {
      for (let j = _col; j <= col + 2; j++) {
        if ((i === _row && j === _col) ||
            (i === _row && j === col + 2) ||
            (i === row + 2 && j === _col) ||
            (i === row + 2 && j === col + 2)
        ) {
          continue;
        }
        let node;
        try {
          node = this.nodes[i][j];
        } catch (e) {
          continue;
        }
        if (!node) {
          continue;
        }
        this.stage.addChild(node);
        let scale = 1.1;
        if ((i > _row && i <= row + 1) || (j > _col && j <= col + 1)) {
          scale *= 1.6;
        }
        if (i === row && j === col) {
          scale *= 1.5;
        }
        let offsetX = 0;
        let offsetY = 0;
        let d = 2;
        if (i < row) {
          offsetX = -d;
        } else if (i != row) {
          offsetX = d;
        }
        if (j < col) {
          offsetY = -d;
        } else if (j != col) {
          offsetY = d;
        }
        let animator = createjs.Tween.get(node);
        animator.to({
          scaleX: scale, scaleY: scale,
          y: j*style.BGDistance - scale / 2 + offsetY,
          x: i*style.BGDistance - scale / 2 + offsetX,
        }, 1200)
        .to({
          scaleX: 1, scaleY: 1,
          y: j*style.BGDistance,
          x: i*style.BGDistance,
        }, 700).call(()=> {
          this.stage.removeChild(node);
        });
      }
    }
    setTimeout(() => {
      let r = Math.random();
      let t = Math.random();
      let orow = row;
      let ocol = col;
      if (r < 0.3) {
        row += 3;
        if (row >= this.nodes.lenght) {
          row = null;
        }
      } else if (r > 0.6) {
        row -= 3;
        if (row <= 0) {
          row = null;
        }
      } else {
        if ((r * 10) % 2) {
          row = null;
        }
      }
      if (t < 0.3) {
        col += 3;
        if (row !== orow) {
          col -= 1;
        }
        if (col >= this.nodes[0].lenght) {
          col = null;
        }
      } else if (t > 0.6) {
        col -= 3;
        if (row !== orow) {
          col += 1;
        }
        if (col <= 0) {
          col = null;
        }
      } else {
        if (Math.floor(t * 10) % 2) {
          col = null;
        }
      }
      this.randomEffect(row, col);
    }, 500);
  }
}
