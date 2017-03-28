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
  <a href="https://npmjs.com/package/aframe-react">
    <img src="https://img.shields.io/npm/l/aframe-react.svg?style=flat-square" alt="License"></a>
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

## The Viability of React for VR

**Without A-Frame and aframe-react, React would not be a viable library to use
in VR applications.** The value proposition of React is limited to the 2D Web:

- Improve rendering performance for 2D web pages by reducing calls to the
  browser's 2D layout engine via the virtual DOM.
- Provide an predictable application structure for large 2D web applications through
  a structured nesting of React components, data binding, and one-way data flow.

However, these propositions fall short in 3D and VR applications:

- In 3D and VR applications, including A-Frame, the 2D browser layout engine is
  not touched. Thus React's reconciliation engine can become an unpredictable
  performance liability for no benefit.
- In 3D and VR applications, objects are not structured in a top-down hierarchy like
  2D web applications. 3D objects can exist anywhere and interact with any other 3D object
  in a many-to-many manner. But React's paradigm prescribes data flow from parent-to-child,
  which makes it restrictive for 3D and VR applications.

Thinly wrapping React directly around a 3D library, say three.js, would not
provide a useful abstraction. However, A-Frame and aframe-react gives meaning
and purpose to React: **A-Frame provides an actual DOM for React to reconcile,
diff, and bind to**.

React also raises questions around performance; React is a very large library
designed for a 60fps 2D Web, is it equipped to handle 90fps VR applications?
90 prop updates per second per object through React's reconciliation engine
most likely would not work.

aframe-react lets A-Frame handle the heavy lifting 3D and VR rendering and
behavior. A-Frame is optimized from the ground up for WebVR with a 3D-oriented
entity-component architecture. And **aframe-react lets React do what it's good
at and no more: views, state management, and data binding.**

### Entity-Component Meets React

A-Frame's entity-component-system (ECS) pattern is tailored for 3D and VR
applications. What React did for 2D web applications is what ECS did for 3D
applications in terms of providing a useful abstraction. ECS promotes
composability over hierarchy and inheritance.

Unfortunately, React is all about hierarchy and inheritance, which is not
suited for 3D. Whereas 2D web development consisted of structuring and laying
out from an assorted set of fixed 2D elements (e.g., `<p>`, `<a>`, `<img>`,
`<form>`), 3D development involves objects that are infinite in complexity and
type. ECS provides an easy way of defining those objects by mixing and matching
plug-and-play components.

**With aframe-react, we get the best of both worlds.** The 3D and VR
architecture of A-Frame, and the view and state ergonomics of React. React can
be used to bind application and state data to the values of A-Frame components.
And we still have access to all the features and performance of A-Frame as well
as [A-Frame's community component ecosystem](https://aframe.io/registry/).

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
