import components from 'aframe-core';

import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';

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
    el.addEventListener('animationend', event => {
      this.props.onAnimationEnd(event);
    });
    el.addEventListener('animationstart', event => {
      this.props.onAnimationStart(event);
    });
  }

  render() {
    return (
      <a-animation ref={this.attachEvents} {...this.props}></a-animation>
    );
  }
}

/**
 * Allow creating named entities like <Light/> while still maintaining composability.
 * Like <Light type="directional" geometry="sphere"/>.
 * TODO: Handle possible namespace clashes (e.g., support *-component="").
 *
 * @param {string} primaryComponent - Component to proxy attributes found in the schema into.
 */
export class NamedEntity extends React.Component {
  static propTypes = {
    mainComponent: React.PropTypes.string
  };

  render() {
    const componentProperties = Object.keys(components[this.props.mainComponent].schema);
    const mainComponentData = {
      [this.props.mainComponent]: {}
    };
    const otherComponentData = {};

    Object.keys(this.props).forEach(propName => {
      if (propName in componentProperties) {
        mainComponentData[this.props.mainComponent][property] = this.props[property];
      } else {
        otherComponentData[property] = this.props[property];
      }
    });

    return (
      <Entity {...mainComponentData} {...otherComponentData}/>
    );
  }
}

export class Entity extends React.Component {
  static propTypes = {
    children: React.PropTypes.array,
    mixin: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onLoaded: React.PropTypes.func
  };

  static defaultProps = {
    onClick: () => {},
    onLoaded: () => {}
  };

  attachEvents = el => {
    el.addEventListener('click', event => {
      this.props.onClick(event);
    });
    el.addEventListener('loaded', event => {
      this.props.onLoaded(event);
    });
  }

  /**
   * Stringify components passed as an object.
   *
   * {primitive: box; width: 10} to 'primitive: box; width: 10'
   */
  serializeComponents() {
    let props = {};
    Object.keys(this.props).forEach(component => {
      if (['children', 'mixin'].indexOf(component) !== -1) { return; }

      if (this.props[component].constructor === Function) { return; }

      if (this.props[component].constructor === Object) {
        // Stringify components passed as object.
        props[component] = styleParser.stringify(this.props[component]);
      } else {
        // Do nothing for components otherwise.
        props[component] = this.props[component];
      }
    });
    return props;
  }

  render() {
    const mixinProp = this.props.mixin ? {mixin: this.props.mixin} : {}

    return (
      <a-entity ref={this.attachEvents}
                {...mixinProp}
                {...this.serializeComponents()}>
        {this.props.children}
      </a-entity>
    );
  }
}

export class Scene extends React.Component {
  static propTypes = {
    onLoaded: React.PropTypes.func,
    onTick: React.PropTypes.func
  };

  static defaultProps = {
    onLoaded: () => {}
  };

  attachEvents = el => {
    el.addEventListener('loaded', event => {
      this.props.onLoaded(event);
    });
    if (this.props.onTick) {
      el.addBehavior({
        update: this.props.onTick
      });
    }
  }

  render() {
    return (
      <a-scene ref={this.attachEvents}>
        {this.props.children}
      </a-scene>
    );
  }
}
