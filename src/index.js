import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';
import {getEventMappings} from './eventUtils.js';

/**
 * <a-entity>
 */
export class Entity extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    events: React.PropTypes.object,
    mixin: React.PropTypes.string,
    primitive: React.PropTypes.string
  };

  attachEvents = el => {
    if (!el) { return; }
    attachEventsToElement(el, Object.assign(
      {},
      this.props.events,
      getEventMappings(this.props)
    ));
  };

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

  attachEvents = el => {
    if (!el) { return; }
    attachEventsToElement(el, Object.assign(
      {},
      this.props.events,
      getEventMappings(this.props)
    ));
  };

  render() {
    // Allow through normal attributes..
    const otherProps = {};
    ['id', 'mixin', 'antialias'].forEach(propName => {
      if (this.props[propName]) { otherProps[propName] = this.props[propName]; }
    });

    return (
      <a-scene
        ref={this.attachEvents}
        {...otherProps}
        {...serializeComponents(this.props)}>
        {this.props.children}
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
  var components = AFRAME.components;

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

    if (props[component] === undefined) { return; }

    if (props[component] && props[component].constructor === Function) { return; }

    var ind = Object.keys(components).indexOf(component.split('__')[0]);
    // Discards props that aren't components.
    if (ind === -1) { return; }

    if (props[component] === null) {
      serialProps[component] = null;
    } else if (props[component].constructor === Array) {
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
        serialProps[component] = props[component];
      }
    } else {
      // Do nothing for components otherwise.
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
