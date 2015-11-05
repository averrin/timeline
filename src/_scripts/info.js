import style from './style';
import nunjucks from 'nunjucks';
import $ from 'jquery';

export default class Info {
  constructor(data) {
    this.data = data;
    this.render();
  }
  render() {
    let content = nunjucks.render('./info.html', this.data);
    $('.info').remove();
    $('body').append(content);
  }
}
