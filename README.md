## aframe-react

Bridging [A-Frame](https://aframe.io) with [React](https://facebook.github.io/react/).

`aframe-react` is a thin layer on top of A-Frame, which is an
[entity-component-system-based](https://aframe.io/docs/0.2.0/core/) layer on
top of [three.js](http://threejs.org). It serializes objects, passed as props,
to strings understandable by [A-Frame
components](https://aframe.io/docs/0.2.0/core/component/):

```js
<Entity geometry={{primitive: 'box', width: 5}}/>
// to:
<Entity geometry="primitive: box; width: 5"/>
```

See the [aframe-react-boilerplate](https://github.com/ngokevin/aframe-react-boilerplate)
for example usage.

### Installation

`aframe-react` can be installed through `npm`.

```bash
npm install --save aframe-react
```

`aframe-react` does not come with the `aframe` library. We will have to require
that alongside `aframe-react`. Check out the boilerplate to see how to get
everything set up with Webpack.

```js
import 'aframe';
import {Entity, Scene} from 'aframe-react';

class ExampleScene extends React.Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material="color: red" position={[0, 0, -5]}/>
      </Scene>
    );
  }
}
```

### API

`aframe-react` ships with a `Scene` React component and an `Entity` React
component, which are all we really need.

Note the difference between React components and A-Frame components. [A-Frame
components](https://aframe.io/docs/0.2.0/core/component.html) refers to
components of the entity-component-system pattern.

#### \<Scene {...components}/>

The `Scene` React component is a thin wrapper around `<a-scene>`. The scene
holds `<Entity/>`s:

```html
<Scene>
  <Entity/>
</Scene>
```

| Event | Description |
| ----- | ----------- |
| onLoaded | `onLoaded` handler is called once scene has loaded all entities. |

#### \<Entity {...components}/>

The `Entity` React component is a wrapper around `<a-entity>`. `Entity` handles
serialization of A-Frame components. A-Frame components can then be passed via
props either via object or string.

```html
<Entity geometry={{primitive: 'box'}} material='color: red'/>
```

**Events**

| Event    | Description                                         |
| -----    | -----------                                         |
| onLoaded | `onLoaded` handler is called when entity is loaded. |

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
