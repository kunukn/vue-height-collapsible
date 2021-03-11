# vue-height-collapsible

Collapsible component with CSS transition for elements with variable and dynamic height.

[![npm version](https://img.shields.io/npm/v/vue-height-collapsible.svg?style=flat-square)](https://www.npmjs.com/package/vue-height-collapsible)
[![gzip](https://img.shields.io/bundlephobia/minzip/vue-height-collapsible.svg)](https://bundlephobia.com/result?p=vue-height-collapsible)
[![license](https://img.shields.io/github/license/kunukn/vue-height-collapsible.svg)](https://github.com/kunukn/vue-height-collapsible/blob/master/LICENSE)

vue-height-collapsible

![logo](logo/collapsible.svg "logo")

```js
import HeightCollapsible from "vue-height-collapsible";

export default {
  name: "MyComponent",
  components: {
    HeightCollapsible,
  },
  data() {
    return {
      isOpen: true,
      collapseState: "",
    };
  },
  methods: {
    onUpdate({ state }) {
      this.collapseState = state;
    },
  },
};
```

```html
<template>
  <div class="my-component">
    <button @click="isOpen = !isOpen">
      <span>Toggle {{ collapseState }}</span>
    </button>
    <HeightCollapsible :isOpen="isOpen" @update="onUpdate">
      <p>Paragraph of text.</p>
      <p>Another paragraph is also OK.</p>
      <p>Images and any other content are ok too.</p>
    </HeightCollapsible>
  </div>
</template>
```

## Properties

| Prop               | Type    | Default |
| ------------------ | ------- | ------- |
| isOpen             | boolean | true    |
| transition         | string  |         |
| tag                | string  | div     |
| overflowOnExpanded | boolean | false   |

<br/>

#### `isOpen` : boolean

Expands or collapses content.

#### `transition` : string

You can also specify a CSS transition inline by using the `transition` prop.

```html
<HeightCollapsible
  transition="height 300ms cubic-bezier(.4, 0, .2, 1)"
  :isOpen="isOpen"
>
  <p>Paragraph of text</p>
</HeightCollapsible>
```

#### `tag` : string

You can specify the HTML element type for the collapse component. By default the element type is a `div` element.

```html
<HeightCollapsible tag="article" :isOpen="isOpen">
  <p>Paragraph of text</p>
</HeightCollapsible>
```

#### `overflowOnExpanded` : boolean

If added, then `overflow: hidden` inline style will not be added when the state is `expanded`.

<br>

# npm

https://www.npmjs.com/package/vue-height-collapsible
