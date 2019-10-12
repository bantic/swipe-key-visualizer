import Component from '@ember/component';

const LINE_WIDTH = 1;
const COLOR = { r: 255, g: 255, b: 255, a: 1 };

function setup(canvas) {
  let img = document.querySelector('#keyboard');
  let { width, height } = img;
  if (width === 0 || height === 0) {
    img.addEventListener('load', () => {
      setup(canvas);
    });
    return;
  }
  canvas.width = width;
  canvas.height = height;
  new DrawSurface(canvas).start();
}

class DrawSurface {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.brush = null;
  }

  _localPos(touchEvent) {
    let { clientX, clientY } = touchEvent.touches[0];
    let { top, left } = this.canvas.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  }

  start() {
    let { canvas, ctx } = this;
    canvas.addEventListener('touchstart', e => {
      this.brush = new Brush(ctx);
      this.brush.touchstart(this._localPos(e));
    });
    canvas.addEventListener('touchmove', e => {
      this.brush.touchmove(this._localPos(e));
    });
    canvas.addEventListener('touchend', () => {
      this.brush.touchend();
      this.brush = null;
      drawOntoSurface(canvas);
      // clearCanvas(canvas);
    });
  }
}

function clearCanvas(canvas) {
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawOntoSurface(canvas) {
  let surface = document.querySelector('#surface');
  // clearCanvas(surface);

  let ctx = surface.getContext('2d');
  surface.width = canvas.width;
  surface.height = canvas.height;
  ctx.drawImage(canvas, 0, 0);
}

class Brush {
  constructor(ctx) {
    this.ctx = ctx;
    this.ctx.globalCompositeOperation = 'difference';
    this.prevPos = { x: null, y: null };
  }

  touchstart({ x, y }) {
    console.log('touchstart', x, y);
    this.prevPos = { x, y };
  }
  touchend() {
    console.log('touchend');
  }
  touchmove({ x, y }) {
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.strokeStyle = `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, ${COLOR.a})`;

    this.ctx.beginPath();
    this.ctx.moveTo(this.prevPos.x, this.prevPos.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.prevPos = { x, y };
  }
}

export default Component.extend({
  tagName: 'canvas',
  didInsertElement() {
    this._super(...arguments);
    setup(this.element);
  }
});
