/*
  Thanx to Ultraviolet
  ------------------------------------------------------------
  http://labs.nikrowell.com/lightsandmotion/ultraviolet
*/

let ctx,
  hue,
  target = {},
  tendrils = [],
  settings = {};

settings.debug = false;
settings.friction = 0.5;
settings.trails = 20;
settings.size = 50;
settings.dampening = 0.25;
settings.tension = 0.98;

Math.TWO_PI = Math.PI * 2;

// ========================================================================================
// Oscillator
// ----------------------------------------------------------------------------------------

class Oscillator {
  constructor(options) {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
  }
  update() {
    this.phase += this.frequency;
    let value = this.offset + Math.sin(this.phase) * this.amplitude;
    return value;
  }
}

// ========================================================================================
// Tendril
// ----------------------------------------------------------------------------------------

class Tendril {
  constructor(options) {
    this.spring = options.spring + (Math.random() * 0.1) - 0.05;
    this.friction = settings.friction + (Math.random() * 0.01) - 0.005;
    this.nodes = [];
    class Node {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
      }
    }

    for (let i = 0, node; i < settings.size; i++) {
      node = new Node();
      node.x = target.x;
      node.y = target.y;

      this.nodes.push(node);
    }
  }
  update() {
    let spring = this.spring,
      node = this.nodes[0];

    node.vx += (target.x - node.x) * spring;
    node.vy += (target.y - node.y) * spring;

    for (let prev, i = 0, n = this.nodes.length; i < n; i++) {

      node = this.nodes[i];

      if (i > 0) {

        prev = this.nodes[i - 1];

        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * settings.dampening;
        node.vy += prev.vy * settings.dampening;
      }

      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;

      spring *= settings.tension;
    }
  }
  draw() {
    let x = this.nodes[0].x,
      y = this.nodes[0].y,
      a, b;

    ctx.beginPath();
    ctx.moveTo(x, y);

    let i, n;
    for (i = 1, n = this.nodes.length - 2; i < n; i++) {

      a = this.nodes[i];
      b = this.nodes[i + 1];
      x = (a.x + b.x) * 0.5;
      y = (a.y + b.y) * 0.5;

      ctx.quadraticCurveTo(a.x, a.y, x, y);
    }

    a = this.nodes[i];
    b = this.nodes[i + 1];

    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    ctx.stroke();
    ctx.closePath();
  }
}

// ----------------------------------------------------------------------------------------

export default class Loader{
  constructor(canvas) {
    ctx = canvas.getContext('2d');

    hue = new Oscillator({
      phase: Math.random() * Math.TWO_PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285
    });

    document.body.addEventListener('orientationchange', this.resize);
    window.addEventListener('resize', this.resize);

    document.addEventListener('mousemove', this.mousemove);
    document.addEventListener('touchmove', this.mousemove);
    document.addEventListener('touchstart', this.touchstart);

    target.x = Math.random() * ctx.canvas.width;
    target.y = Math.random() * ctx.canvas.height;

    this.resize();
    this.reset();
    this.loop();

    // kind of a hack ... but trigger a few mousemoves to kick things off

    this.start();
  }

  start() {
    this.mousemove({
      clientX: Math.random() * ctx.canvas.width,
      clientY: Math.random() * ctx.canvas.height
    });

    setTimeout(() => {
      this.mousemove({
        clientX: Math.random() * ctx.canvas.width,
        clientY: Math.random() * ctx.canvas.height
      });
    }, 200);

    setTimeout(() => {
      this.mousemove({
        clientX: Math.random() * ctx.canvas.width,
        clientY: Math.random() * ctx.canvas.height
      });
    }, 700);

    setTimeout(this.start.bind(this), 1000);
  }

  mousemove(event) {
    if (event.touches) {
      target.x = event.touches[0].pageX;
      target.y = event.touches[0].pageY;
    } else {
      target.x = event.clientX;
      target.y = event.clientY;
    }
  }

  touchstart(event) {
    if (event.touches.length === 1) {
      target.x = event.touches[0].pageX;
      target.y = event.touches[0].pageY;
    }
  }

  resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  reset() {
    tendrils = [];

    for (let i = 0; i < settings.trails; i++) {

      tendrils.push(new Tendril({
        spring: 0.45 + 0.025 * (i / settings.trails)
      }));
    }
  }

  loop() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#242424';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'hsla(' + Math.round(hue.update()) + ',90%,50%,0.4)';
    ctx.lineWidth = 1;

    for (let i = 0, tendril; i < settings.trails; i++) {
      tendril = tendrils[i];
      tendril.update();
      tendril.draw();
    }

    this.rq = requestAnimationFrame(this.loop.bind(this));
  }
  stop() {
    cancelAnimationFrame(this.rq);
    this.rq = null;
  }
}
