import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';
import {properties, injection} from 'react/lib/DOMProperty';
import {getEventMappings} from './eventUtils.js';

let knownCustomAttributes = [];

function flatMap(collection, map) {
  return Array.prototype.concat.apply([], collection.map(map));
}

function unique(collection) {
  return Array.from(new Set(collection));
}

// Get items that are in arr1, but not in arr2 (NOTE: will ignore items that are
// in arr2, but not in arr1)
function arrayDiff(arr1, arr2) {
  return arr1.filter(val => arr2.indexOf(val) === -1);
}

function currentCustomAttributes() {
  return unique([].concat(
    Object.keys(AFRAME.components),
    Object.keys(AFRAME.systems),
    flatMap(Object.keys(AFRAME.primitives.primitives), primitive => (
      Object.keys(AFRAME.primitives.primitives[primitive].prototype.mappings)
    ))
  ));
}

function newCustomAttributes() {
  const allCustomAttributes = currentCustomAttributes();
  return arrayDiff(allCustomAttributes, knownCustomAttributes);
}

function tellReactAboutAframeAttributes() {

  const customAttributes = newCustomAttributes();

  if (customAttributes.length === 0) {
    return;
  }

  // Tell react about all the possible custom attributes that could exist on an
  // element: Components, Systems, and Primitive Mappings
  injection.injectDOMPropertyConfig({

    // Every attribute we know about should be treated as custom
    isCustomAttribute: attr => customAttributes.indexOf(attr) !== -1,

    // Ensure camelCased attributes aren't lower-cased (eg; radialSegments)
    DOMAttributeNames: customAttributes.reduce((memo, attributeName) => {
      memo[attributeName] = attributeName;
      return memo;
    }, {}),
  });

  knownCustomAttributes = knownCustomAttributes.concat(customAttributes);

}

/**
 * <a-entity>
 */
export class Entity extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    events: React.PropTypes.object,
    mixin: React.PropTypes.string,
    primitve: React.PropTypes.string
  };

  attachEvents = el => {
    if (!el) { return; }

    const onLoaded = () => {

      // Required so that a-frame will pick up the attributes that react has set
      // for us
      // el.flushToDOM(true);

    }

    attachEventsToElement(el, Object.assign(
      {},
      this.props.events,
      getEventMappings(this.props)
    ));

    // If it's already loaded, go ahead and flush the DOM
    if (el.hasLoaded) {
      onLoaded();
    } else {
      // Otherwise, wait until the event is triggered
      el.addEventListener('loaded', onLoaded);
    }
  };

  componentWillMount() {
    // this._serialProps = serializeComponents(this.props);
    tellReactAboutAframeAttributes();
  }

  componentWillReceiveProps() {
    // this._serialProps = serializeComponents(this.props);
    tellReactAboutAframeAttributes();
  }

  render() {
    // Allow through normal attributes..
    const otherProps = {};
    ['id', 'mixin'].forEach(propName => {
      if (this.props[propName]) { otherProps[propName] = this.props[propName]; }
    });

    return React.createElement(
      this.props.primitive || 'a-entity',
      Object.assign(
        {ref: this.attachEvents},
        otherProps,
        serializeComponents(this.props)
      ),
      this.props.children
    );
  }
}

/**
 * <a-scene>
 */
export class Scene extends React.Component {
  static propTypes = {
    events: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {renderChildren: false};
  };

  attachEvents = el => {

    if (!el) { return; }

    const onLoaded = () => {

      // Required so that a-frame will pick up the attributes that react has set
      // for us
      // el.flushToDOM(true);

      this.setState({renderChildren: true});
    }

    attachEventsToElement(el, Object.assign(
      {},
      this.props.events,
      getEventMappings(this.props)
    ));

    if (!this.state.renderChildren) {
      // If it's already loaded, go ahead and render children
      if (el.hasLoaded) {
        onLoaded();
      } else {
        // Otherwise, wait until the event is triggered
        el.addEventListener('loaded', onLoaded);
      }
    }
  };

  componentWillMount() {
    // This will occur before anything is written to the DOM
    tellReactAboutAframeAttributes();
  }

  componentWillReceiveProps() {
    // this._serialProps = serializeComponents(this.props);
    tellReactAboutAframeAttributes();
  }

  render() {
    // Allow through normal attributes..
    const otherProps = {};
    ['id', 'mixin'].forEach(propName => {
      if (this.props[propName]) { otherProps[propName] = this.props[propName]; }
    });

    return (
      <a-scene
        ref={this.attachEvents}
        {...otherProps}
        {...serializeComponents(this.props)}
      >
        {this.state.renderChildren ? this.props.children : undefined}
      </a-scene>
    );
  }
}

/**
 * Serialize React props to A-Frame components.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */
export function serializeComponents (props) {
  const components = AFRAME.components;

  let primitiveMappings = {};

  if (props.primitive) {
    const entityPrimitive = AFRAME.primitives.primitives[props.primitive];
    if (entityPrimitive) {
      primitiveMappings = entityPrimitive.prototype.mappings;
    }
  }

  let serialProps = {};
  Object.keys(props).forEach(component => {
    // Allow these.
    if (['class', 'children', 'id', 'mixin'].indexOf(component) !== -1) {
      return;
    }

    // className to class.
    if (component === 'className') {
      serialProps.class = props[component];
      serialProps.className = props[component];
      return;
    }

    if (props[component].constructor === Function) { return; }

    if (Object.keys(components).indexOf(component.split('__')[0]) !== -1) {
      // Handle props that are components

      if (props[component].constructor === Array) {
        // Stringify components passed as array.
        serialProps[component] = props[component].join(' ');
      } else if (props[component].constructor === Object) {
        // Stringify components passed as object.
        serialProps[component] = styleParser.stringify(props[component]);
      } else if (props[component].constructor === Boolean) {
        if (components[component].schema.type === 'boolean') {
          // If the component takes one property and it is Boolean
          // just passes in the prop.
          serialProps[component] = props[component];
        } else if (props[component] === true) {
          // Otherwise if it is true, assumes component is blank.
          serialProps[component] = "";
        } else {
          // Otherwise if false lets aframe coerce.
          console.log('coercion prop:', component, props[component]);
          serialProps[component] = props[component];
        }
      } else {
        // Do nothing for components otherwise.
        serialProps[component] = props[component];
      }
    } else if (
      Object.keys(primitiveMappings).indexOf(component) !== -1
      || Object.keys(AFRAME.systems).indexOf(component) !== -1
    ) {
      // Pass through any systems or mapped components from the primitive
      serialProps[component] = props[component];
    }

  });
  return serialProps;
};

/**
 * Register event handlers to ref.
 */
function attachEventsToElement(el, eventMap) {
  if (!eventMap) { return; }
  Object.keys(eventMap).forEach(eventName => {
    el.addEventListener(eventName, event => {
      eventMap[eventName](event);
    });
  });
}
