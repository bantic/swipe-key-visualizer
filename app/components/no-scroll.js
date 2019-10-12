import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    document.body.addEventListener(
      'touchmove',
      e => {
        console.log('stop touchmove');
        e.preventDefault();
      },
      { passive: false }
    );
  }
});
