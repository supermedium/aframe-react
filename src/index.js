import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';
import {getEventMappings} from './eventUtils';

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
    ['id', 'mixin'].forEach(propName => {
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
  const components = AFRAME.components;
  const serialProps = {};

  Object.keys(props).forEach(component => {
    const value = props[component];
    const { constructor } = value;
    const definition = components[component];
    const schema = definition ? definition.schema : {};

    // Allow these.
    if (['class', 'children', 'id', 'mixin'].indexOf(component) !== -1) {
      return;
    }

    // className to class.
    if (component === 'className') {
      serialProps.class = value;
      serialProps.className = value;
      return;
    }

    if (props[component] === undefined) { return; }

    if (props[component].constructor === Function) { return; }

    if (constructor === Array) {
      // Stringify components passed as array.
      serialProps[component] = value.join(' ');
    } else if (constructor === Object) {
      // Stringify components passed as object.
      serialProps[component] = styleParser.stringify(value);
    } else if (constructor === Boolean) {
      if (schema.type === 'boolean') {
        // If the component takes one property and it is Boolean
        // just passes in the prop.
        serialProps[component] = value;
      } else if (value === true) {
        // Otherwise if it is true, assumes component is blank.
        serialProps[component] = "";
      } else {
        // Otherwise if false lets aframe coerce.
        serialProps[component] = value;
      }
    } else {
      // Do nothing for components otherwise.
      serialProps[component] = value;
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
