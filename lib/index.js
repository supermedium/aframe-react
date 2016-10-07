'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.Entity = exports.Animation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _aframe = require('aframe');

var _styleAttr = require('style-attr');

var _styleAttr2 = _interopRequireDefault(_styleAttr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Stringify components passed as an object.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */
function serializeComponents(props) {
  var serialProps = {};
  Object.keys(props).forEach(function (component) {
    if (['children', 'mixin'].indexOf(component) !== -1) {
      return;
    }

    if (props[component].constructor === Function) {
      return;
    }

    var ind = Object.keys(_aframe.components).indexOf(component);
    //Discards props that aren't components.
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
      if (_aframe.components[component].schema.hasOwnProperty("type") && _aframe.components[component].schema.type === 'boolean') {
        //If the component takes one property and it is Boolean
        //just passes in the prop.
        serialProps[component] = props[component];
      } else if (props[component] === true) {
        //Otherwise if it is true, assumes component is blank.
        serialProps[component] = "";
      } else {
        //Otherwise if false lets aframe coerce.
        serialProps[component] = props[component];
      }
    } else {
      // Do nothing for components otherwise.
      serialProps[component] = props[component];
    }
  });
  return serialProps;
};

var Animation = exports.Animation = function (_React$Component) {
  _inherits(Animation, _React$Component);

  function Animation() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Animation);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Animation)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.attachEvents = function (el) {
      if (el) {
        el.addEventListener('animationend', function (event) {
          _this.props.onAnimationEnd(event);
        });
        el.addEventListener('animationstart', function (event) {
          _this.props.onAnimationStart(event);
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Animation, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('a-animation', _extends({ ref: this.attachEvents }, serializeComponents(this.props)));
    }
  }]);

  return Animation;
}(_react2.default.Component);

Animation.propTypes = {
  onAnimationEnd: _react2.default.PropTypes.func,
  onAnimationStart: _react2.default.PropTypes.func
};
Animation.defaultProps = {
  onAnimationEnd: function onAnimationEnd() {},
  onAnimationStart: function onAnimationStart() {}
};

var Entity = exports.Entity = function (_React$Component2) {
  _inherits(Entity, _React$Component2);

  function Entity() {
    var _Object$getPrototypeO2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Entity);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Entity)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.attachEvents = function (el) {
      if (el) {
        el.addEventListener('cursor-click', function (event) {
          _this2.props.onClick(event);
        });
        el.addEventListener('loaded', function (event) {
          _this2.props.onLoaded(event);
        });
        el.addEventListener('cursor-mouseenter', function (event) {
          _this2.props.onMouseEnter(event);
        });
        el.addEventListener('cursor-mouseleave', function (event) {
          _this2.props.onMouseLeave(event);
        });
        el.addEventListener('cursor-mousedown', function (event) {
          _this2.props.onMouseDown(event);
        });
        el.addEventListener('cursor-mouseup', function (event) {
          _this2.props.onMouseUp(event);
        });
        el.addEventListener('child-attached', function (event) {
          _this2.props.onChildAttached(event);
        });
        el.addEventListener('componentchanged', function (event) {
          _this2.props.onComponentChanged(event);
        });
        el.addEventListener('pause', function (event) {
          _this2.props.onPause(event);
        });
        el.addEventListener('play', function (event) {
          _this2.props.onPlay(event);
        });
        el.addEventListener('stateadded', function (event) {
          _this2.props.onStateAdded(event);
        });
        el.addEventListener('stateremoved', function (event) {
          _this2.props.onStateRemoved(event);
        });
      }
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Entity, [{
    key: 'render',
    value: function render() {
      var mixinProp = this.props.mixin ? { mixin: this.props.mixin } : {};

      return _react2.default.createElement(
        'a-entity',
        _extends({ ref: this.attachEvents
        }, mixinProp, serializeComponents(this.props)),
        this.props.children
      );
    }
  }]);

  return Entity;
}(_react2.default.Component);

Entity.propTypes = {
  children: _react2.default.PropTypes.any,
  mixin: _react2.default.PropTypes.string,
  onClick: _react2.default.PropTypes.func,
  onLoaded: _react2.default.PropTypes.func,
  onMouseEnter: _react2.default.PropTypes.func,
  onMouseLeave: _react2.default.PropTypes.func,
  onMouseDown: _react2.default.PropTypes.func,
  onMouseUp: _react2.default.PropTypes.func,
  onChildAttached: _react2.default.PropTypes.func,
  onComponentChanged: _react2.default.PropTypes.func,
  onPause: _react2.default.PropTypes.func,
  onPlay: _react2.default.PropTypes.func,
  onStateAdded: _react2.default.PropTypes.func,
  onStateRemoved: _react2.default.PropTypes.func
};
Entity.defaultProps = {
  onClick: function onClick() {},
  onLoaded: function onLoaded() {},
  onMouseEnter: function onMouseEnter() {},
  onMouseLeave: function onMouseLeave() {},
  onMouseDown: function onMouseDown() {},
  onMouseUp: function onMouseUp() {},
  onChildAttached: function onChildAttached() {},
  onComponentChanged: function onComponentChanged() {},
  onPause: function onPause() {},
  onPlay: function onPlay() {},
  onStateAdded: function onStateAdded() {},
  onStateRemoved: function onStateRemoved() {}
};

var Scene = exports.Scene = function (_React$Component3) {
  _inherits(Scene, _React$Component3);

  function Scene() {
    var _Object$getPrototypeO3;

    var _temp3, _this3, _ret3;

    _classCallCheck(this, Scene);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(Scene)).call.apply(_Object$getPrototypeO3, [this].concat(args))), _this3), _this3.attachEvents = function (el) {
      if (el) {
        el.addEventListener('enter-vr', function (event) {
          _this3.props.onEnterVR(event);
        });
        el.addEventListener('exit-vr', function (event) {
          _this3.props.onExitVR(event);
        });
        el.addEventListener('loaded', function (event) {
          _this3.props.onLoaded(event);
        });
      }
    }, _temp3), _possibleConstructorReturn(_this3, _ret3);
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

Scene.propTypes = {
  onEnterVR: _react2.default.PropTypes.func,
  onExitVR: _react2.default.PropTypes.func,
  onLoaded: _react2.default.PropTypes.func
};
Scene.defaultProps = {
  onEnterVR: function onEnterVR() {},
  onExitVR: function onExitVR() {},
  onLoaded: function onLoaded() {}
};