import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';

/**
 * Stringify components passed as an object.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */
export function serializeComponents (props) {
  var components = AFRAME.components;

  let serialProps = {};
  Object.keys(props).forEach(component => {
    if (['children', 'mixin'].indexOf(component) !== -1) { return; }

    if (props[component].constructor === Function) { return; }

    var ind = Object.keys(components).indexOf(component);
    // Discards props that aren't components.
    if (ind === -1) { return; }

    if (props[component].constructor === Array) {
      //Stringify components passed as array.
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

export class Animation extends React.Component {
  static propTypes = {
    onAnimationEnd: React.PropTypes.func,
    onAnimationStart: React.PropTypes.func
  };

  static defaultProps = {
    onAnimationEnd: () => {},
    onAnimationStart: () => {},
  };

  attachEvents = el => {
    if (el) {
      el.addEventListener('animationend', event => {
        this.props.onAnimationEnd(event);
      });
      el.addEventListener('animationstart', event => {
        this.props.onAnimationStart(event);
      });
    }
  };

  render() {
    return (
      <a-animation ref={this.attachEvents} {...serializeComponents(this.props)}></a-animation>
    );
  }
}

export class Entity extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    mixin: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onLoaded: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
    onMouseDown: React.PropTypes.func,
    onMouseUp: React.PropTypes.func,
    onChildAttached: React.PropTypes.func,
    onComponentChanged: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onStateAdded: React.PropTypes.func,
    onStateRemoved: React.PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
    onLoaded: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseDown: () => {},
    onMouseUp: () => {},
    onChildAttached: () => {},
    onComponentChanged: () => {},
    onPause: () => {},
    onPlay: () => {},
    onStateAdded: () => {},
    onStateRemoved: () => {},
  };

  attachEvents = el => {
    if (el) {
      el.addEventListener('cursor-click', event => {
        this.props.onClick(event);
      });
      el.addEventListener('loaded', event => {
        this.props.onLoaded(event);
      });
      el.addEventListener('cursor-mouseenter', event => {
        this.props.onMouseEnter(event);
      });
      el.addEventListener('cursor-mouseleave', event => {
        this.props.onMouseLeave(event);
      });
      el.addEventListener('cursor-mousedown', event => {
        this.props.onMouseDown(event);
      });
      el.addEventListener('cursor-mouseup', event => {
        this.props.onMouseUp(event);
      });
      el.addEventListener('child-attached', event => {
        this.props.onChildAttached(event);
      });
      el.addEventListener('componentchanged', event => {
        this.props.onComponentChanged(event);
      });
      el.addEventListener('pause', event => {
        this.props.onPause(event);
      });
      el.addEventListener('play', event => {
        this.props.onPlay(event);
      });
      el.addEventListener('stateadded', event => {
        this.props.onStateAdded(event);
      });
      el.addEventListener('stateremoved', event => {
        this.props.onStateRemoved(event);
      });
    }
  };

  render() {
    const mixinProp = this.props.mixin ? {mixin: this.props.mixin} : {}

    return (
      <a-entity ref={this.attachEvents}
                {...mixinProp}
                {...serializeComponents(this.props)}>
        {this.props.children}
      </a-entity>
    );
  }
}

export class Scene extends React.Component {
  static propTypes = {
    onEnterVR: React.PropTypes.func,
    onExitVR: React.PropTypes.func,
    onLoaded: React.PropTypes.func
  };

  static defaultProps = {
    onEnterVR: () => {},
    onExitVR: () => {},
    onLoaded: () => {}
  };

  attachEvents = el => {
    if (el) {
      el.addEventListener('enter-vr', event => {
        this.props.onEnterVR(event);
      });
      el.addEventListener('exit-vr', event => {
        this.props.onExitVR(event);
      });
      el.addEventListener('loaded', event => {
        this.props.onLoaded(event);
      });
    }
  };

  render() {
    return (
      <a-scene ref={this.attachEvents} {...serializeComponents(this.props)}>
        {this.props.children}
      </a-scene>
    );
  }
}
