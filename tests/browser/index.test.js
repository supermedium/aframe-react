import 'aframe';
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from '../../src/index.js';

suite('aframe-react', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  teardown(function () {
    while (div.firstChild) { div.removeChild(div.firstChild); }
  });

  test('renders scene and entity', () => {
    ReactDOM.render(<Scene><Entity/></Scene>, div);
    assert.ok(div.querySelector('a-scene a-entity'));
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

  test('handles entity update', done => {
    class TestScene extends React.Component {
      constructor(props) {
        super(props);
        this.state = {position: {x: 1, y: 2, z: 3}};

        document.addEventListener('changestate', () => {
          this.setState({position: {x: 2, y: 3, z: 4}});
        });
      }

      render() {
        return (
          <Scene><Entity position={this.state.position}/></Scene>
        );
      }
    }

    ReactDOM.render(<TestScene/>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.shallowDeepEqual(div.querySelector('a-entity').getAttribute('position'),
                              {x: 1, y: 2, z: 3});
      // TODO: Emit.
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
 const div = document.createElement('div');
  document.body.appendChild(div);

  teardown(function () {
    while (div.firstChild) { div.removeChild(div.firstChild); }
  });

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
});
