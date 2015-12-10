'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.Entity = exports.Animation = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styleAttr = require('style-attr');

var _styleAttr2 = _interopRequireDefault(_styleAttr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Animation = exports.Animation = (function (_React$Component) {
  _inherits(Animation, _React$Component);

  function Animation() {
    _classCallCheck(this, Animation);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Animation).apply(this, arguments));
  }

  _createClass(Animation, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('a-animation', this.props);
    }
  }]);

  return Animation;
})(_react2.default.Component);

var Entity = exports.Entity = (function (_React$Component2) {
  _inherits(Entity, _React$Component2);

  function Entity() {
    _classCallCheck(this, Entity);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Entity).apply(this, arguments));
  }

  _createClass(Entity, [{
    key: 'serializeComponents',
    value: function serializeComponents() {
      var _this3 = this;

      var props = {};
      Object.keys(this.props).forEach(function (component) {
        if (component === 'children') {
          return;
        }

        if (_this3.props[component].constructor === Object) {
          // Stringify components passed as object.
          props[component] = _styleAttr2.default.stringify(_this3.props[component]);
        } else {
          // Do nothing for components passed as string.
          props[component] = _this3.props[component];
        }
      });
      return props;
    }
  }, {
    key: 'render',
    value: function render() {
      var serializedProps = this.serializeComponents();

      return _react2.default.createElement(
        'a-entity',
        serializedProps,
        this.props.children
      );
    }
  }]);

  return Entity;
})(_react2.default.Component);

var Scene = exports.Scene = (function (_React$Component3) {
  _inherits(Scene, _React$Component3);

  function Scene() {
    _classCallCheck(this, Scene);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Scene).apply(this, arguments));
  }

  _createClass(Scene, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'a-scene',
        null,
        this.props.children
      );
    }
  }]);

  return Scene;
})(_react2.default.Component);