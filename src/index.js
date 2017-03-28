import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Call `.setAttribute()` on the `ref`, filtering out what's not relevant to A-Frame.
 */
function doSetAttribute (el, props, propName) {
  if (propName === 'className') {
    el.setAttribute('class', props.className);
  } else if (props[propName].constructor === Function) {
    return;
  } else {
    if (el.isNode) {
      el.setAttribute(propName, props[propName]);
    } else {
      el.addEventListener('nodeready', function () {
        console.log("WAITING");
        el.setAttribute(propName, props[propName]);
      });
    }
  }
}

/**
 * Batch `.setAttribute()`s.
 */
function doSetAttributes (el, props) {
  // Set attributes.
  const nonEntityPropNames = ['children', 'events', 'primitive'];
  Object.keys(props).filter(
    propName => nonEntityPropNames.indexOf(propName) === -1
  ).forEach(propName => { doSetAttribute(el, props, propName); });
}

/**
 * Render <a-entity>.
 * Tell React to use A-Frame's .setAttribute() on the DOM element for all prop initializations
 * and updates.
 */
export class Entity extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    events: React.PropTypes.object,
    mixin: React.PropTypes.string,
    primitive: React.PropTypes.string
  };

  componentDidUpdate(prevProps, prevState) {
    const el = this.el;
    const props = this.props;

    // Update events.
    updateEventListeners(el, prevProps.events, props.events);

    // Update entity.
    doSetAttributes(el, props);
  }

  /**
   * In response to initial `ref` callback.
   */
  updateDOM = el => {
    const props = this.props;
    if (!el) { return; }

    // Store.
    this.el = el;

    // Attach events.
    if (props.events) {
      Object.keys(props.events).forEach(eventName => {
        addEventListeners(el, eventName, props.events[eventName]);
      });
    }

    // Update entity.
    doSetAttributes(el, props);
  }

  /**
   * Render A-Frame DOM with ref: https://facebook.github.io/react/docs/refs-and-the-dom.html
   */
  render() {
    const props = this.props;
    const elementName = this.isScene ? 'a-scene' : (props.primitive || 'a-entity');

    // Let through props that are OK to render initially.
    let reactProps = {};
    Object.keys(props).forEach(propName => {
      if (['className', 'id', 'mixin'].indexOf(propName) !== -1 ||
          propName.indexOf('data-') === 0) {
        reactProps[propName] = props[propName];
      }
    });

    return React.createElement(
      elementName,
      {ref: this.updateDOM, ...reactProps},
      props.children);
  }
}

/**
 * Render <a-scene>.
 * <a-scene> extends from <a-entity> in A-Frame so we reuse <Entity/>.
 */
export class Scene extends Entity {
  constructor(props) {
    super(props);
    this.isScene = true;
  }
}

/**
 * Handle diffing of previous and current event maps.
 *
 * @param {Element} el
 * @param {Object} prevEvents - Previous event map.
 * @param {Object} events - Current event map.
 */
function updateEventListeners (el, prevEvents, events) {
  if (!prevEvents || !events || prevEvents === events) { return; }

  Object.keys(events).forEach(eventName => {
    // Didn't change.
    if (events[eventName] && prevEvents[eventName] &&
        prevEvents[eventName].toString() === events[eventName].toString()) { return; }

    // If changed, remove old previous event listeners.
    if (prevEvents[eventName]) {
      removeEventListeners(el, eventName, prevEvents[eventName]);
    }

    // Add new event listeners.
    addEventListeners(el, eventName, events[eventName]);
  });

  // See if event handlers were removed.
  Object.keys(prevEvents).forEach(eventName => {
    if (!events[eventName]) { removeEventListeners(el, eventName, prevEvents[eventName]); }
  });
}

/**
 * Register event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
function addEventListeners (el, eventName, handlers) {
  if (!handlers) { return; }

  // Convert to array.
  if (handlers.constructor === Function) { handlers = [handlers]; }

  // Register.
  handlers.forEach(handler => { el.addEventListener(eventName, handler); });
}

/**
 * Unregister event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
function removeEventListeners (el, eventName, handlers) {
  if (!handlers) { return; }

  // Convert to array.
  if (handlers.constructor === Function) { handlers = [handlers]; }

  // Unregister.
  handlers.forEach(handler => { el.removeEventListener(eventName, handler); });
}
