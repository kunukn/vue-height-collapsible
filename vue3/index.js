'use strict';var vue=require('vue');function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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
}var COLLAPSED = 'collapsed';
var COLLAPSING = 'collapsing';
var EXPANDING = 'expanding';
var EXPANDED = 'expanded';
var collapseHeight = '0px';

var nextFrame = function nextFrame(callback) {
  return requestAnimationFrame(function () {
    requestAnimationFrame(callback);
  });
};

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
  data: function data() {
    return {
      collapseState: this.isOpen ? EXPANDED : COLLAPSED,
      isMounted: false
    };
  },
  watch: {
    isOpen: function isOpen(current, previous) {
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
    transition: function transition(current, previous) {
      if (current !== previous && this.$refs.root) {
        this.$refs.root.style.transition = current;
      }
    }
  },
  mounted: function mounted() {
    if (this.isOpen) this.setExpanded();else this.setCollapsed();

    if (this.transition) {
      this.$refs.root.style.transition = this.transition;
    }

    this.$refs.root.addEventListener('transitionend', this.onTransitionEnd);
    this.isMounted = true;
  },
  beforeUnmount: function beforeUnmount() {
    this.$refs.root.removeEventListener('transitionend', this.onTransitionEnd);
  },
  methods: {
    setCollapsed: function setCollapsed() {
      if (!this.$refs.root) return;
      this.collapseState = COLLAPSED;
      var style = this.$refs.root.style;
      style.overflowY = this.getOverflow();
      style.height = collapseHeight;
      style.visibility = 'hidden'; // inert

      this.$emit('update', {
        state: COLLAPSED,
        height: collapseHeight
      });
    },
    setExpanded: function setExpanded() {
      if (!this.$refs.root) return;
      this.collapseState = EXPANDED;
      var style = this.$refs.root.style;
      style.overflowY = this.getOverflow();
      style.height = '';
      style.visibility = '';
      this.$emit('update', {
        state: EXPANDED,
        height: this.getElementHeight()
      });
    },
    setCollapsing: function setCollapsing() {
      var _this = this;

      if (!this.$refs.root) return;
      this.collapseState = COLLAPSING;
      var height = this.getElementHeight();
      var style = this.$refs.root.style;
      style.overflowY = this.getOverflow();
      style.height = height;
      style.visibility = '';
      this.$emit('update', {
        state: COLLAPSING,
        height: height
      });
      nextFrame(function () {
        if (!_this.$refs.root) return;
        if (_this.collapseState !== COLLAPSING) return;
        _this.$refs.root.style.height = collapseHeight;
      });
    },
    setExpanding: function setExpanding() {
      var _this2 = this;

      if (!this.$refs.root) return;
      this.$emit('update', {
        state: EXPANDING,
        height: ''
      });
      this.collapseState = EXPANDING;
      nextFrame(function () {
        if (!_this2.$refs.root) return;
        if (_this2.collapseState !== EXPANDING) return;
        var style = _this2.$refs.root.style;
        style.overflowY = _this2.getOverflow();
        style.height = _this2.getElementHeight();
        style.visibility = '';
      });
    },
    getElementHeight: function getElementHeight() {
      return "".concat(this.$refs.root.scrollHeight, "px");
    },
    getOverflow: function getOverflow() {
      return this.collapseState === EXPANDED && this.overflowOnExpanded ? '' : 'hidden';
    },
    onTransitionEnd: function onTransitionEnd(event) {
      if (event.propertyName === 'height' && event.target === this.$refs.root) {
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
}script.render = render;// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var component = /*#__PURE__*/(function () {
  // Assign InstallableComponent type
  var installable = script; // Attach install function executed by Vue.use()

  installable.install = function (app) {
    app.component('VueHeightCollapsible', installable);
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