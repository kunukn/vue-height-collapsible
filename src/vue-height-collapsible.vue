
<template>
  <component
    :is="tag"
    ref="root"
    data-height-collapsible
    :data-collapse-state="collapseState"
  >
    <slot :state="collapseState" />
  </component>
</template>

<script>
let COLLAPSED = "collapsed";
let COLLAPSING = "collapsing";
let EXPANDING = "expanding";
let EXPANDED = "expanded";
let collapseHeight = "0px";

let nextFrame = (callback) =>
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });

export default {
  name: "HeightCollapsible",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
    overflowOnExpanded: {
      type: Boolean,
      required: false,
      default: false,
    },
    tag: {
      type: String,
      required: false,
      default: "div",
    },
    transition: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      collapseState: this.isOpen ? EXPANDED : COLLAPSED,
    };
  },
  watch: {
    isOpen(current, previous) {
      if (current && !previous) {
        this.setExpanding();
      }

      if (!current && previous) {
        this.setCollapsing();
      }
    },
    transition(current) {
      if (this.$refs.root) {
        this.$refs.root.style.transition = current;
      }
    },
  },
  mounted() {
    if (this.isOpen) this.setExpanded();
    else this.setCollapsed();

    if (this.transition) {
      this.$refs.root.style.transition = this.transition;
    }
    this.$refs.root.addEventListener("transitionend", this.onTransitionEnd);
  },

  beforeDestroy() {
    this.$refs.root &&
      this.$refs.root.removeEventListener(
        "transitionend",
        this.onTransitionEnd
      );
  },

  methods: {
    setCollapsed() {
      if (!this.$refs.root) return;

      this.$emit("update", { state: COLLAPSED, height: collapseHeight });

      this.collapseState = COLLAPSED;

      let el = this.$refs.root;
      el.style.overflowY = this.getOverflow();
      el.style.height = collapseHeight;
      el.style.visibility = "hidden"; // inert
    },
    setExpanded() {
      if (!this.$refs.root) return;

      this.$emit("update", {
        state: EXPANDED,
        height: this.getElementHeight(),
      });
      this.collapseState = EXPANDED;

      let el = this.$refs.root;
      el.style.overflowY = this.getOverflow();
      el.style.height = "";
      el.style.visibility = "";
    },
    setCollapsing() {
      if (!this.$refs.root) return;

      this.collapseState = COLLAPSING;

      let height = this.getElementHeight();

      this.$emit("update", { state: COLLAPSING, height });
      let el = this.$refs.root;
      el.style.overflowY = this.getOverflow();
      el.style.height = height;
      el.style.visibility = "";

      nextFrame(() => {
        if (!this.$refs.root) return;
        if (this.collapseState !== COLLAPSING) return;

        let el = this.$refs.root;
        el.style.height = collapseHeight;
      });
    },
    setExpanding() {
      if (!this.$refs.root) return;

      this.$emit("update", { state: EXPANDING, height: "" });
      this.collapseState = EXPANDING;

      nextFrame(() => {
        if (!this.$refs.root) return;
        if (this.collapseState !== EXPANDING) return;

        let el = this.$refs.root;
        el.style.overflowY = this.getOverflow();
        el.style.height = this.getElementHeight();
        el.style.visibility = "";
      });
    },
    getElementHeight() {
      return `${this.$refs.root.scrollHeight}px`;
    },
    getOverflow() {
      return this.collapseState === EXPANDED && this.overflowOnExpanded
        ? ""
        : "hidden";
    },
    onTransitionEnd(event) {
      if (event.propertyName === "height" && event.target === this.$refs.root) {
        if (this.getElementHeight() === this.$refs.root.style.height) {
          if (this.collapseState === EXPANDING) this.setExpanded();
        } else {
          if (this.collapseState === COLLAPSING) this.setCollapsed();
        }
      }
    },
  },
};
</script>


<style>
[data-height-collapsible] {
  transition: height 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
