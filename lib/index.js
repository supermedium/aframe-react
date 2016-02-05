'use strict';

var _index = require('C:\\Projects\\comics\\node_modules\\babel-preset-react-hmre\\node_modules\\redbox-react\\lib\\index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('C:\\Projects\\comics\\node_modules\\babel-preset-react-hmre\\node_modules\\react-transform-catch-errors\\lib\\index.js');

var _index4 = _interopRequireDefault(_index3);

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _index5 = require('C:\\Projects\\comics\\node_modules\\babel-preset-react-hmre\\node_modules\\react-transform-hmr\\lib\\index.js');

var _index6 = _interopRequireDefault(_index5);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2, _class2, _temp4, _class3, _temp6;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.Entity = exports.Animation = undefined;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _styleAttr = require('style-attr');

var _styleAttr2 = _interopRequireDefault(_styleAttr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  Animation: {
    displayName: 'Animation'
  },
  Entity: {
    displayName: 'Entity'
  },
  Scene: {
    displayName: 'Scene'
  }
};

var _CProjectsComicsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/index.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _CProjectsComicsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/index.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _CProjectsComicsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_CProjectsComicsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}

var Animation = exports.Animation = _wrapComponent('Animation')((_temp2 = _class = function (_React$Component) {
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
      return _react3.default.createElement('a-animation', _extends({ ref: this.attachEvents }, this.props));
    }
  }]);

  return Animation;
}(_react3.default.Component), _class.propTypes = {
  onAnimationEnd: _react3.default.PropTypes.func,
  onAnimationStart: _react3.default.PropTypes.func
}, _class.defaultProps = {
  onAnimationEnd: function onAnimationEnd() {},
  onAnimationStart: function onAnimationStart() {}
}, _temp2));

var Entity = exports.Entity = _wrapComponent('Entity')((_temp4 = _class2 = function (_React$Component2) {
  _inherits(Entity, _React$Component2);

  function Entity() {
    var _Object$getPrototypeO2;

    var _temp3, _this2, _ret2;

    _classCallCheck(this, Entity);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp3 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Entity)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.attachEvents = function (el) {
      if (el) {
        el.addEventListener('click', function (event) {
          _this2.props.onClick(event);
        });
        el.addEventListener('loaded', function (event) {
          _this2.props.onLoaded(event);
        });
        el.addEventListener('mouseenter', function (event) {
          _this2.props.onMouseEnter(event);
        });
        el.addEventListener('mouseleave', function (event) {
          _this2.props.onMouseLeave(event);
        });
      }
    }, _temp3), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Entity, [{
    key: 'serializeComponents',

    /**
     * Stringify components passed as an object.
     *
     * {primitive: box; width: 10} to 'primitive: box; width: 10'
     */
    value: function serializeComponents() {
      var _this3 = this;

      var props = {};
      Object.keys(this.props).forEach(function (component) {
        if (['children', 'mixin'].indexOf(component) !== -1) {
          return;
        }

        if (_this3.props[component].constructor === Function) {
          return;
        }

        if (_this3.props[component].constructor === Object) {
          // Stringify components passed as object.
          props[component] = _styleAttr2.default.stringify(_this3.props[component]);
        } else {
          // Do nothing for components otherwise.
          props[component] = _this3.props[component];
        }
      });
      return props;
    }
  }, {
    key: 'render',
    value: function render() {
      var mixinProp = this.props.mixin ? { mixin: this.props.mixin } : {};

      return _react3.default.createElement(
        'a-entity',
        _extends({ ref: this.attachEvents
        }, mixinProp, this.serializeComponents()),
        this.props.children
      );
    }
  }]);

  return Entity;
}(_react3.default.Component), _class2.propTypes = {
  children: _react3.default.PropTypes.any,
  mixin: _react3.default.PropTypes.string,
  onClick: _react3.default.PropTypes.func,
  onLoaded: _react3.default.PropTypes.func,
  onMouseEnter: _react3.default.PropTypes.func,
  onMouseLeave: _react3.default.PropTypes.func
}, _class2.defaultProps = {
  onClick: function onClick() {},
  onLoaded: function onLoaded() {}
}, _temp4));

var Scene = exports.Scene = _wrapComponent('Scene')((_temp6 = _class3 = function (_React$Component3) {
  _inherits(Scene, _React$Component3);

  function Scene() {
    var _Object$getPrototypeO3;

    var _temp5, _this4, _ret3;

    _classCallCheck(this, Scene);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp5 = (_this4 = _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(Scene)).call.apply(_Object$getPrototypeO3, [this].concat(args))), _this4), _this4.attachEvents = function (el) {
      if (el) {
        el.addEventListener('loaded', function (event) {
          _this4.props.onLoaded(event);
        });
        if (_this4.props.onTick) {
          setTimeout(function () {
            el.addBehavior({
              update: _this4.props.onTick
            });
          });
        }
      }
    }, _temp5), _possibleConstructorReturn(_this4, _ret3);
  }

  _createClass(Scene, [{
    key: 'render',
    value: function render() {
      return _react3.default.createElement(
        'a-scene',
        _extends({ ref: this.attachEvents }, this.props),
        this.props.children
      );
    }
  }]);

  return Scene;
}(_react3.default.Component), _class3.propTypes = {
  onLoaded: _react3.default.PropTypes.func,
  onTick: _react3.default.PropTypes.func
}, _class3.defaultProps = {
  onLoaded: function onLoaded() {}
}, _temp6));