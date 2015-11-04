'use strict';

import $ from 'jquery';
import director from 'director'
import style from './style';
import Timeline from './timeline';
// import Container from 'createjs';

function init(event) {
  let data = event.result;
  window.data = data;
  let timeline = new Timeline(data);
}

function init_profile(event) {
  let profile = event.result;
  let content = nunjucks.render('./profile.html', {profile});
  $('.main-container').html(content);
}

window.reload = () => {
  new Timeline(window.data);
};

$(() => {
  let queue = new createjs.LoadQueue(true);
  let router = director.Router({
    timeline: () => {
      queue.on('fileload', init, this);
      queue.loadFile('timeline.json');
    },
    profile: () => {
      queue.on('fileload', init_profile, this);
      queue.loadFile('profile.json');
    }
  }).init('timeline');
});
