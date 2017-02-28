import React from 'react';
import renderer from 'react-test-renderer';

import {Entity, Scene} from '../../src/index.js';

jest.mock('react-dom');

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
    expect(tree.props.class).toBe('box');
    expect(tree.props.className).toBe('box');
  });

  it('renders <a-entity> with mixin', () => {
    const tree = renderer.create(
      <Entity mixin="box"/>
    ).toJSON();
    expect(tree.props.mixin).toBe('box');
  });

  it('renders <a-entity> with null component', () => {
    const tree = renderer.create(
      <Entity position={null} />
    ).toJSON();
    expect(tree.props.position).toBe(null);
  });

  it('renders primitive', () => {
    const tree = renderer.create(
      <Entity primitive='a-sphere' material={{color: 'red'}}/>
    ).toJSON();
    expect(tree.type).toBe('a-sphere');
    expect(tree.props.material).toBe('color:red');
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

  it('renders <a-scene antialias="true">', () => {
    const tree = renderer.create(
      <Scene antialias='true'>
        <Entity/>
      </Scene>
    ).toJSON();
    expect(tree.type).toBe('a-scene');
    expect(tree.props.antialias).toBe('true');
  });

});
