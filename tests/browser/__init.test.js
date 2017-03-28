/**
 * __init.test.js is run before every test case.
 */
window.debug = true;
const AScene = require('aframe').AScene;

navigator.getVRDisplays = function () {
  var resolvePromise = Promise.resolve();
  var mockVRDisplay = {
    requestPresent: resolvePromise,
    exitPresent: resolvePromise,
    getPose: function () { return { orientation: null, position: null }; },
    requestAnimationFrame: function () { return 1; }
  };
  return Promise.resolve([mockVRDisplay]);
};

setup(function () {
  this.sinon = sinon.sandbox.create();
  // Stubs to not create a WebGL context since Travis CI runs headless.
  this.sinon.stub(AScene.prototype, 'render');
  this.sinon.stub(AScene.prototype, 'resize');
  this.sinon.stub(AScene.prototype, 'setupRenderer');
});

teardown(function () {
  // Clean up any attached elements.
  var attachedEls = ['a-scene'];
  var els = document.querySelectorAll(attachedEls.join(','));
  for (var i = 0; i < els.length; i++) {
    els[i].parentNode.removeChild(els[i]);
  }
  this.sinon.restore();
  delete AFRAME.components.test;
});
