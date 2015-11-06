import style from './style';
import nunjucks from 'nunjucks';
import $ from 'jquery';

export default class Info {
  constructor(assets) {
    this.data = assets.getResult('timeline.json');
    this.template = assets.getResult('info.html');
    this.render();
  }
  render() {
    let content = nunjucks.renderString(this.template, this.data);
    $('.info').remove();
    $('body').append(content);
  }
}
