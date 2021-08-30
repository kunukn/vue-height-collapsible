import { openBlock, createBlock, resolveDynamicComponent, withCtx, renderSlot } from 'vue';

let COLLAPSED = "collapsed";
let COLLAPSING = "collapsing";
let EXPANDING = "expanding";
let EXPANDED = "expanded";
let UNKNOWN = "unknown";
let collapseHeight = "0px";

let nextFrame = callback => requestAnimationFrame(() => {
  requestAnimationFrame(callback);
});

var script = {
  name: "HeightCollapsible",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: true
    },
    overflowOnExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    tag: {
      type: String,
      required: false,
      default: "div"
    },
    transition: {
      type: String,
      required: false,
      default: ""
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
        this.$emit("update", {
          error: "not mounted",
          state: UNKNOWN
        });
        return;
      }

      if (current && !previous) this.setExpanding();
      if (!current && previous) this.setCollapsing();
    },

    transition(current) {
      if (this.$refs.root) this.$refs.root.style.transition = current;
    }

  },

  mounted() {
    if (this.isOpen) this.setExpanded();else this.setCollapsed();

    if (this.transition) {
      this.$refs.root.style.transition = this.transition;
    }

    this.$refs.root.addEventListener("transitionend", this.onTransitionEnd);
    this.isMounted = true;
  },

  beforeUnmount() {
    this.$refs.root.removeEventListener("transitionend", this.onTransitionEnd);
  },

  methods: {
    setCollapsed() {
      if (!this.$refs.root) return;
      this.collapseState = COLLAPSED;
      let el = this.$refs.root;
      el.style.overflowY = this.getOverflow();
      el.style.height = collapseHeight;
      el.style.visibility = "hidden"; // inert

      this.$emit("update", {
        state: COLLAPSED,
        height: collapseHeight
      });
    },

    setExpanded() {
      if (!this.$refs.root) return;
      this.collapseState = EXPANDED;
      let el = this.$refs.root;
      el.style.overflowY = this.getOverflow();
      el.style.height = "";
      el.style.visibility = "";
      this.$emit("update", {
        state: EXPANDED,
        height: this.getElementHeight()
      });
    },

    setCollapsing() {
      if (!this.$refs.root) return;
      this.collapseState = COLLAPSING;
      let height = this.getElementHeight();
      let el = this.$refs.root;
      el.style.overflowY = this.getOverflow();
      el.style.height = height;
      el.style.visibility = "";
      this.$emit("update", {
        state: COLLAPSING,
        height
      });
      nextFrame(() => {
        if (!this.$refs.root) return;
        if (this.collapseState !== COLLAPSING) return;
        let el = this.$refs.root;
        el.style.height = collapseHeight;
      });
    },

    setExpanding() {
      if (!this.$refs.root) return;
      this.$emit("update", {
        state: EXPANDING,
        height: ""
      });
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
      return this.collapseState === EXPANDED && this.overflowOnExpanded ? "" : "hidden";
    },

    onTransitionEnd(event) {
      if (event.propertyName === "height" && event.target === this.$refs.root) {
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

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n[data-height-collapsible] {\n  transition: height 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n";
styleInject(css_248z);

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
