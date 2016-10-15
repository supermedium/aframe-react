'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.Entity = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.serializeComponents = serializeComponents;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _case = require('case');

var _case2 = _interopRequireDefault(_case);

var _styleAttr = require('style-attr');

var _styleAttr2 = _interopRequireDefault(_styleAttr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isFunction(thing) {
  return Object.prototype.toString.call(thing) === '[object Function]';
}

function getAframeEventMappings(possibleEventHandlers) {
  return Object.keys(possibleEventHandlers).filter(function (reactEventName) {
    return !!reactEventName.match(/^on[A-Z]/) && isFunction(possibleEventHandlers[reactEventName]);
  }).reduce(function (handlers, reactEventName) {
    var aframeEventName = _case2.default.kebab(reactEventName.replace(/^on/, ''));
    handlers[aframeEventName] = possibleEventHandlers[reactEventName];
    return handlers;
  }, {});
}

function attachAframeEventsToElement(el, eventMap) {
  if (!eventMap) {
    return;
  }
  Object.keys(eventMap).forEach(function (eventName) {
    el.addEventListener(eventName, function (event) {
      eventMap[eventName](event);
    });
  });
}

/**
 * <a-entity>
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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Entity.__proto__ || Object.getPrototypeOf(Entity)).call.apply(_ref, [this].concat(args))), _this), _this.attachEvents = function (el) {
      if (!el) {
        return;
      }
      attachAframeEventsToElement(el, _this.props.events);
      attachAframeEventsToElement(el, getAframeEventMappings(_this.props));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Entity, [{
    key: 'render',
    value: function render() {
      var mixinProp = this.props.mixin ? { mixin: this.props.mixin } : {};
      return _react2.default.createElement(
        'a-entity',
        _extends({
          ref: this.attachEvents
        }, mixinProp, serializeComponents(this.props)),
        this.props.children
      );
    }
  }]);

  return Entity;
}(_react2.default.Component);

/**
 * <a-scene>
 */


Entity.propTypes = {
  children: _react2.default.PropTypes.any,
  events: _react2.default.PropTypes.object,
  mixin: _react2.default.PropTypes.string
};

var Scene = exports.Scene = function (_React$Component2) {
  _inherits(Scene, _React$Component2);

  function Scene() {
    var _ref2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Scene);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = Scene.__proto__ || Object.getPrototypeOf(Scene)).call.apply(_ref2, [this].concat(args))), _this2), _this2.attachEvents = function (el) {
      if (!el) {
        return;
      }
      attachAframeEventsToElement(el, _this2.props.events);
      attachAframeEventsToElement(el, getAframeEventMappings(_this2.props));
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Scene, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'a-scene',
        _extends({ ref: this.attachEvents }, serializeComponents(this.props)),
        this.props.children
      );
    }
  }]);

  return Scene;
}(_react2.default.Component);

/**
 * Serialize React props to A-Frame components.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */


Scene.propTypes = {
  events: _react2.default.PropTypes.object
};
function serializeComponents(props) {
  var components = AFRAME.components;

  var serialProps = {};
  Object.keys(props).forEach(function (component) {
    if (['children', 'mixin'].indexOf(component) !== -1) {
      return;
    }

    if (props[component].constructor === Function) {
      return;
    }

    var ind = Object.keys(components).indexOf(component.split('__')[0]);
    // Discards props that aren't components.
    if (ind === -1) {
      return;
    }

    if (props[component].constructor === Array) {
      //Stringify components passed as array.
      serialProps[component] = props[component].join(' ');
    } else if (props[component].constructor === Object) {
      // Stringify components passed as object.
      serialProps[component] = _styleAttr2.default.stringify(props[component]);
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