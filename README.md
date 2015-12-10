## aframe-react

Combining [A-Frame VR](https://aframe.io) with React.

`aframe-react` is the core library. Check out the
[aframe-react-boilerplate](https://github.com/ngokevin/aframe-react-boilerplate)
for more guidance on usage.

### Usage

`aframe-react` can be installed through `npm`.

```bash
npm install aframe-react
```

`aframe-react` does not come with the `aframe-core` library. We will have to
require that alongside `aframe-react`. Again, check out the boilerplate to see
how to get everything set up with Webpack.

```js
require('@mozvr/aframe-core');
import {Animation, Entity, Scene} from 'aframe-react';

class ExampleScene extends React.Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material="color: red" position="0 0 -5">
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
        </Entity>
      </Scene>
    );
  }
}
```

### Terminology

Be aware of the difference between React components and A-Frame components.

A-Frame components refers to components of the entity-component system.

### Components

`aframe-react` ships only with components that are considered core to A-Frame.

#### \<Scene/>

The `Scene` React component is a thin wrapper around `<a-scene>`. The scene
holds all of the entities.

```html
<Scene>
  <Entity/>
</Scene>
```

#### \<Entity {...components}\/>

The `Entity` React component is a wrapper around `<a-entity>`. Entities are
general purpose objects in the scene (e.g., tree, player, light, sky) that are
modified with components. `Entity` handles serialization of A-Frame components.
A-Frame components can then be passed via props either via object or string.

```html
<Entity geometry={{primitive: 'box'}} material='color: red'/>
```

Check out the [A-Frame docs](https://aframe.io) for A-Frame component usage.

#### \<Animation {...attributes}\/>

The `Animation` React component is a thin wrapper around `<a-animation>`.

```html
<Animation attribute="rotation" dur="10000" repeat="indefinite" to="0 360 360"/>
```

Check out the [A-Frame docs](https://aframe.io) for A-Frame animation usage.

