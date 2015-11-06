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
let timeline;

function initTimeline() {
  $('.main-container').html('');
  let data = queue.getResult('timeline.json');
  stage.removeAllChildren();
  stage.clear();
  timeline = new Timeline(stage, data);
}

function initProfile() {
  stage.removeAllChildren();
  stage.clear();
  let profile = queue.getResult('profile.json');
  let template = queue.getResult('profile.html');
  let content = nunjucks.renderString(template, {profile});
  $('.main-container').html(content);
}

function initMain(event) {
  // stage.removeAllChildren();
  // stage.clear();
  // stage.canvas.width = style.width;
  // stage.canvas.height = style.height;
  // let bg = new createjs.Shape();
  // let bgImage = queue.getResult('bg');
  // bg.graphics.beginBitmapFill(bgImage)
  //   .drawRect(0, 0, bgImage.width, bgImage.height);
  // bg.x = (style.width - bgImage.width) / 2 + 200;
  // bg.y = 20;
  // bg.alpha = 0;
  // stage.addChild(bg);
  // let animator = createjs.Tween.get(bg);
  // animator.to({alpha: 1}, 500);
}

function initInfo() {
  new Info(queue);
}

$(() => {
  atvImg();
  queue.on('complete', (event)=> {
    loader.loaded = true;
  });
  queue.on('fileload', (event)=> {
    if (queue.getResult('timeline.json') && queue.getResult('info.html')) {
      return initInfo();
    }
  });
  queue.loadManifest('assets/assets.json');

  loader = new Loader(document.querySelector('#scene'));
  window.loader = loader;
  stage = new createjs.Stage('scene');
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', stage);
  new Background();

  let router = director.Router({
    timeline: initTimeline,
    profile: initProfile,
    main: initMain
  });
  loader.done.then(() => {
    loader.stop().then(()=> {
      router.init('#main');
    });
  });
});
