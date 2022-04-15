import Vue from "vue";
function throttle$1(delay, callback, options) {
  var _ref = options || {}, _ref$noTrailing = _ref.noTrailing, noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing, _ref$noLeading = _ref.noLeading, noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading, _ref$debounceMode = _ref.debounceMode, debounceMode = _ref$debounceMode === void 0 ? void 0 : _ref$debounceMode;
  var timeoutID;
  var cancelled = false;
  var lastExec = 0;
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }
  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }
  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }
    var self2 = this;
    var elapsed = Date.now() - lastExec;
    if (cancelled) {
      return;
    }
    function exec() {
      lastExec = Date.now();
      callback.apply(self2, arguments_);
    }
    function clear() {
      timeoutID = void 0;
    }
    if (!noLeading && debounceMode && !timeoutID) {
      exec();
    }
    clearExistingTimeout();
    if (debounceMode === void 0 && elapsed > delay) {
      if (noLeading) {
        lastExec = Date.now();
      } else {
        exec();
      }
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === void 0 ? delay - elapsed : delay);
    }
  }
  wrapper.cancel = cancel;
  return wrapper;
}
function debounce(delay, atBegin, callback) {
  return callback === void 0 ? throttle$1(delay, atBegin, {
    debounceMode: false
  }) : throttle$1(delay, callback, {
    debounceMode: atBegin !== false
  });
}
var MapShim = function() {
  if (typeof Map !== "undefined") {
    return Map;
  }
  function getIndex(arr, key) {
    var result = -1;
    arr.some(function(entry, index2) {
      if (entry[0] === key) {
        result = index2;
        return true;
      }
      return false;
    });
    return result;
  }
  return function() {
    function class_1() {
      this.__entries__ = [];
    }
    Object.defineProperty(class_1.prototype, "size", {
      get: function() {
        return this.__entries__.length;
      },
      enumerable: true,
      configurable: true
    });
    class_1.prototype.get = function(key) {
      var index2 = getIndex(this.__entries__, key);
      var entry = this.__entries__[index2];
      return entry && entry[1];
    };
    class_1.prototype.set = function(key, value) {
      var index2 = getIndex(this.__entries__, key);
      if (~index2) {
        this.__entries__[index2][1] = value;
      } else {
        this.__entries__.push([key, value]);
      }
    };
    class_1.prototype.delete = function(key) {
      var entries = this.__entries__;
      var index2 = getIndex(entries, key);
      if (~index2) {
        entries.splice(index2, 1);
      }
    };
    class_1.prototype.has = function(key) {
      return !!~getIndex(this.__entries__, key);
    };
    class_1.prototype.clear = function() {
      this.__entries__.splice(0);
    };
    class_1.prototype.forEach = function(callback, ctx) {
      if (ctx === void 0) {
        ctx = null;
      }
      for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
        var entry = _a[_i];
        callback.call(ctx, entry[1], entry[0]);
      }
    };
    return class_1;
  }();
}();
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
var global$1 = function() {
  if (typeof global !== "undefined" && global.Math === Math) {
    return global;
  }
  if (typeof self !== "undefined" && self.Math === Math) {
    return self;
  }
  if (typeof window !== "undefined" && window.Math === Math) {
    return window;
  }
  return Function("return this")();
}();
var requestAnimationFrame$1 = function() {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame.bind(global$1);
  }
  return function(callback) {
    return setTimeout(function() {
      return callback(Date.now());
    }, 1e3 / 60);
  };
}();
var trailingTimeout = 2;
function throttle(callback, delay) {
  var leadingCall = false, trailingCall = false, lastCallTime = 0;
  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }
    if (trailingCall) {
      proxy();
    }
  }
  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  function proxy() {
    var timeStamp = Date.now();
    if (leadingCall) {
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      }
      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }
    lastCallTime = timeStamp;
  }
  return proxy;
}
var REFRESH_DELAY = 20;
var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
var mutationObserverSupported = typeof MutationObserver !== "undefined";
var ResizeObserverController = function() {
  function ResizeObserverController2() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
  }
  ResizeObserverController2.prototype.addObserver = function(observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    }
    if (!this.connected_) {
      this.connect_();
    }
  };
  ResizeObserverController2.prototype.removeObserver = function(observer) {
    var observers2 = this.observers_;
    var index2 = observers2.indexOf(observer);
    if (~index2) {
      observers2.splice(index2, 1);
    }
    if (!observers2.length && this.connected_) {
      this.disconnect_();
    }
  };
  ResizeObserverController2.prototype.refresh = function() {
    var changesDetected = this.updateObservers_();
    if (changesDetected) {
      this.refresh();
    }
  };
  ResizeObserverController2.prototype.updateObservers_ = function() {
    var activeObservers = this.observers_.filter(function(observer) {
      return observer.gatherActive(), observer.hasActive();
    });
    activeObservers.forEach(function(observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  ResizeObserverController2.prototype.connect_ = function() {
    if (!isBrowser || this.connected_) {
      return;
    }
    document.addEventListener("transitionend", this.onTransitionEnd_);
    window.addEventListener("resize", this.refresh);
    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    } else {
      document.addEventListener("DOMSubtreeModified", this.refresh);
      this.mutationEventsAdded_ = true;
    }
    this.connected_ = true;
  };
  ResizeObserverController2.prototype.disconnect_ = function() {
    if (!isBrowser || !this.connected_) {
      return;
    }
    document.removeEventListener("transitionend", this.onTransitionEnd_);
    window.removeEventListener("resize", this.refresh);
    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }
    if (this.mutationEventsAdded_) {
      document.removeEventListener("DOMSubtreeModified", this.refresh);
    }
    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
    var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
    var isReflowProperty = transitionKeys.some(function(key) {
      return !!~propertyName.indexOf(key);
    });
    if (isReflowProperty) {
      this.refresh();
    }
  };
  ResizeObserverController2.getInstance = function() {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController2();
    }
    return this.instance_;
  };
  ResizeObserverController2.instance_ = null;
  return ResizeObserverController2;
}();
var defineConfigurable = function(target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  return target;
};
var getWindowOf = function(target) {
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
  return ownerGlobal || global$1;
};
var emptyRect = createRectInit(0, 0, 0, 0);
function toFloat(value) {
  return parseFloat(value) || 0;
}
function getBordersSize(styles) {
  var positions = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }
  return positions.reduce(function(size, position) {
    var value = styles["border-" + position + "-width"];
    return size + toFloat(value);
  }, 0);
}
function getPaddings(styles) {
  var positions = ["top", "right", "bottom", "left"];
  var paddings = {};
  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles["padding-" + position];
    paddings[position] = toFloat(value);
  }
  return paddings;
}
function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
function getHTMLElementContentRect(target) {
  var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }
  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom;
  var width = toFloat(styles.width), height = toFloat(styles.height);
  if (styles.boxSizing === "border-box") {
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, "left", "right") + horizPad;
    }
    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, "top", "bottom") + vertPad;
    }
  }
  if (!isDocumentElement(target)) {
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight;
    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }
    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }
  return createRectInit(paddings.left, paddings.top, width, height);
}
var isSVGGraphicsElement = function() {
  if (typeof SVGGraphicsElement !== "undefined") {
    return function(target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  }
  return function(target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
  };
}();
function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }
  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }
  return getHTMLElementContentRect(target);
}
function createReadOnlyRect(_a) {
  var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
  var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype);
  defineConfigurable(rect, {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
function createRectInit(x, y, width, height) {
  return { x, y, width, height };
}
var ResizeObservation = function() {
  function ResizeObservation2(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  ResizeObservation2.prototype.isActive = function() {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  ResizeObservation2.prototype.broadcastRect = function() {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };
  return ResizeObservation2;
}();
var ResizeObserverEntry = function() {
  function ResizeObserverEntry2(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);
    defineConfigurable(this, { target, contentRect });
  }
  return ResizeObserverEntry2;
}();
var ResizeObserverSPI = function() {
  function ResizeObserverSPI2(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();
    if (typeof callback !== "function") {
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    }
    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  ResizeObserverSPI2.prototype.observe = function(target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (observations.has(target)) {
      return;
    }
    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this);
    this.controller_.refresh();
  };
  ResizeObserverSPI2.prototype.unobserve = function(target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (!observations.has(target)) {
      return;
    }
    observations.delete(target);
    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  ResizeObserverSPI2.prototype.disconnect = function() {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  ResizeObserverSPI2.prototype.gatherActive = function() {
    var _this = this;
    this.clearActive();
    this.observations_.forEach(function(observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  ResizeObserverSPI2.prototype.broadcastActive = function() {
    if (!this.hasActive()) {
      return;
    }
    var ctx = this.callbackCtx_;
    var entries = this.activeObservations_.map(function(observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  ResizeObserverSPI2.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  };
  ResizeObserverSPI2.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  };
  return ResizeObserverSPI2;
}();
var observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
var ResizeObserver = function() {
  function ResizeObserver2(callback) {
    if (!(this instanceof ResizeObserver2)) {
      throw new TypeError("Cannot call a class as a function.");
    }
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer);
  }
  return ResizeObserver2;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(method) {
  ResizeObserver.prototype[method] = function() {
    var _a;
    return (_a = observers.get(this))[method].apply(_a, arguments);
  };
});
var index$1 = function() {
  if (typeof global$1.ResizeObserver !== "undefined") {
    return global$1.ResizeObserver;
  }
  return ResizeObserver;
}();
const isServer = typeof window === "undefined";
const resizeHandler = function(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn) => {
        fn();
      });
    }
  }
};
const addResizeListener = function(element, fn) {
  if (isServer)
    return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new index$1(debounce(16, resizeHandler));
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};
const removeResizeListener = function(element, fn) {
  if (!element || !element.__resizeListeners__)
    return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};
var LayoutObserver = {
  computed: {
    tableLayout() {
      let layout;
      if (this.table) {
        layout = this.table || this.table.$parent;
      }
      if (!layout) {
        throw new Error("Can not find table");
      }
      return layout;
    }
  },
  mounted() {
    this.onColumnsChange(this.tableLayout);
  },
  updated() {
  },
  methods: {
    onColumnsChange(layout) {
      var _a;
      const column = layout.store.tableHeader;
      const cols = this.$el.querySelectorAll("colgroup > col");
      if (!cols.length)
        return;
      for (let i = layout.index ? 1 : 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        const name = col.getAttribute("name");
        if (name) {
          col.setAttribute("width", (_a = column[i]) == null ? void 0 : _a.width);
        }
      }
    }
  }
};
function parseWidth(width) {
  if (width) {
    width = parseInt(width, 10);
  } else {
    width = 0;
  }
  return width;
}
var TableBody = {
  name: "TableBody",
  mixins: [LayoutObserver],
  props: {
    store: {
      required: true
    }
  },
  data() {
    return {
      tooltipContent: "",
      tipStyle: "",
      tableData: [],
      arrowStyle: "",
      yPos: 0,
      realBoxHeight: 0
    };
  },
  computed: {
    table() {
      return this.$parent;
    },
    pos() {
      return {
        transform: `translateY(${this.yPos}px)`,
        transition: "all ease-in 0",
        overflow: "hidden"
      };
    },
    defaultOption() {
      return {
        step: 2,
        singleStep: 6,
        hoverStop: true,
        singleHeight: 48,
        singleStepMove: false,
        delayTime: 2e3,
        waitTime: 2e3
      };
    },
    options() {
      return Object.assign({}, this.defaultOption, this.tableLayout.options);
    },
    hoverStopSwitch() {
      return this.options.hoverStop;
    },
    singleStep() {
      let step = this.options.singleStep;
      let singleHeight = this.options.singleHeight;
      if (singleHeight % step !== 0) {
        console.warn("\u5F53\u524D\u5355\u6B65\u957F\u4E0D\u662F\u5355\u6761\u6570\u636E\u9AD8\u5EA6\u7684\u7EA6\u6570,\u8BF7\u53CA\u65F6\u8C03\u6574,\u907F\u514D\u9020\u6210\u6EDA\u52A8\u9519\u4F4D*&\u2026\u2026%&");
      }
      return step;
    }
  },
  watch: {
    "store.tableData": {
      immediate: true,
      handler(newVal, oldVal) {
        if ((newVal == null ? void 0 : newVal.length) > 0 && oldVal !== newVal) {
          this.tableData = newVal.slice(0);
        }
      }
    }
  },
  beforeCreate() {
    this.VM = null;
    this.reqFrame = null;
    this.singleWaitTime = null;
    this.isHover = false;
    this.isStart = false;
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.cancle();
    this.VM && this.VM.$destroy();
    if (this.singleWaitTime)
      clearTimeout(this.singleWaitTime);
  },
  methods: {
    init() {
      const height = this.$parent.mergeOption.bodyHeight;
      const cellHeight = this.$el.offsetHeight;
      if (cellHeight > height) {
        this.tableData.push(...this.store.tableData);
        this.isStart = true;
        let timer = setTimeout(() => {
          this.initMove();
          clearTimeout(timer);
        }, this.options.delayTime);
      } else {
        this.isStart = false;
      }
    },
    handleCellMouseEnter(event) {
      if (!this.table.mergeOption.showTip)
        return;
      const cell = event.target;
      const cellChild = cell.querySelector(".cell");
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      if (rangeWidth > cellChild.offsetWidth) {
        if (!this.VM)
          this.createTooltip();
        let offsetTop = this.getOffsetTop(range);
        const {
          offsetLeft,
          arrowOffsetLeft
        } = this.getOffsetLeft(range, event, rangeWidth);
        this.VM.$el.style.display = "";
        this.tooltipContent = cell.innerText || cell.textContent;
        this.tipStyle = `z-index: 9999;position:fixed; left: ${offsetLeft}px; top: ${offsetTop}px;`;
        this.arrowStyle = `left: ${arrowOffsetLeft}px`;
      }
    },
    createTooltip() {
      this.$createElement;
      const that = this;
      this.VM = new Vue({
        render() {
          const h = arguments[0];
          return h("div", {
            "attrs": {
              "x-placement": "bottom"
            },
            "ref": "tooltip",
            "class": "el-tooltip__popper is-dark",
            "style": that.tipStyle
          }, [that.tooltipContent, h("div", {
            "class": "popper__arrow",
            "style": that.arrowStyle
          })]);
        }
      }).$mount();
      document.getElementsByTagName("body")[0].appendChild(this.VM.$el);
    },
    getOffsetTop(range) {
      const rangeTop = range.getBoundingClientRect().top;
      const skewing = 35;
      return rangeTop + skewing;
    },
    getOffsetLeft(range, event, rangeWidth) {
      const rangeLeft = range.getBoundingClientRect().left;
      const removeWidth = parseWidth((rangeWidth - event.target.clientWidth) / 2);
      const leftWidth = rangeLeft - removeWidth;
      const offsetLeft = leftWidth < 0 ? 0 : leftWidth;
      const arrowOffsetLeft = leftWidth < 0 ? rangeLeft + event.target.clientWidth / 2 : rangeWidth / 2;
      return {
        offsetLeft,
        arrowOffsetLeft
      };
    },
    handleCellMouseLeave() {
      if (this.VM) {
        this.VM.$el.style.display = "none";
      }
    },
    reset() {
      this.cancle();
      this.initMove();
    },
    cancle() {
      cancelAnimationFrame(this.reqFrame || "");
    },
    move() {
      if (this.isHover)
        return;
      this.cancle();
      this.reqFrame = requestAnimationFrame(() => {
        const h = this.realBoxHeight / 2;
        let {
          step
        } = this.options;
        if (Math.abs(this.yPos) >= h) {
          this.yPos = 0;
        }
        this.yPos -= step;
        this.move();
      });
    },
    singleMove() {
      if (this.isHover)
        return;
      this.cancle();
      this.reqFrame = requestAnimationFrame(() => {
        const h = this.realBoxHeight / 2;
        let {
          waitTime,
          singleStep,
          singleHeight
        } = this.options;
        if (Math.abs(this.yPos) >= h) {
          this.yPos = 0;
        }
        this.yPos -= singleStep;
        if (this.singleWaitTime)
          clearTimeout(this.singleWaitTime);
        if (Math.abs(this.yPos) % singleHeight < singleStep) {
          this.singleWaitTime = setTimeout(() => {
            this.singleMove();
          }, waitTime);
        } else {
          this.singleMove();
        }
      });
    },
    initMove() {
      this.$nextTick(() => {
        if (this.isStart) {
          let timer = setTimeout(() => {
            this.realBoxHeight = this.$refs.realBox.offsetHeight;
            this.options.singleStepMove ? this.singleMove() : this.move();
            clearTimeout(timer);
          }, 0);
        } else {
          this.cancle();
          this.yPos = 0;
        }
      });
    },
    startMove() {
      this.isHover = false;
      this.isStart ? this.options.singleStepMove ? this.singleMove() : this.move() : null;
    },
    stopMove() {
      this.isHover = true;
      if (this.singleWaitTime)
        clearTimeout(this.singleWaitTime);
      this.cancle();
    }
  },
  render() {
    const h = arguments[0];
    const tableHeader = this.store.tableHeader;
    const tableData = this.tableData;
    const height = this.realBoxHeight / 2;
    const {
      isIndex,
      showTip
    } = this.table.mergeOption;
    const bodyWidth = this.table.bodyWidth;
    const table = this.table;
    const pos = this.pos;
    const enter = () => {
      if (this.hoverStopSwitch)
        this.stopMove();
    };
    const leave = () => {
      if (this.hoverStopSwitch)
        this.startMove();
    };
    const lineClick = (data) => {
      table.$emit("lineClick", data);
    };
    const upScroll = () => {
      if (this.yPos > 0)
        this.yPos = -height;
      this.yPos += 20;
    };
    const downScroll = () => {
      if (Math.abs(this.yPos) >= height)
        this.yPos = 0;
      this.yPos -= 20;
    };
    const wheel = (e) => {
      this.isStart && debounce(10, () => {
        e.wheelDelta > 0 ? upScroll() : downScroll();
      })();
    };
    return h("div", {
      "ref": "wrap"
    }, [h("div", {
      "class": "realBox",
      "ref": "realBox",
      "style": pos,
      "on": {
        "mousewheel": wheel,
        "mouseenter": enter,
        "mouseleave": leave
      }
    }, [h("table", {
      "class": "el-table__body",
      "attrs": {
        "cellspacing": "0",
        "cellpadding": "0",
        "border": "0"
      },
      "style": `width:${bodyWidth}px`
    }, [h("colgroup", [isIndex && h("col", {
      "attrs": {
        "name": "column_0",
        "width": "50"
      }
    }), tableHeader.map((column, index2) => !column.hidden && h("col", {
      "attrs": {
        "name": `column_${index2 + 1}`
      }
    }))]), h("tbody", [tableData.map((bodyColumn, bodyIndex) => {
      return h("tr", {
        "on": {
          "click": () => lineClick(bodyColumn)
        }
      }, [isIndex && h("td", {
        "class": ["el-table__cell", "is-center"]
      }, [h("div", {
        "class": ["cell"]
      }, [bodyIndex + 1])]), tableHeader.map((headerColumn) => {
        return !headerColumn.hidden && h("td", {
          "class": ["el-table__cell", "is-center"],
          "on": {
            "mouseenter": ($event) => this.handleCellMouseEnter($event),
            "mouseleave": this.handleCellMouseLeave
          }
        }, [h("div", {
          "class": showTip ? ["cell", "el-tooltip"] : ["cell"]
        }, [bodyColumn[headerColumn.prop]])]);
      })]);
    })])])])]);
  }
};
var TableHeader = {
  name: "TableHeader",
  mixins: [LayoutObserver],
  props: {
    store: {
      required: true
    }
  },
  computed: {
    table() {
      return this.$parent;
    }
  },
  render() {
    const h = arguments[0];
    const tableHeader = this.store.tableHeader;
    const isIndex = this.table.mergeOption.index;
    return h("table", {
      "class": "el-table_header",
      "attrs": {
        "cellspacing": "0",
        "cellpadding": "0",
        "border": "0"
      }
    }, [h("colgroup", [isIndex && h("col", {
      "attrs": {
        "name": "column_0",
        "width": "50"
      }
    }), tableHeader.map((column, index2) => !column.hidden && h("col", {
      "attrs": {
        "name": `column_${index2 + 1}`
      }
    }))]), h("thead", {
      "class": ["is-group"]
    }, [h("tr", [isIndex && h("th", {
      "class": ["el-table__cell", "is-center"]
    }, ["\u5E8F\u53F7"]), tableHeader.map((column) => !column.hidden && h("th", {
      "attrs": {
        "colspan": column.colSpan,
        "rowspan": column.rowSpan
      },
      "key": column.id,
      "class": ["el-table__cell", "is-center"]
    }, [h("div", {
      "class": ["cell"]
    }, [column.label])]))])])]);
  }
};
var render$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  _vm._self._c || _h;
  return _vm._m(0);
};
var staticRenderFns$1 = [function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "empty", staticStyle: { "width": "100%", "text-align": "center" } }, [_c("img", { staticStyle: { "width": "150px", "margin-top": "20px" }, attrs: { "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMi40IDg5NmE0MDkuNiA1MS4yIDAgMSAwIDgxOS4yIDAgNDA5LjYgNTEuMiAwIDEgMC04MTkuMiAwWiIgZmlsbD0iIzRBNjhDQyIgb3BhY2l0eT0iLjEiIC8+PHBhdGggZD0iTTExNi43MzYgMzc2LjgzMmMwIDguNzA0IDYuNjU2IDE1LjM2IDE1LjM2IDE1LjM2czE1LjM2LTYuNjU2IDE1LjM2LTE1LjM2LTYuNjU2LTE1LjM2LTE1LjM2LTE1LjM2Yy04LjE5MiAwLTE1LjM2IDcuMTY4LTE1LjM2IDE1LjM2ek05MjYuNzIgODMyYy0xOS40NTYgNS4xMi0yMy41NTIgOS4yMTYtMjguMTYgMjguMTYtNS4xMi0xOS40NTYtOS4yMTYtMjMuNTUyLTI4LjE2LTI4LjE2IDE4Ljk0NC01LjEyIDIzLjU1Mi05LjIxNiAyOC4xNi0yOC4xNiA0LjYwOCAxOC45NDQgOC43MDQgMjMuNTUyIDI4LjE2IDI4LjE2ek0yMDIuMjQgMzIzLjA3MmMtMjUuMDg4IDYuNjU2LTMwLjIwOCAxMS43NzYtMzYuODY0IDM2Ljg2NC02LjY1Ni0yNS4wODgtMTEuNzc2LTMwLjIwOC0zNi44NjQtMzYuODY0IDI1LjA4OC02LjY1NiAzMC4yMDgtMTIuMjg4IDM2Ljg2NC0zNi44NjQgNi4xNDQgMjUuMDg4IDExLjc3NiAzMC4yMDggMzYuODY0IDM2Ljg2NHpNODE2LjY0IDIzNS4wMDhjLTE1LjM2IDQuMDk2LTE4LjQzMiA3LjE2OC0yMi41MjggMjIuNTI4LTQuMDk2LTE1LjM2LTcuMTY4LTE4LjQzMi0yMi41MjgtMjIuNTI4IDE1LjM2LTQuMDk2IDE4LjQzMi03LjE2OCAyMi41MjgtMjIuNTI4IDMuNTg0IDE1LjM2IDcuMTY4IDE4LjQzMiAyMi41MjggMjIuNTI4ek04ODIuNjg4IDE1Ni4xNmMtMzkuOTM2IDEwLjI0LTQ4LjEyOCAxOC45NDQtNTguODggNTguODgtMTAuMjQtMzkuOTM2LTE4Ljk0NC00OC4xMjgtNTguODgtNTguODggMzkuOTM2LTEwLjI0IDQ4LjEyOC0xOC45NDQgNTguODgtNTguODggMTAuMjQgMzkuNDI0IDE4Ljk0NCA0OC4xMjggNTguODggNTguODh6IiBmaWxsPSIjNEE2OENDIiBvcGFjaXR5PSIuNSIgLz48cGF0aCBkPSJNNDE5Ljg0IDcxMy4yMTZ2NC4wOTZsMzMuNzkyIDMxLjIzMiAxMjkuNTM2LTYyLjk3Nkw0NjUuOTIgNzYwLjgzMnYzNi44NjRsMTguOTQ0LTE4LjQzMnYtMC41MTIgMC41MTJsMTguOTQ0IDE4LjQzMiAxMDAuMzUyLTEyMi44OHYtNC4wOTZ6IiBmaWxsPSIjNEE2OENDIiBvcGFjaXR5PSIuMiIgLz48cGF0aCBkPSJNODYwLjE2IDU1MS45MzZ2LTEuMDI0YzAtMS4wMjQtMC41MTItMS41MzYtMC41MTItMi41NnYtMC41MTJsLTExMC4wOC0yODcuMjMyYy0xNS44NzItNDguNjQtNjAuOTI4LTgxLjQwOC0xMTIuMTI4LTgxLjQwOEgzODcuMDcyYy01MS4yIDAtOTYuMjU2IDMyLjc2OC0xMTIuMTI4IDgxLjQwOEwxNjQuODY0IDU0Ny44NHYwLjUxMmMtMC41MTIgMS4wMjQtMC41MTIgMS41MzYtMC41MTIgMi41NlY3NTcuNzZjMCA2NS4wMjQgNTIuNzM2IDExNy43NiAxMTcuNzYgMTE3Ljc2aDQ2MC44YzY1LjAyNCAwIDExNy43Ni01Mi43MzYgMTE3Ljc2LTExNy43NnYtMjA0LjhjLTAuNTEyLTAuNTEyLTAuNTEyLTAuNTEyLTAuNTEyLTEuMDI0ek0zMDMuNjE2IDI3MS4zNnMwLTAuNTEyIDAuNTEyLTAuNTEyQzMxNS4zOTIgMjMzLjk4NCAzNDkuMTg0IDIwOS45MiAzODcuMDcyIDIwOS45MmgyNDkuODU2YzM3Ljg4OCAwIDcxLjY4IDI0LjA2NCA4My40NTYgNjAuNDE2IDAgMCAwIDAuNTEyIDAuNTEyIDAuNTEybDEwMS44ODggMjY2LjI0SDU4OC44Yy04LjcwNCAwLTE1LjM2IDYuNjU2LTE1LjM2IDE1LjM2IDAgMzMuNzkyLTI3LjY0OCA2MS40NC02MS40NCA2MS40NHMtNjEuNDQtMjcuNjQ4LTYxLjQ0LTYxLjQ0YzAtOC43MDQtNi42NTYtMTUuMzYtMTUuMzYtMTUuMzZIMjAxLjcyOEwzMDMuNjE2IDI3MS4zNnpNODI5LjQ0IDc1Ny43NmMwIDQ4LjEyOC0zOC45MTIgODcuMDQtODcuMDQgODcuMDRIMjgxLjZjLTQ4LjEyOCAwLTg3LjA0LTM4LjkxMi04Ny4wNC04Ny4wNHYtMTg5LjQ0aDIyNi44MTZjNy4xNjggNDMuNTIgNDUuMDU2IDc2LjggOTAuNjI0IDc2LjhzODMuNDU2LTMzLjI4IDkwLjYyNC03Ni44SDgyOS40NHYxODkuNDR6IiBmaWxsPSIjNEE2OENDIiBvcGFjaXR5PSIuNSIgLz48cGF0aCBkPSJNNTEyIDU3OC41NmMtMTQuMzM2IDAtMjUuNi0xMS4yNjQtMjUuNi0yNS42VjUwMS43NkgyNTMuNDRsODMuOTY4LTIxOS4xMzYgMC41MTItMS4wMjRjNy4xNjgtMjEuNTA0IDI2LjYyNC0zNS44NCA0OS4xNTItMzUuODRoMjQ5Ljg1NmMyMi41MjggMCA0MS45ODQgMTQuMzM2IDQ5LjE1MiAzNS44NGwwLjUxMiAxLjAyNEw3NzAuNTYgNTAxLjc2SDUzNy42djUxLjJjMCAxNC4zMzYtMTEuMjY0IDI1LjYtMjUuNiAyNS42eiIgZmlsbD0iIzRBNjhDQyIgb3BhY2l0eT0iLjIiIC8+PC9zdmc+" } }), _c("p", [_vm._v("\u6682\u65E0\u6570\u636E")])]);
}];
function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render2) {
    options.render = render2;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  if (functionalTemplate) {
    options.functional = true;
  }
  if (scopeId) {
    options._scopeId = "data-v-" + scopeId;
  }
  var hook;
  if (moduleIdentifier) {
    hook = function(context) {
      context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
      if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
        context = __VUE_SSR_CONTEXT__;
      }
      if (injectStyles) {
        injectStyles.call(this, context);
      }
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    options._ssrRegister = hook;
  } else if (injectStyles) {
    hook = shadowMode ? function() {
      injectStyles.call(this, (options.functional ? this.parent : this).$root.$options.shadowRoot);
    } : injectStyles;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const __vue2_script$1 = {};
const __cssModules$1 = {};
var __component__$1 = /* @__PURE__ */ normalizeComponent(__vue2_script$1, render$1, staticRenderFns$1, false, __vue2_injectStyles$1, null, null, null);
function __vue2_injectStyles$1(context) {
  for (let o in __cssModules$1) {
    this[o] = __cssModules$1[o];
  }
}
var ImgEmpty = /* @__PURE__ */ function() {
  return __component__$1.exports;
}();
var index = "";
var render = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "el-table" }, [_c("div", { ref: "headerWrapper", staticClass: "el-table__header-wrapper" }, [_c("table-header", { ref: "tableHeader", style: { width: _vm.parentWidth ? _vm.parentWidth + "px" : "" }, attrs: { "store": _vm.store } })], 1), _c("div", { ref: "bodyWrapper", staticClass: "el-table__body-wrapper", style: "height: " + _vm.mergeOption.bodyHeight + "px;" }, [_vm.isEmpty ? _c("img-empty") : _c("table-body", { key: _vm.updateKey, ref: "tableBody", style: { width: _vm.parentWidth ? _vm.parentWidth + "px" : "" }, attrs: { "store": _vm.store } })], 1)]);
};
var staticRenderFns = [];
const __vue2_script = {
  name: "TableScroll",
  components: {
    TableHeader,
    TableBody,
    ImgEmpty
  },
  props: {
    tableHeader: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      store: {
        tableHeader: [],
        tableData: [],
        table: this
      },
      updateKey: 0,
      tableHeaderData: [],
      tableBodyData: [],
      bodyWidth: "",
      isEmpty: true
    };
  },
  computed: {
    defaultOptions() {
      return {
        bodyHeight: 300,
        index: false,
        showTip: true
      };
    },
    mergeOption() {
      return Object.assign({}, this.defaultOptions, this.options);
    },
    bodyWrapper() {
      return this.$refs.headerWrapper;
    },
    parentWidth() {
      const bodyWidth = this.bodyWidth;
      this.updateColumns(bodyWidth);
      return bodyWidth;
    }
  },
  watch: {
    tableHeader: {
      immediate: true,
      handler(value) {
        this.tableHeaderData = value;
      }
    },
    tableData: {
      immediate: true,
      handler(newVal, oldVal) {
        if ((newVal == null ? void 0 : newVal.length) > 0 && oldVal !== newVal) {
          this.isEmpty = false;
          this.updateKey++;
          this.tableBodyData = newVal;
        } else {
          this.isEmpty = true;
        }
      }
    }
  },
  created() {
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
  },
  mounted() {
    this.bindEvents();
    this.updateColumnsWidth();
    this.updateColumns(this.bodyWidth);
    this.$ready = true;
  },
  destroyed() {
    this.unbindEvents();
  },
  methods: {
    bindEvents() {
      addResizeListener(this.$el, this.resizeListener);
    },
    unbindEvents() {
      removeResizeListener(this.$el, this.resizeListener);
    },
    resizeListener() {
      if (!this.$ready)
        return;
      this.updateColumnsWidth();
    },
    updateColumnsWidth() {
      this.bodyWidth = this.$el.clientWidth;
    },
    updateColumns(bodyWidth) {
      let tables = this.tableHeaderData.filter((item) => !item.hidden);
      let indexWidth = this.mergeOption.index ? 50 : 0;
      let widthSum = 0;
      let num = 0;
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].width) {
          widthSum += parseWidth(tables[i].width);
          parseWidth(tables[i].width) && num++;
        }
      }
      this.store.tableHeader = tables.map((item) => {
        if (!item.width) {
          item.width = parseWidth((bodyWidth - widthSum - indexWidth) / (tables.length - num));
        }
        return item;
      });
      this.store.tableData = this.tableBodyData;
    }
  }
};
const __cssModules = {};
var __component__ = /* @__PURE__ */ normalizeComponent(__vue2_script, render, staticRenderFns, false, __vue2_injectStyles, null, null, null);
function __vue2_injectStyles(context) {
  for (let o in __cssModules) {
    this[o] = __cssModules[o];
  }
}
var vueTableScroll = /* @__PURE__ */ function() {
  return __component__.exports;
}();
vueTableScroll.install = (Vue2, options = {}) => {
  Vue2.component(options.componentName || vueTableScroll.name, vueTableScroll);
};
export { vueTableScroll as default };
