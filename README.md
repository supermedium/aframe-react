## aframe-react

Bridging [A-Frame VR](https://aframe.io) with React. `aframe-react` is an extremely thin wrapper. Pretty much all that it does is serialize objects and arrays passed as props to an A-Frame component as A-Frame component strings:

```
geometry={{ primitive: 'box', width: 5 }}

to:

geometry="primitive: box; width: 5"

and position={[0, 0, -5]}

to:

position="0 0 -5"
```

`aframe-react` is the core library. Check out the
[aframe-react-boilerplate](https://github.com/ngokevin/aframe-react-boilerplate)
for example usage.

> How is this different from react-three?

`aframe-react` is an abstraction layer on top of A-Frame, and A-Frame is built
on top of an **entity-component system** on top of the DOM. `react-three` tries to
be a contained non-agnostic solution. Unfortunately, it doesn't fit well to
wrap React around pure three.js, there are performance limitations to having a
`requestAnimationFrame` for each object, and it is not as composable or
extendable.

React works better with A-Frame as A-Frame inherently utilizes the DOM.

### Usage

`aframe-react` can be installed through `npm`.

```bash
npm install aframe-react
```

`aframe-react` does not come with the `aframe-core` library. We will have to
require that alongside `aframe-react`. Again, check out the boilerplate to see
how to get everything set up with Webpack.

```js
require('aframe-core');
import {Animation, Entity, Scene} from 'aframe-react';

class ExampleScene extends React.Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material="color: red" position={[0, 0, -5]}>
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to={[0, 360, 360]}/>
        </Entity>
      </Scene>
    );
  }
}
```

### Terminology

Be aware of the difference between React components and A-Frame components.

A-Frame components refers to components of the entity-component system.

`aframe-react` preserves the entity-component system of A-Frame.

### Components

`aframe-react` ships only with components that are considered core to A-Frame.

#### \<Scene {...components}/>

The `Scene` React component is a thin wrapper around `<a-scene>`. The scene
holds all of the entities.

```html
<Scene>
  <Entity/>
</Scene>
```

| Event | Description |
| ----- | ----------- |
| onLoaded | `onLoaded` handler is called when scene has loaded all entities. |

#### \<Entity {...components}/>

The `Entity` React component is a wrapper around `<a-entity>`. Entities are
general purpose objects in the scene (e.g., tree, player, light, sky) that are
modified with components. `Entity` handles serialization of A-Frame components.
A-Frame components can then be passed via props either via object or string.

```html
<Entity geometry={{primitive: 'box'}} material='color: red'
        onClick={() => { console.log('clicked'); }}/>
```

**Events**

| Event | Description |
| ----- | ----------- |
| onClick | If using the cursor or raycaster, `onClick` handler is called when entity is clicked. |
| onMouseEnter | If using the cursor or raycaster, `onMouseEnter` handler is called when entity is collides with raycaster. |
| onMouseLeave | If using the cursor or raycaster, `onMouseLeave` handler is called when entity is stops colliding with raycaster. |
| onLoaded | `onLoaded` handler is called when entity is loaded. |

Check out the [A-Frame docs](https://aframe.io) for A-Frame component usage.

#### \<Animation {...attributes}/>

The `Animation` React component is a thin wrapper around `<a-animation>`.

```html
<Animation attribute="rotation" dur="10000" repeat="indefinite" to="0 360 360"/>
```

**Events**

| Event | Description |
| ----- | ----------- |
| onAnimationEnd | `onAnimationEnd` handler is called when animation ends. |
| onAnimationStart | `onAnimationStart` handler is called when animation starts. |

Check out the [A-Frame docs](https://aframe.io) for A-Frame animation usage.
