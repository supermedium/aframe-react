import 'aframe';
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from '../../src/index.js';

const div = document.createElement('div');
document.body.appendChild(div);

setup(function () {
  this.sinon = sinon.sandbox.create();
});

teardown(function () {
  while (div.firstChild) { div.removeChild(div.firstChild); }
  this.sinon.restore();
});

suite('aframe-react', () => {
  test('renders scene and entity', () => {
    ReactDOM.render(<Scene><Entity/></Scene>, div);
    assert.ok(div.querySelector('a-scene a-entity'));
  });

  test('renders nested entity', () => {
    ReactDOM.render(<Scene><Entity><Entity/></Entity></Scene>, div);
    assert.ok(div.querySelector('a-scene a-entity a-entity'));
  });

  test('sets id', () => {
    ReactDOM.render(<Scene id="scene"><Entity id="entity"/></Scene>, div);
    assert.ok(div.querySelector('a-scene#scene'));
    assert.ok(div.querySelector('a-entity#entity'));
  });

  test('sets class', () => {
    ReactDOM.render(<Scene className="scene"><Entity className="entity"/></Scene>, div);
    assert.ok(div.querySelector('a-scene.scene'));
    assert.ok(div.querySelector('a-entity.entity'));
  });

  test('sets mixin', () => {
    ReactDOM.render(<Scene><Entity mixin="box"/></Scene>, div);
    assert.ok(div.querySelector('a-entity[mixin="box"]'));
  });

  test('initializes component to entity from string', done => {
    ReactDOM.render(<Scene><Entity position="1 2 3"/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.shallowDeepEqual(div.querySelector('a-entity').getAttribute('position'),
                              {x: 1, y: 2, z: 3});
      done();
    });
  });

  test('initializes component to entity from object', done => {
    ReactDOM.render(<Scene><Entity position={{x: 1, y: 2, z: 3}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.shallowDeepEqual(div.querySelector('a-entity').getAttribute('position'),
                              {x: 1, y: 2, z: 3});
      done();
    });
  });

  test('updates entity with new props', done => {
    ReactDOM.render(<Scene><Entity scale={{x: 1, y: 2, z: 3}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      const el = div.querySelector('a-entity');
      assert.shallowDeepEqual(el.getAttribute('scale'), {x: 1, y: 2, z: 3});
      // Re-rendering with different props will update and not re-mount.
      ReactDOM.render(<Scene><Entity scale={{x: 2, y: 3, z: 4}}/></Scene>, div);
      assert.shallowDeepEqual(el.getAttribute('scale'), {x: 2, y: 3, z: 4});
      done();
    });
  });

  test('does not flush props to DOM', done => {
    ReactDOM.render(<Scene><Entity position={{x: 1, y: 2, z: 3}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.notOk(HTMLElement.prototype.getAttribute.call(
        div.querySelector('a-entity'), 'position'));
      done();
    });
  });
});

suite('<Entity primitive/>', () => {
  test('renders <a-box>', () => {
    ReactDOM.render(<Scene><Entity primitive='a-box'/></Scene>, div);
    assert.ok(div.querySelector('a-scene a-box'));
  });

  test('renders <a-box> with mapping', done => {
    ReactDOM.render(<Scene><Entity primitive='a-box' color="red"/></Scene>, div);
    const box = div.querySelector('a-scene a-box');
    assert.ok(box);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.equal(box.getAttribute('color'), 'red');
      assert.equal(box.getAttribute('geometry').primitive, 'box');
      done();
    });
  });

  test('supports kebab-case', done => {
    ReactDOM.render(<Scene><Entity primitive='a-box' segments-depth={5}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.equal(div.querySelector('a-scene a-box').getAttribute('geometry').segmentsDepth,
                   5);
      done();
    });
  });
});

suite('<Entity events/>', () => {
  test('adds event listener', function (done) {
    let handlerCalled = false;
    function handler () { handlerCalled = true }

    ReactDOM.render(<Scene><Entity events={{foo: handler}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      div.querySelector('a-entity').emit('foo');
      setTimeout(() => {
        assert.ok(handlerCalled);
        done();
      });
    });
  });

  test('can add multiple event listeners', function (done) {
    let fooHandlerCalled = false;
    let barHandlerCalled = false;
    function fooHandler () { fooHandlerCalled = true }
    function barHandler () { barHandlerCalled = true }

    ReactDOM.render(<Scene><Entity events={{foo: [fooHandler, barHandler]}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      div.querySelector('a-entity').emit('foo');
      setTimeout(() => {
        assert.ok(fooHandlerCalled);
        assert.ok(barHandlerCalled);
        done();
      });
    });
  });

  test('can replace event listeners', function (done) {
    let fooHandlerCalled = false;
    let barHandlerCalled = false;
    function fooHandler () { fooHandlerCalled = true }
    function barHandler () { barHandlerCalled = true }

    ReactDOM.render(<Scene><Entity events={{foo: fooHandler}}/></Scene>, div);
    ReactDOM.render(<Scene><Entity events={{bar: barHandler}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      div.querySelector('a-entity').emit('foo');
      div.querySelector('a-entity').emit('bar');
      setTimeout(() => {
        assert.notOk(fooHandlerCalled);
        assert.ok(barHandlerCalled);
        done();
      });
    });
  });

  test('can remove event listener', function (done) {
    let fooHandlerCalled = false;
    function fooHandler () { fooHandlerCalled = true }

    ReactDOM.render(<Scene><Entity events={{foo: fooHandler}}/></Scene>, div);
    ReactDOM.render(<Scene><Entity events={{}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      div.querySelector('a-entity').emit('foo');
      setTimeout(() => {
        assert.notOk(fooHandlerCalled);
        done();
      });
    });
  });

  test('can attach extra event listener', function (done) {
    let fooHandlerCalled = false;
    let barHandlerCalled = false;
    function fooHandler () { fooHandlerCalled = true }
    function barHandler () { barHandlerCalled = true }

    ReactDOM.render(<Scene><Entity events={{foo: fooHandler, bar: barHandler}}/></Scene>,
                    div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      div.querySelector('a-entity').emit('foo');
      div.querySelector('a-entity').emit('bar');
      setTimeout(() => {
        assert.ok(fooHandlerCalled);
        assert.ok(barHandlerCalled);
        done();
      });
    });
  });
});
