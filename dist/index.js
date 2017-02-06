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

var _styleAttr = require('style-attr');

var _styleAttr2 = _interopRequireDefault(_styleAttr);

var _DOMProperty = require('react/lib/DOMProperty');

var _eventUtils = require('./eventUtils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var knownCustomAttributes = [];

function flatMap(collection, map) {
  return Array.prototype.concat.apply([], collection.map(map));
}

function unique(collection) {
  return Array.from(new Set(collection));
}

// Get items that are in arr1, but not in arr2 (NOTE: will ignore items that are
// in arr2, but not in arr1)
function arrayDiff(arr1, arr2) {
  return arr1.filter(function (val) {
    return arr2.indexOf(val) === -1;
  });
}

function currentCustomAttributes() {
  return unique([].concat(Object.keys(AFRAME.components), Object.keys(AFRAME.systems), flatMap(Object.keys(AFRAME.primitives.primitives), function (primitive) {
    return Object.keys(AFRAME.primitives.primitives[primitive].prototype.mappings);
  })));
}

function newCustomAttributes() {
  var allCustomAttributes = currentCustomAttributes();
  return arrayDiff(allCustomAttributes, knownCustomAttributes);
}

function tellReactAboutAframeAttributes() {

  var customAttributes = newCustomAttributes();

  if (customAttributes.length === 0) {
    return;
  }

  // Tell react about all the possible custom attributes that could exist on an
  // element: Components, Systems, and Primitive Mappings
  _DOMProperty.injection.injectDOMPropertyConfig({

    // Every attribute we know about should be treated as custom
    isCustomAttribute: function isCustomAttribute(attr) {
      return customAttributes.indexOf(attr) !== -1;
    },

    // Ensure camelCased attributes aren't lower-cased (eg; radialSegments)
    DOMAttributeNames: customAttributes.reduce(function (memo, attributeName) {
      memo[attributeName] = attributeName;
      return memo;
    }, {})
  });

  knownCustomAttributes = knownCustomAttributes.concat(customAttributes);
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

      var onLoaded = function onLoaded() {

        // Required so that a-frame will pick up the attributes that react has set
        // for us
        // el.flushToDOM(true);

      };

      attachEventsToElement(el, Object.assign({}, _this.props.events, (0, _eventUtils.getEventMappings)(_this.props)));

      // If it's already loaded, go ahead and flush the DOM
      if (el.hasLoaded) {
        onLoaded();
      } else {
        // Otherwise, wait until the event is triggered
        el.addEventListener('loaded', onLoaded);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Entity, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // this._serialProps = serializeComponents(this.props);
      tellReactAboutAframeAttributes();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      // this._serialProps = serializeComponents(this.props);
      tellReactAboutAframeAttributes();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // Allow through normal attributes..
      var otherProps = {};
      ['id', 'mixin'].forEach(function (propName) {
        if (_this2.props[propName]) {
          otherProps[propName] = _this2.props[propName];
        }
      });

      return _react2.default.createElement(this.props.primitive || 'a-entity', Object.assign({ ref: this.attachEvents }, otherProps, serializeComponents(this.props)), this.props.children);
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
  mixin: _react2.default.PropTypes.string,
  primitve: _react2.default.PropTypes.string
};

var Scene = exports.Scene = function (_React$Component2) {
  _inherits(Scene, _React$Component2);

  function Scene(props) {
    _classCallCheck(this, Scene);

    var _this3 = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this, props));

    _this3.attachEvents = function (el) {

      if (!el) {
        return;
      }

      var onLoaded = function onLoaded() {

        // Required so that a-frame will pick up the attributes that react has set
        // for us
        // el.flushToDOM(true);

        _this3.setState({ renderChildren: true });
      };

      attachEventsToElement(el, Object.assign({}, _this3.props.events, (0, _eventUtils.getEventMappings)(_this3.props)));

      if (!_this3.state.renderChildren) {
        // If it's already loaded, go ahead and render children
        if (el.hasLoaded) {
          onLoaded();
        } else {
          // Otherwise, wait until the event is triggered
          el.addEventListener('loaded', onLoaded);
        }
      }
    };

    _this3.state = { renderChildren: false };
    return _this3;
  }

  _createClass(Scene, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // This will occur before anything is written to the DOM
      tellReactAboutAframeAttributes();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      // this._serialProps = serializeComponents(this.props);
      tellReactAboutAframeAttributes();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      // Allow through normal attributes..
      var otherProps = {};
      ['id', 'mixin'].forEach(function (propName) {
        if (_this4.props[propName]) {
          otherProps[propName] = _this4.props[propName];
        }
      });

      return _react2.default.createElement(
        'a-scene',
        _extends({
          ref: this.attachEvents
        }, otherProps, serializeComponents(this.props)),
        this.state.renderChildren ? this.props.children : undefined
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

  var primitiveMappings = {};

  if (props.primitive) {
    var entityPrimitive = AFRAME.primitives.primitives[props.primitive];
    if (entityPrimitive) {
      primitiveMappings = entityPrimitive.prototype.mappings;
    }
  }

  var serialProps = {};
  Object.keys(props).forEach(function (component) {
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

    if (props[component].constructor === Function) {
      return;
    }

    if (Object.keys(components).indexOf(component.split('__')[0]) !== -1) {
      // Handle props that are components

      if (props[component].constructor === Array) {
        // Stringify components passed as array.
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
          console.log('coercion prop:', component, props[component]);
          serialProps[component] = props[component];
        }
      } else {
        // Do nothing for components otherwise.
        serialProps[component] = props[component];
      }
    } else if (Object.keys(primitiveMappings).indexOf(component) !== -1 || Object.keys(AFRAME.systems).indexOf(component) !== -1) {
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
  if (!eventMap) {
    return;
  }
  Object.keys(eventMap).forEach(function (eventName) {
    el.addEventListener(eventName, function (event) {
      eventMap[eventName](event);
    });
  });
}