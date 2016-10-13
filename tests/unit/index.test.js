import assert from 'assert';
import {serializeComponents} from '../../src/index.js';

global.AFRAME = {
  components: {
    camera: {},
    geometry: {},
    material: {},
    position: {},
    scale: {}
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
});
