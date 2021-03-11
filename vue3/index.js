'use strict';var vue=require('vue');function _slicedToArray(arr, i) {
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
      el.style.overflowY = this.getOverflow();
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
      el.style.overflowY = this.getOverflow();
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
      el.style.overflowY = this.getOverflow();
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
        el.style.overflowY = _this2.getOverflow();
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
          if (this.collapseState === EXPANDING) this.setExpanded();
        } else {
          if (this.collapseState === COLLAPSING) this.setCollapsed();
        }
      }
    }
  }
};function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.tag), {
    ref: "root",
    "data-height-collapsible": "",
    "data-collapse-state": $data.collapseState
  }, {
    default: vue.withCtx(function () {
      return [vue.renderSlot(_ctx.$slots, "default", {
        state: $data.collapseState
      })];
    }),
    _: 3
  }, 8, ["data-collapse-state"]);
}function styleInject(css, ref) {
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
}var css_248z = "\n[data-height-collapsible] {\n  transition: height 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n";
styleInject(css_248z);script.render = render;// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = script; // Attach install function executed by Vue.use()

  installable.install = function (app) {
    app.component('VueCollapsible3', installable);
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