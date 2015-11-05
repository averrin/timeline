import style from './style';

const d = 24;

export default class Background {
  constructor() {
    this.stage = document.querySelector('#background').getContext('2d');
    this.stage.canvas.width = style.width;
    this.stage.canvas.height = style.height;
    this.stage.fillStyle = '#333';
    for (let i = 0; i < style.width / d; i++) {
      for (let j = 0; j < style.height / d; j++) {
        setTimeout(()=>{
          this.stage.fillRect(i*d, j*d, 2, 2);
        }, 30*(i+j));
      }
    }
  }
}
