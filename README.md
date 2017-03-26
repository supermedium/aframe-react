<h1 align="center">aframe-react</h1>

<h5 align="center">
  Build virtual reality experiences with <b><a href="https://aframe.io">A-Frame</a></b> and <b><a href="https://facebook.github.io/react/">React</a></b>.
</h5>

<div align="center">
  <a href="https://npmjs.org/package/aframe-react">
    <img src="https://img.shields.io/npm/v/aframe-react.svg?style="flat-square" alt="npm" />
  </a>
  <a href="https://npmjs.org/package/aframe-react">
    <img src="https://img.shields.io/npm/dm/aframe-react.svg?style="flat-square" alt="npm" />
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
```

See [aframe-react-boilerplate](https://github.com/ngokevin/aframe-react-boilerplate)
for a basic example.

## Installation

```
npm install --save aframe aframe-react react react-dom
```

## What `aframe-react` Does

[A-Frame](https://aframe.io) is a web framework for building virtual reality
experiences. Since A-Frame is built on top of the DOM, React is able to sit
cleanly on top of A-Frame.

If you are not familiar with the specifics of A-Frame, A-Frame is an
[entity-component-system (ECS) framework on HTML](https://aframe.io/docs/). ECS
is a pattern used in game development that favors composability over
inheritance, which is more naturally suited to 3D scenes where objects are
built of complex appearance, behavior, and functionality.

In A-Frame, HTML attributes map to *components* which are composable modules
that are plugged into **<a-entity>**s to attach appearance, behavior, and
functionality. `aframe-react` is a very thin layer on top of A-Frame to bridge
with React. `aframe-react` takes React updates, bypasses the DOM, and directly
modifies the underlying A-Frame entities.

```js
// aframe-react's <Entity/> React Component
<Entity geometry={{primitive: 'box', width: 5}} position="0 0 -5"/>

// renders
<a-entity>

// and then applies the data directly to the underlying 3D scene graph, bypassing the DOM.
// A-Frame's `.setAttribute`s more or less directly modify the underlying 3D objects.
<a-entity>.setAttribute('geometry', {primitive: 'box', width: 5});
<a-entity>.setAttribute('position', '0 0 -5');
```

### Built with `aframe-react`

<a href="http://360syria.com">
<img width="320" alt="Fear of the Sky by Amnesty International UK" src="https://cloud.githubusercontent.com/assets/674727/19344336/a5830bbe-90ee-11e6-9f68-2c23a9be4e95.png">
</a>

### Best Practices

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

### Why A-Frame with React?

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

### API

`aframe-react` has a thin API of just two React Components: `<Entity/>` and
`<Scene/>`.

#### \<Scene {...components}/>

The `Scene` React component renders `<a-scene>`. Under the hood, `<Scene/>` is
the exact same React Component as `<Entity/>`, except it renders `<a-scene>` as
the DOM element.

```html
<Scene>
  <Entity/>
</Scene>
```

#### \<Entity {...components}/>

The `Entity` React component renders `<a-entity>`. Then we attach A-Frame
components as props. A-Frame component values can be passed either as objects
or strings. Either way, a direct `.setAttribute()` will be called on the
entity, bypassing DOM serialization for good performance.

```html
<Entity geometry={{primitive: 'box'}} material='color: red'/>
```

#### `primitive`

To use A-Frame [primitives](https://aframe.io/docs/0.5.0/primitives/), provide
the `primitive` prop with the primitive's element name (e.g., `a-sphere):

```html
<Entity primitive='a-box' color="red" position="0 0 -5"/>
<Entity primitive='a-sphere' color="green" position="-2 0 -3"/>
<Entity primitive='a-cylinder' color="blue" position="2 0 -3"/>
<Entity primitive='a-sky' src="sechelt.jpg"/>
```

#### `events`

To register an event handler, use the `events` prop. For example, using the
synthetic `click` event provided by A-Frame's `cursor` component, or a
`collided` event possibly provided by a physics component.

```html
<Entity events={{
  click: () => { console.log('Clicked!'); },
  collided: { console.log('Collided!'); }
}}/>
```

`aframe-react` currently does not support the React-style `onX` event handlers
(e.g., `onClick`). Unlike 2D web sites, VR sites are composed entirely of
custom event names (which could have hyphens, be all lowercase, be camelCase,
all uppercase, etc.,).  It is necessary to defining events through a single
object to be explicit.
