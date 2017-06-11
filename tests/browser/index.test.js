import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from '../../src/index.js';

const div = document.createElement('div');
document.body.appendChild(div);

teardown(function () {
  while (div.firstChild) { div.removeChild(div.firstChild); }
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

  test('initializes geometry component to entity from object', done => {
    ReactDOM.render(<Scene><Entity geometry={{primitive: 'sphere', radius: 2}}/></Scene>,
                    div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.shallowDeepEqual(div.querySelector('a-entity').getAttribute('geometry'),
                              {primitive: 'sphere', radius: 2});
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

  test('updates deeply-nested entity with new props', done => {
    ReactDOM.render(
      <Scene>
        <Entity>
          <Entity>
            <Entity id="el" geometry={{primitive: 'cylinder', height: 5}}/>
          </Entity>
        </Entity>
      </Scene>,
      div
    );
    div.querySelector('a-scene').addEventListener('loaded', () => {
      ReactDOM.render(
        <Scene>
          <Entity>
            <Entity>
              <Entity id="el" geometry={{primitive: 'cylinder', height: 25, radius: 5}}/>
            </Entity>
          </Entity>
        </Scene>,
        div
      );
      setTimeout(() => {
        const geometry = div.querySelector('#el').getAttribute('geometry');
        assert.equal(geometry.primitive, 'cylinder');
        assert.equal(geometry.height, 25);
        assert.equal(geometry.radius, 5);
        done();
      });
    });
  });

  test('renders entity wrapped in React component', done => {
    class Camera extends React.Component {
      render() {
        return (
          <Entity id='cameraContainer'>
            <Entity id='camera' camera>
              <Entity id='cursor'
                      cursor={{fuse: true, fuseTimeout: 3000}}
                      raycaster={{objects: '.foo'}}
                      geometry={{primitive: 'plane'}}/>
            </Entity>
          </Entity>
        );
      }
    }
    ReactDOM.render(<Scene><Camera/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.ok(div.querySelector('#camera').getAttribute('camera'), 'Has camera');
      assert.ok(div.querySelector('#cursor').getAttribute('cursor'), 'Has cursor');
      assert.ok(div.querySelector('#cursor').getAttribute('raycaster'), 'Has raycaster');
      done();
    });
  });

  test('can attach new entities', done => {
    ReactDOM.render(
      <Scene>
        <Entity id='sphere' geometry={{primitive: 'sphere'}} material={{color: 'blue'}}/>
      </Scene>,
      div
    );
    div.querySelector('a-scene').addEventListener('loaded', () => {
      ReactDOM.render(
        <Scene>
          <Entity id='sphere' geometry={{primitive: 'sphere'}} material={{color: 'blue'}}>
            <Entity id='torus' geometry={{primitive: 'torus'}} material={{color: 'orange'}}/>
          </Entity>
        </Scene>,
        div
      );
      setTimeout(() => {
        const sphere = div.querySelector('#sphere');
        const torus = div.querySelector('#torus');
        assert.equal(sphere.getAttribute('geometry').primitive, 'sphere');
        assert.equal(sphere.getAttribute('material').color, 'blue');
        assert.equal(torus.getAttribute('geometry').primitive, 'torus');
        assert.equal(torus.getAttribute('material').color, 'orange');
        done();
      });
    });
  });

  test('can detach entities', done => {
    ReactDOM.render(
      <Scene>
        <Entity id='foo'>
          <Entity id='bar'/>
        </Entity>
      </Scene>,
      div
    );
    div.querySelector('a-scene').addEventListener('loaded', () => {
      ReactDOM.render(
        <Scene>
          <Entity id='foo'/>
        </Scene>,
        div
      );
      setTimeout(() => {
        assert.ok(div.querySelector('#foo'));
        assert.notOk(div.querySelector('#bar'));
        done();
      });
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

  test('handles overrides with updating component', done => {
    ReactDOM.render(<Scene><Entity primitive='a-cylinder' geometry={{height: 5}}/></Scene>,
                    div);
    const cylinderEl = div.querySelector('a-cylinder');
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.equal(cylinderEl.getAttribute('geometry').primitive, 'cylinder');
      assert.equal(cylinderEl.getAttribute('geometry').height, 5);
      ReactDOM.render(<Scene><Entity primitive='a-cylinder' geometry={{height: 10}}/></Scene>,
                      div);
      assert.equal(cylinderEl.getAttribute('geometry').primitive, 'cylinder');
      assert.equal(cylinderEl.getAttribute('geometry').height, 10);
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

  test('supports null or undefined props', () => {
    ReactDOM.render(<Scene undefined={undefined} null={null} />, div);
    const scene = div.querySelector('a-scene');
    assert.equal(scene.getAttribute('undefined'), 'undefined');
    assert.equal(scene.getAttribute('null'), 'null');
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

  test('can remove event listener when component is detached', function (done) {
    let bazHandlerCalled = false;
    function bazHandler () { bazHandlerCalled = true }

    ReactDOM.render(
      <Scene>
        <Entity id='foo'>
          <Entity id='bar' events={{baz: bazHandler}}/>
        </Entity>
      </Scene>,
      div
    );
    div.querySelector('a-scene').addEventListener('loaded', () => {
      ReactDOM.render(
        <Scene>
          <Entity id='foo'/>
        </Scene>,
        div
      );
      div.querySelector('a-entity').emit('baz');
      setTimeout(() => {
        assert.ok(div.querySelector('#foo'));
        assert.notOk(div.querySelector('#bar'));
        assert.notOk(bazHandlerCalled);
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

  test('can remove attribute', function (done) {
    ReactDOM.render(
      <Scene>
        <Entity light={{ type: "ambient", color: "#CCC" }} />
      </Scene>,
      div
    );
    ReactDOM.render(
      <Scene>
        <Entity />
      </Scene>,
      div
    );
    const scene = div.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      setTimeout(() => {
        assert.equal(div.querySelector('a-entity').hasAttribute('light'), false);
        done();
      });
    });
  });
});

suite('<Scene/>', () => {
  test('can take single-property boolean component as boolean', done => {
    ReactDOM.render(<Scene true={true} false={false}/>, div);
    const scene = div.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      assert.equal(scene.getAttribute('true'), 'true');
      assert.equal(scene.getAttribute('false'), 'false');
      done();
    });
  });

  test('can take single-property boolean component as string', done => {
    ReactDOM.render(<Scene true="true" false="false"/>, div);
    const scene = div.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      assert.equal(scene.getAttribute('true'), 'true');
      assert.equal(scene.getAttribute('false'), 'false');
      done();
    });
  });
});
