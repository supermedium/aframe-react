import React from 'react';

const nonEntityPropNames = ['children', 'events', 'primitive'];
const filterNonEntityPropNames = propName => nonEntityPropNames.indexOf(propName) === -1;

const options = {
  // React needs this because React serializes.
  // Preact does not because Preact runs `.setAttribute` on its own.
  runSetAttributeOnUpdates: true
};
export {options};

/**
 * Call `.setAttribute()` on the `ref`, passing prop data directly to A-Frame.
 */
function doSetAttribute (el, props, propName) {
  if (propName === 'className') {
    el.setAttribute('class', props.className);
  } else if (props[propName] && props[propName].constructor === Function) {
    return;
  } else {
    el.setAttribute(propName, props[propName]);
  }
}

/**
 * Handle diffing of previous and current attributes.
 *
 * @param {Element} el
 * @param {Object|null} prevProps - Previous props map.
 * @param {Object} props - Current props map.
 */
function updateAttributes (el, prevProps, props) {
  var propName;

  if (!props || prevProps === props) { return; }

  // Set attributes.
  for (propName in props) {
    if (!filterNonEntityPropNames(propName)) { continue; }
    doSetAttribute(el, props, propName);
  }

  // See if attributes were removed.
  if (prevProps) {
    for (propName in prevProps) {
      if (!filterNonEntityPropNames(propName)) { continue; }
      if (props[propName] === undefined) { el.removeAttribute(propName); }
    }
  }
}

/**
 * Render <a-entity>.
 * Tell React to use A-Frame's .setAttribute() on the DOM element for all prop initializations
 * and updates.
 */
export class Entity extends React.Component {
  /**
   * In response to initial `ref` callback.
   */
  initEntity = el => {
    const props = this.props;
    var eventName;

    if (!el) { return; }

    // Store.
    this.el = el;

    // Attach events.
    if (props.events) {
      for (eventName in props.events) {
        addEventListeners(el, eventName, props.events[eventName]);
      }
    }

    // Update entity.
    updateAttributes(el, null, props);

    // Allow ref.
    if (props._ref) { props._ref(el); }
  };

  /**
   * Handle updates after the initial render.
   */
  componentDidUpdate (prevProps, prevState) {
    const el = this.el;
    const props = this.props;

    // Update events.
    updateEventListeners(el, prevProps.events, props.events);

    // Update entity.
    if (options.runSetAttributeOnUpdates) {
      updateAttributes(el, prevProps, props);
    }
  }

  componentWillUnmount () {
    const el = this.el;
    const props = this.props;
    var eventName;

    if (props.events) {
      // Remove events.
      for (eventName in props.events) {
        removeEventListeners(el, eventName, props.events[eventName]);
      }
    }
  }

  /**
   * Render A-Frame DOM with ref: https://facebook.github.io/react/docs/refs-and-the-dom.html
   */
  render () {
    const props = this.props;
    const elementName = this.isScene ? 'a-scene' : (props.primitive || 'a-entity');
    var propName;

    // Let through props that are OK to render initially.
    let reactProps = {};
    for (propName in props) {
      if (['className', 'id', 'mixin'].indexOf(propName) !== -1 ||
          propName.indexOf('data-') === 0) {
        reactProps[propName] = props[propName];
      }
    }

    return React.createElement(
      elementName,
      {ref: this.initEntity, ...reactProps},
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
  var eventName;

  if (!prevEvents || !events || prevEvents === events) { return; }

  for (eventName in events) {
    // Didn't change.
    if (prevEvents[eventName] === events[eventName]) {
      continue;
    }

    // If changed, remove old previous event listeners.
    if (prevEvents[eventName]) {
      removeEventListeners(el, eventName, prevEvents[eventName]);
    }

    // Add new event listeners.
    addEventListeners(el, eventName, events[eventName]);
  }

  // See if event handlers were removed.
  for (eventName in prevEvents) {
    if (!events[eventName]) { removeEventListeners(el, eventName, prevEvents[eventName]); }
  }
}

/**
 * Register event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
function addEventListeners (el, eventName, handlers) {
  var handler;
  var i;

  if (!handlers) { return; }

  // Convert to array.
  if (handlers.constructor === Function) { handlers = [handlers]; }

  // Register.
  for (i = 0; i < handlers.length; i++) {
    el.addEventListener(eventName, handlers[i]);
  }
}

/**
 * Unregister event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
function removeEventListeners (el, eventName, handlers) {
  var handler;
  var i;

  if (!handlers) { return; }

  // Convert to array.
  if (handlers.constructor === Function) { handlers = [handlers]; }

  // Unregister.
  for (i = 0; i < handlers.length; i++) {
    el.removeEventListener(eventName, handlers[i]);
  }
}
