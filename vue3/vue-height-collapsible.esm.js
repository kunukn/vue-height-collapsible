import { openBlock, createBlock, resolveDynamicComponent, withCtx, renderSlot } from 'vue';

let COLLAPSED = 'collapsed';
let COLLAPSING = 'collapsing';
let EXPANDING = 'expanding';
let EXPANDED = 'expanded';
let collapseHeight = '0px';

let nextFrame = callback => requestAnimationFrame(() => {
  requestAnimationFrame(callback);
});

var script = {
  name: 'HeightCollapsible',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: true
    },
    overflowOnExpanded: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'div'
    },
    transition: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      collapseState: this.isOpen ? EXPANDED : COLLAPSED,
      isMounted: false
    };
  },

  watch: {
    isOpen(current, previous) {
      if (!this.isMounted) {
        this.$emit('error', {
          type: 'isOpen',
          msg: 'not mounted yet'
        });
        return;
      }

      if (current && !previous) this.setExpanding();
      if (!current && previous) this.setCollapsing();
    },

    transition(current, previous) {
      if (current !== previous && this.$refs.root) {
        this.$refs.root.style.transition = current;
      }
    }

  },

  mounted() {
    if (this.isOpen) this.setExpanded();else this.setCollapsed();

    if (this.transition) {
      this.$refs.root.style.transition = this.transition;
    }

    this.$refs.root.addEventListener('transitionend', this.onTransitionEnd);
    this.isMounted = true;
  },

  beforeUnmount() {
    this.$refs.root.removeEventListener('transitionend', this.onTransitionEnd);
  },

  methods: {
    setCollapsed() {
      if (!this.$refs.root) return;
      this.collapseState = COLLAPSED;
      let style = this.$refs.root.style;
      style.overflowY = this.getOverflow();
      style.height = collapseHeight;
      style.visibility = 'hidden'; // inert

      this.$emit('update', {
        state: COLLAPSED,
        height: collapseHeight
      });
    },

    setExpanded() {
      if (!this.$refs.root) return;
      this.collapseState = EXPANDED;
      let style = this.$refs.root.style;
      style.overflowY = this.getOverflow();
      style.height = '';
      style.visibility = '';
      this.$emit('update', {
        state: EXPANDED,
        height: this.getElementHeight()
      });
    },

    setCollapsing() {
      if (!this.$refs.root) return;
      this.collapseState = COLLAPSING;
      let height = this.getElementHeight();
      let style = this.$refs.root.style;
      style.overflowY = this.getOverflow();
      style.height = height;
      style.visibility = '';
      this.$emit('update', {
        state: COLLAPSING,
        height
      });
      nextFrame(() => {
        if (!this.$refs.root) return;
        if (this.collapseState !== COLLAPSING) return;
        this.$refs.root.style.height = collapseHeight;
      });
    },

    setExpanding() {
      if (!this.$refs.root) return;
      this.$emit('update', {
        state: EXPANDING,
        height: ''
      });
      this.collapseState = EXPANDING;
      nextFrame(() => {
        if (!this.$refs.root) return;
        if (this.collapseState !== EXPANDING) return;
        let style = this.$refs.root.style;
        style.overflowY = this.getOverflow();
        style.height = this.getElementHeight();
        style.visibility = '';
      });
    },

    getElementHeight() {
      return `${this.$refs.root.scrollHeight}px`;
    },

    getOverflow() {
      return this.collapseState === EXPANDED && this.overflowOnExpanded ? '' : 'hidden';
    },

    onTransitionEnd(event) {
      if (event.propertyName === 'height' && event.target === this.$refs.root) {
        if (this.getElementHeight() === this.$refs.root.style.height) {
          if (this.collapseState === EXPANDING) this.setExpanded();
        } else {
          if (this.collapseState === COLLAPSING) this.setCollapsed();
        }
      }
    }

  }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    ref: "root",
    "data-height-collapsible": "",
    "data-collapse-state": $data.collapseState
  }, {
    default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
      state: $data.collapseState
    })]),
    _: 3
  }, 8, ["data-collapse-state"]);
}

script.render = render;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Assign InstallableComponent type
  const installable = script; // Attach install function executed by Vue.use()

  installable.install = app => {
    app.component('VueHeightCollapsible', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
