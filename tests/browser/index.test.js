import 'aframe';
import React from 'react';
import ReactDOM from 'react-dom';
import {Entity, Scene} from '../../src/index.js';

suite('test', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  teardown(() => {
    div.innerHTML = '';
  });

  test('scene and entity are rendered', () => {
    ReactDOM.render(<Scene><Entity/></Scene>, div);
    assert.ok(div.querySelector('a-scene a-entity'));
  });

  test('entity has component passed as string', () => {
    ReactDOM.render(<Scene><Entity position="1 2 3"/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.shallowDeepEqual(div.querySelector('a-entity').getAttribute('position'),
                              {x: 1, y: 2, z: 3});
    });
  });

  test('entity has component passed as object', () => {
    ReactDOM.render(<Scene><Entity position={{x: 1, y: 2, z: 3}}/></Scene>, div);
    div.querySelector('a-scene').addEventListener('loaded', () => {
      assert.shallowDeepEqual(div.querySelector('a-entity').getAttribute('position'),
                              {x: 1, y: 2, z: 3});
    });
  });
});
