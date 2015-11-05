'use strict';

import $ from 'jquery';
import director from 'director'
import style from './style';
import Info from './info';
import Timeline from './timeline';
import Loader from './loader.js'

let queue = new createjs.LoadQueue(true);
let stage;
let handler;
let loader;

function initTimeline(event) {
  $('.main-container').html('');
  if (loader) {
    loader.stop();
  }
  stage.clear();
  let data = event.result;
  window.data = data;
  new Timeline(stage, data);
  queue._listeners = {};
  queue.off(handler);
}

function initProfile(event) {
  stage.clear();
  let profile = event.result;
  window.profile = profile;
  let content = nunjucks.render('./profile.html', {profile});
  $('.main-container').html(content);
  queue._listeners = {};
  queue.off(handler);
}

function initMain(event) {
  stage.clear();
  stage.canvas.width = 1600;
  stage.canvas.height = 1000;
  let bg = new createjs.Shape();
  let bgImage = queue.getResult('code_bg.png');
  bg.graphics.beginBitmapFill(bgImage)
    .drawRect(0, 0, bgImage.width, bgImage.height);
  bg.x = (1600 - bgImage.width) / 2 + 200;
  bg.y = 20;
  stage.addChild(bg);
  stage.update();
  queue._listeners = {};
  queue.off(handler);
}

function initInfo(event) {
  let data = event.result;
  new Info(data);
  queue._listeners = {};
  queue.off(handler);
}

window.reload = () => {
  new Timeline(stage, window.data);
};

$(() => {
  stage = new createjs.Stage('scene');

  let router = director.Router({
    timeline: () => {
      handler = queue.on('fileload', initTimeline, this);
      queue.loadFile('timeline.json');
    },
    profile: () => {
      handler = queue.on('fileload', initProfile, this);
      queue.loadFile('profile.json');
    },
    main: () => {
      loader = new Loader(document.querySelector('#scene'));
      handler = queue.on('fileload', initInfo, this);
      queue.loadFile('timeline.json');
    }
  }).init('timeline');
});
