'use strict';

import $ from 'jquery';
import director from 'director'
import style from './style';
import Info from './info';
import Timeline from './timeline';
import Loader from './loader.js'
import Background from './background.js'

let queue = new createjs.LoadQueue(true);
let stage;
let handler;
let loader;

function initTimeline(event) {
  $('.main-container').html('');
  let data;
  if (event) {
    data = event.result;
    window.data = data;
    if (loader) {
      return loader.stop().then(initTimeline);
    }
  }
  stage.clear();
  new Timeline(stage, window.data);
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
  stage.canvas.width = style.width;
  stage.canvas.height = style.height;
  let bg = new createjs.Shape();
  let bgImage = queue.getResult('code_nobg.png');
  bg.graphics.beginBitmapFill(bgImage)
    .drawRect(0, 0, bgImage.width, bgImage.height);
  bg.x = (1600 - bgImage.width) / 2 + 200;
  bg.y = 20;
  bg.alpha = 0;
  stage.addChild(bg);
  let animator = createjs.Tween.get(bg);
  animator.to({alpha: 1}, 500);
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
  location.hash = '#loading';
  loader = new Loader(document.querySelector('#scene'));
  window.loader = loader;
  stage = new createjs.Stage('scene');
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', stage);
  handler = queue.on('fileload', initInfo, this);
  queue.loadFile('timeline.json');
  let bg = new Background();

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
      handler = queue.on('fileload', initMain, this);
      queue.loadFile('code_nobg.png');
    },
    loading: () => {
      loader.done.then(() => {
        loader.stop().then(()=> {
          location.hash = '#main';
          router.init('#main');
        });
      });
    }
  }).init('loading');
});
