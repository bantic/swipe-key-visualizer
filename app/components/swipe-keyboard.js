import Component from '@ember/component';

const LINE_WIDTH = 1;
const COLOR = { r: '100%', g: '100%', b: '100%', a: 1 };

function setup(canvas) {
  let img = canvas.querySelector('img');
  let { width, height } = img;
  if (width === 0 || height === 0) {
    img.addEventListener('load', () => {
      setup(canvas);
    });
    return;
  }
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
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
    canvas.addEventListener('touchend', e => {
      this.brush.touchend();
      this.brush = null;
    });
    canvas.addEventListener('touchmove', e => {
      this.brush.touchmove(this._localPos(e));
    });
  }
}

class Brush {
  constructor(ctx) {
    this.ctx = ctx;
    this.ctx.globalCompositeOperation = 'source-over';
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
