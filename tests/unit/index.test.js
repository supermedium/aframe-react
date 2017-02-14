import assert from 'assert';
import {serializeComponents} from '../../src/index.js';
import {getEventMappings} from '../../src/eventUtils.js';

global.AFRAME = {
  components: {
    camera: {},
    geometry: {},
    material: {},
    position: {},
    scale: {},
    sound: {}
  }
};

describe('serializeComponents', () => {
  it('serializes arrays', () => {
    var output = serializeComponents({position: [1, 1, 1], scale: [2, 2, 2]});
    assert.equal(output.position, '1 1 1');
    assert.equal(output.scale, '2 2 2');
  });

  it('serializes objects', () => {
    var output = serializeComponents({material: {color: 'red', metalness: 0.5}});
    assert.equal(output.material, 'color:red;metalness:0.5');
  });

  it('serializes empty prop', () => {
    var output = serializeComponents({camera: {}});
    assert.equal(output.camera, '');
  });

  it('serializes multiple components of the same type', () => {
    var output = serializeComponents({sound__1: {}, sound__baa: {}});
    assert.equal(output.sound__1, '');
    assert.equal(output.sound__baa, '');
  });

  it('excludes props that are not components', () => {
    var output = serializeComponents({rose: 'blah', geometry: {}});
    assert.ok(!('rose' in output));
    assert.ok('geometry' in output);
  });

  it('excludes children prop', () => {
    var output = serializeComponents({children: 'whatever'});
    assert.ok(!('children' in output));
  });

  it('excludes function prop', () => {
    var output = serializeComponents({onClick: () => {}});
    assert.ok(!('onClick' in output));
  });

  it('excludes mixin', () => {
    var output = serializeComponents({mixin: 'red cube'});
    assert.ok(!('mixin' in output));
  });

  it('converts className to class', () => {
    var output = serializeComponents({className: 'my-cube'});
    assert.ok(output.class, 'my-cube');
  });

  it('handles null prop values', () => {
    var output = serializeComponents({position: null});
    assert.ok(output);
  });
});

describe('getEventMappings', () => {
  it('converts TitleCase to kebab-case', () => {
    var output = getEventMappings({onFooBar: () => {}});
    assert.ok('foo-bar' in output);
  });

  it('maintains the correct function', () => {
    var func = () => {};
    var output = getEventMappings({onFooBar: func});
    assert.ok(output['foo-bar'] === func);
  });

  it('excludes properties not beginning with "on[A-Z]"', () => {
    var output = getEventMappings({FooBar: () => {}});
    assert.ok(!('foo-bar' in output));
  });

  it('excludes properties that are not functions', () => {
    var output = getEventMappings({onFooBar: true});
    assert.ok(!('foo-bar' in output));
  });

  it('avoids double dashes', () => {
    var output = getEventMappings({'onFoo-Bar': () => {}});
    assert.ok('foo-bar' in output);
  });

  it('does not add dash if no case', () => {
    var output = getEventMappings({'onComponentinitialized': () => {}});
    assert.ok('componentinitialized' in output);
  });
});
