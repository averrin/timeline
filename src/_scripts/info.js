import style from './style';
import nunjucks from 'nunjucks';
import $ from 'jquery';

export default class Info {
  constructor(parent) {
    this.data = parent.data;
    this.stage = parent.stage;
    this.render();
  }
  render() {
    let content = nunjucks.render('./info.html', this.data);
    $('.main-container .info').remove();
    $('.main-container').append(content);
  }
}
