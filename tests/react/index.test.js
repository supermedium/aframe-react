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

  it('renders <a-entity> with id', () => {
    const tree = renderer.create(
      <Entity id="box"/>
    ).toJSON();
    expect(tree.props.id).toBe('box');
  });

  it('renders <a-entity> with className', () => {
    const tree = renderer.create(
      <Entity className="box"/>
    ).toJSON();
    expect(tree.props.className).toBe('box');
  });

  it('renders <a-entity> with mixin', () => {
    const tree = renderer.create(
      <Entity mixin="box"/>
    ).toJSON();
    expect(tree.props.mixin).toBe('box');
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
