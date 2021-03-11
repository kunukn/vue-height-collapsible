
<template>
  <div id="app">
    <div class="block">
      <button @click="isOpen = !isOpen" class="btn">
        <span>Toggle</span> <span>{{ isOpen }}</span>
        <span>{{ collapseState }}</span>
      </button>
      <HeightCollapsible :isOpen="isOpen" @update="onUpdate">
        <p class="text">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <p class="text">
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
          section 1.10.32. The standard chunk of Lorem Ipsum used since the
          1500s is reproduced below for those interested. Sections 1.10.32 and
          1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also
          reproduced in their exact original form, accompanied by English
          versions from the 1914 translation by H. Rackham.
        </p>
      </HeightCollapsible>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HeightCollapsible from "@/vue-height-collapsible.vue";

export default Vue.extend({
  name: "ServeDev",
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
    onUpdate(payload: any) {
      this.collapseState = payload.state;
    },
  },
});
</script>

<style>
@import url(https://unpkg.com/ress/dist/ress.min.css);

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-family: sans-serif;
}

#app {
  max-width: 800px;
  margin: 0 auto;
}

.block {
  padding: 1rem;
  background: #fafafa;
}

.btn {
  font-size: 100%;

  margin-bottom: 1rem;
  display: block;
  width: 100%;
  border: 1px solid;
  padding: 1rem;
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.btn span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  text-align: left;
}

.btn span:nth-child(2) {
  min-width: 50px;
  background: black;
  color: white;
}

.btn span:nth-child(3) {
  min-width: 100px;
  background: rebeccapurple;
  color: white;
}

.text {
  line-height: 1.5;
}

.text + .text {
  margin-top: 2rem;
}
</style>
