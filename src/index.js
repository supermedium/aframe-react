import React from 'react';
import styleParser from 'style-attr';

export class Animation extends React.Component {
  render() {
    return (
      <a-animation {...this.props}></a-animation>
    );
  }
}

export class Entity extends React.Component {
  serializeComponents() {
    let props = {};
    Object.keys(this.props).forEach(component => {
      if (component === 'children') { return; }

      if (this.props[component].constructor === Object) {
        // Stringify components passed as object.
        props[component] = styleParser.stringify(this.props[component]);
      } else {
        // Do nothing for components passed as string.
        props[component] = this.props[component];
      }
    });
    return props;
  }

  render() {
    const serializedProps = this.serializeComponents();

    return (
      <a-entity {...serializedProps}>{this.props.children}</a-entity>
    );
  }
}

export class Scene extends React.Component {
  render() {
    return (
      <a-scene>{this.props.children}</a-scene>
    );
  }
}
