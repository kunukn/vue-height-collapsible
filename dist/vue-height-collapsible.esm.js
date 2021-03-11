import Vue from 'vue';

let COLLAPSED = "collapsed";
let COLLAPSING = "collapsing";
let EXPANDING = "expanding";
let EXPANDED = "expanded";
let collapseHeight = "0px";

let nextFrame = callback => requestAnimationFrame(() => {
  requestAnimationFrame(callback);
});
var script = /*#__PURE__*/Vue.extend({
  name: "VueHeightCollapsible",
  // vue component name
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
      collapseState: this.isOpen ? EXPANDED : COLLAPSED
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
    }

  },

  mounted() {
    if (this.isOpen) this.setExpanded();else this.setCollapsed();

    if (this.transition) {
      this.$refs.root.style.transition = this.transition;
    }

    this.$refs.root.addEventListener("transitionend", this.onTransitionEnd);
  },

  beforeDestroy() {
    this.$refs.root && this.$refs.root.removeEventListener("transitionend", this.onTransitionEnd);
  },

  methods: {
    setCollapsed() {
      if (!this.$refs.root) return;
      this.$emit("update", {
        state: COLLAPSED,
        height: collapseHeight
      });
      this.collapseState = COLLAPSED;
      let el = this.$refs.root;
      el.style.overflow = this.getOverflow();
      el.style.height = collapseHeight;
      el.style.visibility = "hidden"; // inert
    },

    setExpanded() {
      if (!this.$refs.root) return;
      this.$emit("update", {
        state: EXPANDED,
        height: this.getElementHeight()
      });
      this.collapseState = EXPANDED;
      let el = this.$refs.root;
      el.style.overflow = this.getOverflow();
      el.style.height = "";
      el.style.visibility = "";
    },

    setCollapsing() {
      if (!this.$refs.root) return;
      this.collapseState = COLLAPSING;
      let height = this.getElementHeight();
      this.$emit("update", {
        state: COLLAPSING,
        height
      });
      let el = this.$refs.root;
      el.style.overflow = this.getOverflow();
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
      this.$emit("update", {
        state: EXPANDING,
        height: ""
      });
      this.collapseState = EXPANDING;
      nextFrame(() => {
        if (!this.$refs.root) return;
        if (this.collapseState !== EXPANDING) return;
        let el = this.$refs.root;
        el.style.overflow = this.getOverflow();
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
          this.setExpanded();
        } else {
          this.setCollapsed();
        }
      }
    }

  }
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, {
    ref: "root",
    tag: "component",
    attrs: {
      "data-vue-height-collapsible": "",
      "data-collapse-state": _vm.collapseState
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-2945211f_0", {
    source: "[data-vue-height-collapsible]{transition:height 280ms cubic-bezier(.4,0,.2,1)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var entry_esm = /*#__PURE__*/(() => {
  // Assign InstallableComponent type
  const installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('VueHeightCollapsible', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export default entry_esm;
