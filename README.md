<h1 align="center">aframe-react</h1>

<h5 align="center">
  Build virtual reality experiences with <b><a href="https://aframe.io">A-Frame</a></b> and <b><a href="https://facebook.github.io/react/">React</a></b>.
</h5>

<div align="center">
  <a href="https://npmjs.org/package/aframe-react">
    <img src="https://img.shields.io/npm/v/aframe-react.svg?style="flat-square" alt="npm" />
  </a>
  <a href="https://npmjs.org/package/aframe-react">
    <img src="https://img.shields.io/npm/dt/aframe-react.svg?style="flat-square" alt="npm" />
  </a>
  <a href="http://travis-ci.org/ngokevin/aframe-react">
    <img src="https://secure.travis-ci.org/ngokevin/aframe-react.svg?branch=master" alt="Travis CI" />
  </a>
</div>

<br/>
<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/674727/19173367/d6590832-8bdb-11e6-9336-658b00bc0460.png" height="320">
</div>
<br/>

## Installation

Install with [npm](https://www.npmjs.com/package/aframe-react) or
[yarn](https://github.com/yarnpkg/yarn).

```
npm install --save aframe aframe-react react react-dom
yarn add --save aframe aframe-react react react-dom
```

## Example

```js
import 'aframe';
import 'aframe-particle-system-component';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class VRScene extends React.Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 0, y: 0, z: -5}}/>
        <Entity particle-system={{preset: 'snow'}}/>
        <Entity light={{type: 'point'}}/>
        <Entity gltf-model={{src: 'virtualcity.gltf'}}/>
        <Entity text={{value: 'Hello, WebVR!'}}>
      </Scene>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));
```

See [aframe-react-boilerplate](https://github.com/ngokevin/aframe-react-boilerplate)
for a basic example.

## Introduction

![A-Frame](https://cloud.githubusercontent.com/assets/674727/24384472/e833ccee-1318-11e7-81a5-61e782f5b472.png)

[A-Frame](https://aframe.io) is a web framework for building virtual reality
experiences. Since A-Frame is built on top of the DOM, web libraries such as
React, Vue.js, Angular, Ember.js, d3.js are able to sit cleanly on top of
A-Frame.

A-Frame is an [entity-component-system (ECS) framework exposed through
HTML](https://aframe.io/docs/). ECS is a pattern used in game development that
favors composability over inheritance, which is more naturally suited to 3D
scenes where objects are built of complex appearance, behavior, and
functionality.

In A-Frame, HTML attributes map to *components* which are composable modules
that are plugged into **<a-entity>**s to attach appearance, behavior, and
functionality. `aframe-react` is a very thin layer on top of A-Frame to bridge
with React. `aframe-react` passes React props to directly A-Frame using refs
and `.setAttribute()`, bypassing the DOM. This works since A-Frame's
`.setAttribute()`s are able to take non-string data such as objects, arrays, or
elements and synchronously modify underlying 3D scene graph.

```js
// aframe-react's <Entity/> React Component
<Entity geometry={{primitive: 'box', width: 5}} position="0 0 -5"/>

// renders
<a-entity>

// and then applies the data directly to the underlying 3D scene graph, bypassing the DOM.
<a-entity>.setAttribute('geometry', {primitive: 'box', width: 5});
<a-entity>.setAttribute('position', '0 0 -5');
```

## Why A-Frame with React?

React was built for large web apps to improve DOM performance. It wasn't meant
for development of 3D scenes by itself. By attempting to wrap React directly
over three.js or WebGL, you run into a lot of performance issues.

#### Hooks into the Render Loop

Without a framework focused around 3D and VR, there is **no structure to hook
into the render loop**. React implementations generally just create a new
`requestAnimationFrame` within the React components, which is very bad for
performance. Because React only wants data to flow down with no child-to-parent
communication, entities have a hard time communicating to the scene to hook new
behaviors into the render loop.

A-Frame, however, provides a `tick` method for components to hook into the
scene render loop, and these components can be attached to any entity. Here
is an example of using A-Frame to provide these facilities across multiple
React components. Note how we can write a component that can be applied to
different objects.

```js
AFRAME.registerComponent('rotate-on-tick', {
  tick: function (t, dt) {
    this.el.object3D.rotation.x += .001;
  }
});

<Scene>
  <Box rotate-on-tick/>  <!-- <Entity geometry="primitive: box" rotate-on-tick/> -->
  <Sphere rotate-on-tick/> <!-- <Entity geometry="primitive: sphere" rotate-on-tick/> -->
</Scene>
```

#### Provides a DOM

By providing a DOM, it gives React the purpose it was meant for, to provide
quicker DOM updates. Although ideally, we use A-Frame directly since there may
be performance quirks with React batching its updates which we don't want in
90fps+ real-time rendering.

#### Composability

A-Frame provides composability over inheritance.  React is based around
inheritance: to create a new type of object, we extend an existing one. In game
development where objects are more complex, it is more appropriate to compose
behavior in order to more easily build new types of objects.

#### Community and Ecosystem

Lastly, A-Frame is backed by a large community and ecosystem of tools and
components. Don't be limited by what an assorted library provides when an
extensible framework can provide much more. There's even a [Redux
component](https://github.com/ngokevin/kframe/tree/master/components/redux) for
binding to A-Frame without using `react-redux`.

`tl;dr`: Wrapping React directly around three.js/WebGL cuts corners and suffers
as a result. A-Frame provides a proper bridge.

## API

`aframe-react`'s API is very thin on top of A-Frame, less than 200 lines of
source code. The API consists of just two React Components: `<Entity/>` and
`<Scene/>`.

#### \<Entity {...components}/>

`<Entity/>` wraps
[`<a-entity>`](https://aframe.io/docs/0.5.0/core/entity.html), the *entity*
piece of the [entity-component-system
pattern](https://aframe.io/docs/0.5.0/core/). Plug in [A-Frame
components](https://aframe.io/docs/0.5.0/introduction/#entity-component-system)
as React props to attach appearance, behavior, or functionality to the
`<Entity/>`.

```html
<Scene>
  <Entity
    geometry={{primitive: 'box', width: 5}}
    material={{color: red, roughness: 0.5, src: texture.png}}
    scale={{x: 2, y: 2, z: 2}}
    position={{x: 0, y: 0, z: -5}}/>
</Scene>
```

[Community A-Frame components](https://aframe.io/registry/) can be imported and
installed through npm:

```
import 'aframe-particle-system-component';
import 'aframe-mountain-component';

// ...

<Scene>
  <Entity mountain/>
  <Entity particle-system={{preset: 'snow', particleCount: 5000}}/>
</Scene>
```

#### `primitive`

To use A-Frame [primitives](https://aframe.io/docs/0.5.0/primitives/), provide
the `primitive` prop with the primitive's element name (e.g., `a-sphere`).
Mappings can be applied the same as in HTML through React props:

```html
<Entity primitive='a-box' color="red" position="0 0 -5"/>
<Entity primitive='a-sphere' color="green" position="-2 0 -3"/>
<Entity primitive='a-cylinder' color="blue" position="2 0 -3"/>
<Entity primitive='a-sky' src="sechelt.jpg"/>
```

#### `events`

To register event handlers, use the `events` prop. `events` takes a mapping of
event names to event handler(s). Multiple event handlers can be provided for a
single event name by providing an array of functions. Try not to pass in inline
functions to not trigger unnecessary React renders. Pass in binded functions
instead.

For example, using the synthetic `click` event provided by A-Frame's `cursor`
component, or a `collided` event possibly provided by a physics component.

```html
handleClick = () => {
  console.log('Clicked!');
}

handleCollide = () => {
  console.log('Collided!');
}

render() {
  return (
    <Scene>
      <Entity events={{
        click: this.handleClick
        collided: [this.handleCollide]/>
    </Scene>
  );
}}/>
```

`aframe-react` does not support React-style `onXXX` event handlers (e.g.,
`onClick`). Unlike 2D web pags, VR sites are composed entirely of custom
synthetic event names (which could have hyphens, be all lowercase, be
camelCase, all uppercase, camel case, etc.,). The possible event names are
infinite. The `events` prop makes it explicit what the event names to handle
are.

#### \<Scene {...components}/>

`<Scene/>` extends `<Entity/>` and renders `<a-scene>` instead of `<a-entity>`.
Place all `<Entity/>`s as a child of the `<Scene/>` Component. There should
only be one `<Scene/>` per page:

```html
<Scene>
  <Entity/>
</Scene>
```

## Best Practices

aframe-react lets A-Frame and three.js handle the heavy lifting 3D, VR,
rendering, and behavior pieces. React is delegated to what it was primarily
meant for: views and state binding.

For instance, if you wanted to do an animation, do not try to tween a property
in React land. This is slower due to creating another `requestAnimationFrame`,
being at the whims of React batched updates, and also due to the overhead of
passing a property from React to HTML. A-Frame already has a render loop and
`requestAnimationFrame` set up, write an A-Frame component using the `tick`
method to hook into the render loop.

Try to use React sparingly in regards to the actual 3D and VR bits. React has a
bit of overhead and some concerns with the batched updates since it was created
with the 2D DOM in mind. Do use it for as a view layer and to manage state.

## Built with `aframe-react`

<a href="http://360syria.com">
<img width="320" alt="Fear of the Sky by Amnesty International UK" src="https://cloud.githubusercontent.com/assets/674727/19344336/a5830bbe-90ee-11e6-9f68-2c23a9be4e95.png">
</a>
