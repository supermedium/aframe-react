import assert from 'assert';
import {serializeComponents} from '../../src/index.js';

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

describe('test', () => {
  it('dummy', () => {
    assert.ok(true);
  });
});
