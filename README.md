## aframe-react

Build virtual reality experiences with **[A-Frame](https://aframe.io)** with
[React](https://facebook.github.io/react/).

![aframe-react](https://cloud.githubusercontent.com/assets/674727/19173303/865a94ea-8bdb-11e6-9b4b-10c953f9f218.png)

A-Frame is a web framework for building virtual reality experiences on top of
the DOM. Since it's HTML, React naturally abstracts well on top of that.

```js
import 'aframe';
import 'aframe-bmfont-text-component';
import {Entity, Scene} from 'aframe-react';

class ExampleScene extends React.Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material="color: red" position={[0, 0, -5]}/>
        <Entity bmfont-text={{text: 'HELLO WORLD'}} position="{[0, 1, -5]}"/>
      </Scene>
    );
  }
}
```

A-Frame brings the [entity-component
pattern](https://aframe.io/docs/0.3.0/core/) to HTML. Each HTML attribute maps
to a *component* which are composable modules that plug in appearance,
behavior, and functionality to *entities*.

`aframe-react` itself is a very thin layer on top of A-Frame. It exposes an
`<Entity/>` React component that serializes JavaScript objects passed as React
props to A-Frame's default component syntax:

```js
<Entity geometry={{primitive: 'box', width: 5}}/>

<a-entity geometry="primitive: box; width: 5"></a-entity>
```

See [aframe-react-boilerplate](https://github.com/ngokevin/aframe-react-boilerplate)
for example usage.

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
    this.object3D.rotation.x += .001;
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

### Installation

`aframe-react` can be installed through `npm`.

```bash
npm install --save aframe-react
```

`aframe-react` does not come with the `aframe` library. We will have to require
that alongside `aframe-react`. Check out the boilerplate to see how to get
everything set up with Webpack.

### API

`aframe-react` ships with `Scene` and `Entity` React components, which are all
we really need.

#### \<Scene {...components}/>

The `Scene` React component wraps `<a-scene>`:

```html
<Scene>
  <Entity/>
</Scene>
```

#### \<Entity {...components}/>

The `Entity` React component wraps `<a-entity>`.

```html
<Entity geometry={{primitive: 'box'}} material='color: red'/>
```
