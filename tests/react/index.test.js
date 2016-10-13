import React from 'react';
import renderer from 'react-test-renderer';

import {Entity, Scene} from '../../src/index.js';

jest.mock('react/lib/ReactDefaultInjection');

global.AFRAME = {
  components: {
    camera: {},
    geometry: {},
    material: {},
    position: {},
    scale: {}
  }
};

describe('Entity', () => {
  it('renders <a-entity>', () => {
    const tree = renderer.create(
      <Entity/>
    ).toJSON();
    expect(tree.type).toBe('a-entity');
  });

  it('renders <a-entity> with components', () => {
    const tree = renderer.create(
      <Entity camera="" geometry={{primitive: 'box', width: 5}} position="1 1 1"
        scale={[2, 2, 2]}/>
    ).toJSON();
    expect(tree.type).toBe('a-entity');
    expect(tree.props.camera).toBe('');
    expect(tree.props.geometry).toBe('primitive:box;width:5');
    expect(tree.props.position).toBe('1 1 1');
    expect(tree.props.scale).toBe('2 2 2');
  });
});

describe('Scene', () => {
  it('renders <a-scene>', () => {
    const tree = renderer.create(
      <Scene>
        <Entity/>
      </Scene>
    ).toJSON();
    expect(tree.type).toBe('a-scene');
    expect(tree.children[0].type).toBe('a-entity');
  });
});
