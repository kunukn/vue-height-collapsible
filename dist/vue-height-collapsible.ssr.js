'use strict';var Vue=require('vue');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var Vue__default=/*#__PURE__*/_interopDefaultLegacy(Vue);function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var COLLAPSED = "collapsed";
var COLLAPSING = "collapsing";
var EXPANDING = "expanding";
var EXPANDED = "expanded";
var collapseHeight = "0px";

var nextFrame = function nextFrame(callback) {
  return requestAnimationFrame(function () {
    requestAnimationFrame(callback);
  });
};
var script = /*#__PURE__*/Vue__default['default'].extend({
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
  data: function data() {
    return {
      collapseState: this.isOpen ? EXPANDED : COLLAPSED
    };
  },
  watch: {
    isOpen: function isOpen(current, previous) {
      if (current && !previous) {
        this.setExpanding();
      }

      if (!current && previous) {
        this.setCollapsing();
      }
    },
    transition: function transition(current) {
      if (this.$refs.root) {
        this.$refs.root.style.transition = current;
      }
    }
  },
  mounted: function mounted() {
    if (this.isOpen) this.setExpanded();else this.setCollapsed();

    if (this.transition) {
      this.$refs.root.style.transition = this.transition;
    }

    this.$refs.root.addEventListener("transitionend", this.onTransitionEnd);
  },
  beforeDestroy: function beforeDestroy() {
    this.$refs.root && this.$refs.root.removeEventListener("transitionend", this.onTransitionEnd);
  },
  methods: {
    setCollapsed: function setCollapsed() {
      if (!this.$refs.root) return;
      this.$emit("update", {
        state: COLLAPSED,
        height: collapseHeight
      });
      this.collapseState = COLLAPSED;
      var el = this.$refs.root;
      el.style.overflow = this.getOverflow();
      el.style.height = collapseHeight;
      el.style.visibility = "hidden"; // inert
    },
    setExpanded: function setExpanded() {
      if (!this.$refs.root) return;
      this.$emit("update", {
        state: EXPANDED,
        height: this.getElementHeight()
      });
      this.collapseState = EXPANDED;
      var el = this.$refs.root;
      el.style.overflow = this.getOverflow();
      el.style.height = "";
      el.style.visibility = "";
    },
    setCollapsing: function setCollapsing() {
      var _this = this;

      if (!this.$refs.root) return;
      this.collapseState = COLLAPSING;
      var height = this.getElementHeight();
      this.$emit("update", {
        state: COLLAPSING,
        height: height
      });
      var el = this.$refs.root;
      el.style.overflow = this.getOverflow();
      el.style.height = height;
      el.style.visibility = "";
      nextFrame(function () {
        if (!_this.$refs.root) return;
        if (_this.collapseState !== COLLAPSING) return;
        var el = _this.$refs.root;
        el.style.height = collapseHeight;
      });
    },
    setExpanding: function setExpanding() {
      var _this2 = this;

      if (!this.$refs.root) return;
      this.$emit("update", {
        state: EXPANDING,
        height: ""
      });
      this.collapseState = EXPANDING;
      nextFrame(function () {
        if (!_this2.$refs.root) return;
        if (_this2.collapseState !== EXPANDING) return;
        var el = _this2.$refs.root;
        el.style.overflow = _this2.getOverflow();
        el.style.height = _this2.getElementHeight();
        el.style.visibility = "";
      });
    },
    getElementHeight: function getElementHeight() {
      return "".concat(this.$refs.root.scrollHeight, "px");
    },
    getOverflow: function getOverflow() {
      return this.collapseState === EXPANDED && this.overflowOnExpanded ? "" : "hidden";
    },
    onTransitionEnd: function onTransitionEnd(event) {
      if (event.propertyName === "height" && event.target === this.$refs.root) {
        if (this.getElementHeight() === this.$refs.root.style.height) {
          this.setExpanded();
        } else {
          this.setCollapsed();
        }
      }
    }
  }
});function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-2945211f_0", {
    source: "[data-vue-height-collapsible]{transition:height 280ms cubic-bezier(.4,0,.2,1)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-2945211f";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var component = /*#__PURE__*/(function () {
  // Assign InstallableComponent type
  var installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component('VueHeightCollapsible', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default': component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;