import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';

/**
 * Stringify components passed as an object.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */
function serializeComponents(props) {
  let serialProps = {};
  Object.keys(props).forEach(component => {
    if (['children', 'mixin'].indexOf(component) !== -1) { return; }

    if (props[component].constructor === Function) { return; }

    if (props[component].constructor === Array) {
      //Stringify components passed as array.
      serialProps[component] = props[component].join(' ');
    } else if (props[component].constructor === Object) {
      // Stringify components passed as object.
      serialProps[component] = styleParser.stringify(props[component]);
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
  };

  static defaultProps = {
    onClick: () => {},
    onLoaded: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  attachEvents = el => {
    if (el) {
      el.addEventListener('click', event => {
        this.props.onClick(event);
      });
      el.addEventListener('loaded', event => {
        this.props.onLoaded(event);
      });
      el.addEventListener('mouseenter', event => {
        this.props.onMouseEnter(event);
      });
      el.addEventListener('mouseleave', event => {
        this.props.onMouseLeave(event);
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
    onLoaded: React.PropTypes.func,
    onTick: React.PropTypes.func
  };

  static defaultProps = {
    onLoaded: () => {}
  };

  attachEvents = el => {
    if (el) {
      el.addEventListener('loaded', event => {
        this.props.onLoaded(event);
      });
      if (this.props.onTick) {
        setTimeout(() => {
          el.addBehavior({
            update: this.props.onTick
          });
        });
      }
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
