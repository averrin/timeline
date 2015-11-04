'use strict';

import $ from 'jquery';
import director from 'director'
import style from './style';
import Timeline from './timeline';
let queue = new createjs.LoadQueue(true);
let handler;
// import Container from 'createjs';

function init(event) {
  let data = event.result;
  window.data = data;
  let scene = $(`
    <i class="fa fa-refresh" onclick="reload();" id="reload"></i>
    <canvas id="timeline"></canvas>
  `);
  $('.main-container').html(scene);
  let timeline = new Timeline(data);
  queue._listeners = {};
  queue.off(handler);
}

function init_profile(event) {
  let profile = event.result;
  let content = nunjucks.render('./profile.html', {profile});
  $('.main-container').html(content);
  queue._listeners = {};
  queue.off(handler);
}

window.reload = () => {
  new Timeline(window.data);
};

$(() => {
  let router = director.Router({
    timeline: () => {
      handler = queue.on('fileload', init, this);
      queue.loadFile('timeline.json');
    },
    profile: () => {
      handler = queue.on('fileload', init_profile, this);
      queue.loadFile('profile.json');
    }
  }).init('timeline');
});
