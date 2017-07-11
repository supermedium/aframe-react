'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.Entity = exports.options = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nonEntityPropNames = ['children', 'events', 'primitive'];
var filterNonEntityPropNames = function filterNonEntityPropNames(propName) {
  return nonEntityPropNames.indexOf(propName) === -1;
};

var options = {
  // React needs this because React serializes.
  // Preact does not because Preact runs `.setAttribute` on its own.
  runSetAttributeOnUpdates: true
};
exports.options = options;

/**
 * Call `.setAttribute()` on the `ref`, passing prop data directly to A-Frame.
 */

function doSetAttribute(el, props, propName) {
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
function updateAttributes(el, prevProps, props) {
  if (!props || prevProps === props) {
    return;
  }

  // Set attributes.
  Object.keys(props).filter(filterNonEntityPropNames).forEach(function (propName) {
    doSetAttribute(el, props, propName);
  });

  // See if attributes were removed.
  if (prevProps) {
    Object.keys(prevProps).filter(filterNonEntityPropNames).forEach(function (propName) {
      if (props[propName] === undefined) {
        el.removeAttribute(propName);
      }
    });
  }
}

/**
 * Render <a-entity>.
 * Tell React to use A-Frame's .setAttribute() on the DOM element for all prop initializations
 * and updates.
 */

var Entity = exports.Entity = function (_React$Component) {
  _inherits(Entity, _React$Component);

  function Entity() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Entity);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Entity.__proto__ || Object.getPrototypeOf(Entity)).call.apply(_ref, [this].concat(args))), _this), _this.initEntity = function (el) {
      var props = _this.props;
      if (!el) {
        return;
      }

      // Store.
      _this.el = el;

      // Attach events.
      if (props.events) {
        Object.keys(props.events).forEach(function (eventName) {
          addEventListeners(el, eventName, props.events[eventName]);
        });
      }

      // Update entity.
      updateAttributes(el, null, props);

      // Allow ref.
      if (props._ref) {
        props._ref(el);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * In response to initial `ref` callback.
   */


  _createClass(Entity, [{
    key: 'componentDidUpdate',


    /**
     * Handle updates after the initial render.
     */
    value: function componentDidUpdate(prevProps, prevState) {
      var el = this.el;
      var props = this.props;

      // Update events.
      updateEventListeners(el, prevProps.events, props.events);

      // Update entity.
      if (options.runSetAttributeOnUpdates) {
        updateAttributes(el, prevProps, props);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var el = this.el;
      var props = this.props;

      if (props.events) {
        // Remove events.
        Object.keys(props.events).forEach(function (eventName) {
          removeEventListeners(el, eventName, props.events[eventName]);
        });
      }
    }

    /**
     * Render A-Frame DOM with ref: https://facebook.github.io/react/docs/refs-and-the-dom.html
     */

  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var elementName = this.isScene ? 'a-scene' : props.primitive || 'a-entity';

      // Let through props that are OK to render initially.
      var reactProps = {};
      Object.keys(props).forEach(function (propName) {
        if (['className', 'id', 'mixin'].indexOf(propName) !== -1 || propName.indexOf('data-') === 0) {
          reactProps[propName] = props[propName];
        }
      });

      return _react2.default.createElement(elementName, _extends({ ref: this.initEntity }, reactProps), props.children);
    }
  }]);

  return Entity;
}(_react2.default.Component);

/**
 * Render <a-scene>.
 * <a-scene> extends from <a-entity> in A-Frame so we reuse <Entity/>.
 */


var Scene = exports.Scene = function (_Entity) {
  _inherits(Scene, _Entity);

  function Scene(props) {
    _classCallCheck(this, Scene);

    var _this2 = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this, props));

    _this2.isScene = true;
    return _this2;
  }

  return Scene;
}(Entity);

/**
 * Handle diffing of previous and current event maps.
 *
 * @param {Element} el
 * @param {Object} prevEvents - Previous event map.
 * @param {Object} events - Current event map.
 */


function updateEventListeners(el, prevEvents, events) {
  if (!prevEvents || !events || prevEvents === events) {
    return;
  }

  Object.keys(events).forEach(function (eventName) {
    // Didn't change.
    if (prevEvents[eventName] === events[eventName]) {
      return;
    }

    // If changed, remove old previous event listeners.
    if (prevEvents[eventName]) {
      removeEventListeners(el, eventName, prevEvents[eventName]);
    }

    // Add new event listeners.
    addEventListeners(el, eventName, events[eventName]);
  });

  // See if event handlers were removed.
  Object.keys(prevEvents).forEach(function (eventName) {
    if (!events[eventName]) {
      removeEventListeners(el, eventName, prevEvents[eventName]);
    }
  });
}

/**
 * Register event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
function addEventListeners(el, eventName, handlers) {
  if (!handlers) {
    return;
  }

  // Convert to array.
  if (handlers.constructor === Function) {
    handlers = [handlers];
  }

  // Register.
  handlers.forEach(function (handler) {
    el.addEventListener(eventName, handler);
  });
}

/**
 * Unregister event handlers for an event name to ref.
 *
 * @param {Element} el - DOM element.
 * @param {string} eventName
 * @param {array|function} eventHandlers - Handler function or array of handler functions.
 */
function removeEventListeners(el, eventName, handlers) {
  if (!handlers) {
    return;
  }

  // Convert to array.
  if (handlers.constructor === Function) {
    handlers = [handlers];
  }

  // Unregister.
  handlers.forEach(function (handler) {
    el.removeEventListener(eventName, handler);
  });
}