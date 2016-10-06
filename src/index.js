import React from 'react';
import ReactDOM from 'react-dom';
import styleParser from 'style-attr';

/**
 * Stringify components passed as an object.
 *
 * {primitive: box; width: 10} to 'primitive: box; width: 10'
 */
function serializeComponents (props) {
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

export class Entity extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
    mixin: React.PropTypes.string
  };

  render() {
    const mixinProp = this.props.mixin ? {mixin: this.props.mixin} : {}

    return (
      <a-entity {...mixinProp}
                {...serializeComponents(this.props)}>
        {this.props.children}
      </a-entity>
    );
  }
}

export class Scene extends React.Component {
  render() {
    return (
      <a-scene {...serializeComponents(this.props)}>
        {this.props.children}
      </a-scene>
    );
  }
}
