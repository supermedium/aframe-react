import React from 'react';
import renderer from 'react-test-renderer';

import {Entity, Scene} from '../../src/index.js';

jest.mock('react-dom');

describe('Entity', () => {
  it('renders <a-entity>', () => {
    const tree = renderer.create(
      <Entity/>
    ).toJSON();
    expect(tree.type).toBe('a-entity');
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

  it('renders primitive', () => {
    const tree = renderer.create(
      <Entity primitive='a-sphere' material={{color: 'red'}}/>
    ).toJSON();
    expect(tree.type).toBe('a-sphere');
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
