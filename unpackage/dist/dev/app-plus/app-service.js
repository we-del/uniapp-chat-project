var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
      throw reason;
    }));
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$g = {
    name: "yx-popup",
    emits: ["hide", "action"],
    props: {
      popItem: {
        Object,
        default: [
          {
            id: 1,
            icon: "icon-chat1",
            content: "\u8BBE\u4E3A\u7F6E\u9876",
            event: "setTop"
          },
          {
            id: 2,
            icon: "icon-adduser",
            content: "\u5220\u9664\u8BE5\u804A\u5929",
            event: "delChat"
          }
        ]
      },
      popPosittion: {
        type: Object,
        default: {
          x: 350,
          y: 30
        }
      },
      isDark: {
        type: Boolean,
        default: false
      },
      show: [Boolean],
      isBottom: {
        type: Boolean,
        default: false
      },
      popHeight: {
        type: Number
      }
    },
    data() {
      return {};
    },
    methods: {
      handleReactive(item) {
        formatAppLog("log", "at components/yx-popup.vue:76", "\u6307\u4EE4\u5373\u5C06\u4FEE\u6539\u66F4\u6539", item);
        this.$emit("action", item.event);
        this.$emit("hide");
      },
      hide() {
        formatAppLog("log", "at components/yx-popup.vue:82", "\u6211\u6765\u5B8C\u6210\u9690\u85CF");
        this.$emit("hide");
      }
    },
    computed: {
      position() {
        return !this.isBottom ? `left:${this.popPosittion.x}px;top:${this.popPosittion.y}px` : `left:${this.popPosittion.x}px;bottom:${this.popPosittion.y}px`;
      },
      styleCustom() {
        let res = "";
        res += this.isDark ? " bg-dark text-white " : "bg-white text-dark ";
        res += this.isBottom ? " fixed-bottom " : "";
        return res;
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", {
        class: vue.normalizeClass([$options.styleCustom, "zTop border-dark border p-2 flex flex-column position-fixed rounded font-md"]),
        style: vue.normalizeStyle($props.show ? `display:block;${$options.position}` : `display:none;${$options.position}`)
      }, [
        !$props.isBottom ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.popItem, (item, i) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              onClick: ($event) => $options.handleReactive(item),
              class: "flex-1",
              key: item.id,
              style: vue.normalizeStyle(i !== $props.popItem.length - 1 && item.content ? "margin-bottom:30rpx" : "")
            }, [
              item.icon ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: vue.normalizeClass(["iconfont font-md p-1", item.icon])
              }, null, 2)) : vue.createCommentVNode("v-if", true),
              item.content ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 1,
                class: "font-md"
              }, vue.toDisplayString(item.content), 1)) : vue.createCommentVNode("v-if", true)
            ], 12, ["onClick"]);
          }), 128))
        ])) : vue.createCommentVNode("v-if", true),
        $props.isBottom ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          style: vue.normalizeStyle(`height:${$props.popHeight}rpx;width:100%;`),
          class: "bg-danger"
        }, null, 4)) : vue.createCommentVNode("v-if", true)
      ], 6),
      vue.createElementVNode("view", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.hide && $options.hide(...args)),
        style: vue.normalizeStyle([$props.show ? "display:block" : "display:none", { "left": "0", "top": "0" }]),
        id: "mask",
        class: "fill-screen position-absolute"
      }, null, 4)
    ], 64);
  }
  var YxPopup = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-popup.vue"]]);
  const _sfc_main$f = {
    name: "yx-tool-bar",
    emits: ["clickNav"],
    props: {
      title: [String],
      isSelf: {
        type: Boolean,
        default: false
      }
    },
    components: { YxPopup },
    mounted() {
      if (!this.isSelf) {
        this.initPopup();
      }
      formatAppLog("log", "at components/yx-tool-bar.vue:32", "@tool", this);
    },
    data() {
      return {
        popShow: false,
        popPosition: {},
        popData: []
      };
    },
    methods: {
      initPopup() {
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        device.screenHeight;
        this.popPosition = { x: maxX - 160, y: 60 };
        this.popIsDark = true;
        this.popShow = false;
        this.popData = [
          {
            id: 1,
            icon: "icon-chat1",
            content: "\u53D1\u8D77\u7FA4\u804A"
          },
          {
            id: 2,
            icon: "icon-adduser",
            content: "\u6DFB\u52A0\u670B\u53CB"
          },
          {
            id: 3,
            icon: "icon-saoyisao",
            content: "\u626B\u4E00\u626B"
          },
          {
            id: 4,
            icon: "icon-shoufukuan1",
            content: "\u6536\u4ED8\u6B3E"
          },
          {
            id: 5,
            icon: "icon-help",
            content: "\u5E2E\u52A9\u4E0E\u53CD\u9988"
          }
        ];
      },
      showPopup() {
        this.popShow = true;
      },
      handleClick() {
        formatAppLog("log", "at components/yx-tool-bar.vue:83", "@clickcc", this);
        if (this.isSelf) {
          this.$emit("clickNav");
        } else {
          this.showPopup();
        }
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", {
        class: "fixed-top flex justify-between p-2 align-center pr-4",
        style: { "background-color": "#efefeb" }
      }, [
        vue.createElementVNode("view", { class: "font-lg" }, vue.toDisplayString($props.title), 1),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("text", { class: "iconfont icon-search font-lg pr-5 font-lg" }),
          vue.createElementVNode("text", {
            class: "iconfont icon-add font-lg",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
          })
        ])
      ]),
      vue.createCommentVNode(' <view style="margin-top: 100rpx;"></view> '),
      !$props.isSelf ? (vue.openBlock(), vue.createBlock(_component_yx_popup, {
        key: 0,
        popItem: $data.popData,
        popPosittion: $data.popPosition,
        show: $data.popShow,
        isDark: true,
        onHide: _cache[1] || (_cache[1] = ($event) => $data.popShow = false)
      }, null, 8, ["popItem", "popPosittion", "show"])) : vue.createCommentVNode("v-if", true)
    ], 64);
  }
  var YxToolBar = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-tool-bar.vue"]]);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var dayjs_min = { exports: {} };
  (function(module, exports) {
    !function(t, e) {
      module.exports = e();
    }(commonjsGlobal, function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", f = "month", h = "quarter", c = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date())
          return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, f), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), f);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: h }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return t2 === void 0;
      } }, g = "en", D = {};
      D[g] = M;
      var p = function(t2) {
        return t2 instanceof _;
      }, S = function t2(e2, n2, r2) {
        var i2;
        if (!e2)
          return g;
        if (typeof e2 == "string") {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1)
            return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, w = function(t2, e2) {
        if (p(t2))
          return t2.clone();
        var n2 = typeof e2 == "object" ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, O = v;
      O.l = S, O.i = p, O.w = function(t2, e2) {
        return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t2) {
          this.$L = S(t2.locale, null, true), this.parse(t2);
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (e2 === null)
              return new Date(NaN);
            if (O.u(e2))
              return new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if (typeof e2 == "string" && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.$x = t2.x || {}, this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return O;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = w(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return w(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < w(t2);
        }, m2.$g = function(t2, e2, n2) {
          return O.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!O.u(e2) || e2, h2 = O.p(t2), l2 = function(t3, e3) {
            var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return O.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (h2) {
            case c:
              return r2 ? l2(1, 0) : l2(31, 11);
            case f:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = O.p(t2), h2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = h2 + "Date", n2[d] = h2 + "Date", n2[f] = h2 + "Month", n2[c] = h2 + "FullYear", n2[u] = h2 + "Hours", n2[s] = h2 + "Minutes", n2[i] = h2 + "Seconds", n2[r] = h2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === f || o2 === c) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[O.p(t2)]();
        }, m2.add = function(r2, h2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = O.p(h2), y2 = function(t2) {
            var e2 = w(l2);
            return O.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === f)
            return this.set(f, this.$M + r2);
          if ($2 === c)
            return this.set(c, this.$y + r2);
          if ($2 === a)
            return y2(1);
          if ($2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return O.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid())
            return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = O.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, f2 = n2.months, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, c2 = function(t3) {
            return O.s(s2 % 12 || 12, t3, "0");
          }, d2 = n2.meridiem || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          }, $2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: O.s(a2 + 1, 2, "0"), MMM: h2(n2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(n2.weekdaysMin, this.$W, o2, 2), ddd: h2(n2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: O.s(s2, 2, "0"), h: c2(1), hh: c2(2), a: d2(s2, u2, true), A: d2(s2, u2, false), m: String(u2), mm: O.s(u2, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"), SSS: O.s(this.$ms, 3, "0"), Z: i2 };
          return r2.replace(y, function(t3, e3) {
            return e3 || $2[t3] || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = O.p(d2), M3 = w(r2), m3 = (M3.utcOffset() - this.utcOffset()) * e, v2 = this - M3, g2 = O.m(this, M3);
          return g2 = ($2 = {}, $2[c] = g2 / 12, $2[f] = g2, $2[h] = g2 / 3, $2[o] = (v2 - m3) / 6048e5, $2[a] = (v2 - m3) / 864e5, $2[u] = v2 / n, $2[s] = v2 / e, $2[i] = v2 / t, $2)[y2] || v2, l2 ? g2 : O.a(g2);
        }, m2.daysInMonth = function() {
          return this.endOf(f).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2)
            return this.$L;
          var n2 = this.clone(), r2 = S(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return O.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), T = _.prototype;
      return w.prototype = T, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function(t2) {
        T[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), w.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, w), t2.$i = true), w;
      }, w.locale = S, w.isDayjs = p, w.unix = function(t2) {
        return w(1e3 * t2);
      }, w.en = D[g], w.Ls = D, w.p = {}, w;
    });
  })(dayjs_min);
  var dayjs = dayjs_min.exports;
  const _sfc_main$e = {
    name: "yx-badge",
    props: {
      messageCount: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {};
    },
    computed: {
      count() {
        return this.messageCount > 99 ? `99+` : this.messageCount;
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      id: "badge",
      class: "rounded-circle bg-danger font-sm p-1 position-absolute"
    }, vue.toDisplayString($options.count), 1);
  }
  var YxBadge = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-7d12dd30"], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-badge.vue"]]);
  const _sfc_main$d = {
    name: "chat-item",
    components: { YxBadge },
    props: {
      user: [Object]
    },
    data() {
      return {};
    },
    methods: {
      handleClick(e) {
      }
    },
    computed: {
      time() {
        return dayjs(this.user.message_time).format("HH:mm");
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_badge = vue.resolveComponent("yx-badge");
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "flex justify-between p-2",
      "hover-class": "bg-common",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
    }, [
      vue.createElementVNode("image", {
        class: "rounded size-1 pr-2",
        src: $props.user.image_src,
        mode: "aspectFill"
      }, null, 8, ["src"]),
      vue.createVNode(_component_yx_badge, {
        messageCount: $props.user.message_count
      }, null, 8, ["messageCount"]),
      vue.createElementVNode("view", {
        id: "user-content",
        class: "flex flex-1 flex-column justify-between"
      }, [
        vue.createElementVNode("view", {
          id: "user-name",
          class: "text-ellipsis text-primary"
        }, vue.toDisplayString($props.user.user_name), 1),
        vue.createElementVNode("view", {
          id: "content ",
          class: "text-ellipsis font-sm text-common mb-1"
        }, vue.toDisplayString($props.user.user_message), 1)
      ]),
      vue.createElementVNode("view", {
        id: "message-time",
        class: "font-sm text-common"
      }, vue.toDisplayString($options.time), 1)
    ]);
  }
  var chatItem = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat-item.vue"]]);
  var userList = [
    {
      id: 1,
      image_src: "../../../static/logo.png",
      messagge_count: 7,
      user_name: "\u65E0\u5948",
      user_message: "\u4F60\u4ECA\u5929\u5403\u7684\u662F\u4EC0\u4E48",
      message_time: Date.now() - 2e5,
      is_top: false
    },
    {
      id: 2,
      image_src: "../../../static/logo1.png",
      messagge_count: 3,
      user_name: "\u6B66\u57CE",
      user_message: "\u57CE\u5899\u539A\u5B9E",
      message_time: Date.now() - 12e4,
      is_top: false
    },
    {
      id: 3,
      image_src: "../../../static/logo.png",
      messagge_count: 1,
      user_name: "\u4E4C\u6765",
      user_message: "\u4E4C\u62C9",
      message_time: Date.now() - 15e4,
      is_top: false
    },
    {
      id: 4,
      image_src: "../../../static/logo1.png",
      messagge_count: 0,
      user_name: "\u8389\u5A1C",
      user_message: "\u6211\u6765\u8FA3",
      message_time: Date.now() - 34e4,
      is_top: false
    },
    {
      id: 5,
      image_src: "../../../static/logo.png",
      messagge_count: 1,
      user_name: "\u963F\u82B3",
      user_message: "\u4F60\u597D\uFF0C\u6211\u54E6\u662F\u963F\u82B3",
      message_time: Date.now() - 15e4,
      is_top: false
    },
    {
      id: 6,
      image_src: "../../../static/logo1.png",
      messagge_count: 0,
      user_name: "\u73CD\u59AE\u7279",
      user_message: "\u8D77\u98DE",
      message_time: Date.now() - 34e4,
      is_top: false
    },
    {
      id: 7,
      image_src: "../../../static/logo.png",
      messagge_count: 1,
      user_name: "\u874E\u5B50\u83B1\u83B1",
      user_message: "\u6211\u4F1A\u53D8\u8EAB",
      message_time: Date.now() - 15e4,
      is_top: false
    },
    {
      id: 8,
      image_src: "../../../static/logo1.png",
      messagge_count: 0,
      user_name: "\u708E\u9F99\u94E0\u7532",
      user_message: "\u708E\u9F99\u4E4B\u529B",
      message_time: Date.now() - 34e4,
      is_top: false
    }
  ];
  const _sfc_main$c = {
    components: {
      YxToolBar,
      chatItem,
      YxPopup
    },
    mounted() {
    },
    data() {
      return {
        curUser: {},
        userList,
        userTopList: [],
        popData: [],
        popPosition: {},
        popShow: false,
        popIsDark: false,
        touchStartTime: 0
      };
    },
    methods: {
      goChat(user) {
        uni.navigateTo({
          url: `/pages/chat-detail/chat-detail?id=${user.id}&name=${user.user_name}`
        });
      },
      handleTouch(user, e) {
        this.touchStartTime = e.timeStamp;
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        const maxY = device.screenHeight;
        x = x + 130 > maxX ? maxX - 130 : x;
        y = y + 100 > maxY ? maxY - 100 : y;
        y = y - 60 < 0 ? 60 : y;
        this.popPosition = { x, y };
      },
      handleLeave(user, e) {
        const endTime = e.timeStamp;
        if (endTime - this.touchStartTime > 400) {
          this.popShow = true;
          this.popIsDark = false;
          this.curUser = user;
          formatAppLog("log", "at pages/tabbar/chat/chat.vue:100", "@user", user);
          this.popData = [
            {
              id: 1,
              icon: "",
              content: user.is_top ? "\u53D6\u6D88\u7F6E\u9876" : "\u8BBE\u4E3A\u7F6E\u9876",
              event: user.is_top ? "undoTop" : "setTop"
            },
            {
              id: 2,
              icon: "",
              content: "\u5220\u9664\u8BE5\u804A\u5929",
              event: "delChat"
            }
          ];
        }
      },
      handlePopHide() {
        this.popShow = false;
      },
      popAction(event) {
        switch (event) {
          case "delChat":
            this.userList = this.userList.filter((user) => user.id != this.curUser.id);
            this.userTopList = this.userTopList.filter((user) => user.id != this.curUser.id);
            return;
          case "undoTop":
            this.userTopList = this.userTopList.filter((user) => user.id != this.curUser.id);
            this.userList.forEach((user) => {
              if (user.id === this.curUser.id) {
                user.is_top = false;
              }
            });
            return;
          case "setTop":
            this.curUser.is_top = true;
            this.userTopList.unshift(__spreadValues({}, this.curUser));
            this.userList.forEach((user) => {
              if (user.id === this.curUser.id)
                user.is_top = true;
            });
            return;
          default:
            formatAppLog("log", "at pages/tabbar/chat/chat.vue:145", "\u9519\u8BEF\u5F97\u4E8B\u4EF6\u8C03\u7528");
        }
      },
      clickNav() {
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        device.screenHeight;
        this.popPosition = { x: maxX - 160, y: 60 };
        this.popIsDark = true;
        this.popShow = true;
        formatAppLog("log", "at pages/tabbar/chat/chat.vue:156", "@clickNav");
        this.popData = [
          {
            id: 1,
            icon: "icon-chat1",
            content: "\u53D1\u8D77\u7FA4\u804A"
          },
          {
            id: 2,
            icon: "icon-adduser",
            content: "\u6DFB\u52A0\u670B\u53CB"
          },
          {
            id: 3,
            icon: "icon-saoyisao",
            content: "\u626B\u4E00\u626B"
          },
          {
            id: 4,
            icon: "icon-shoufukuan1",
            content: "\u6536\u4ED8\u6B3E"
          },
          {
            id: 5,
            icon: "icon-help",
            content: "\u5E2E\u52A9\u4E0E\u53CD\u9988"
          }
        ];
      }
    },
    computed: {
      userCount() {
        return this.userList.length;
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_tool_bar = vue.resolveComponent("yx-tool-bar");
    const _component_chat_item = vue.resolveComponent("chat-item");
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_yx_tool_bar, {
        onClickNav: $options.clickNav,
        title: `\u5FAE\u4FE1(${$options.userCount})`,
        isSelf: ""
      }, null, 8, ["onClickNav", "title"]),
      vue.createCommentVNode(' <yx-tool-bar  :title="`\u5FAE\u4FE1(${userCount})`"></yx-tool-bar> '),
      vue.createCommentVNode(" \u7F6E\u9876\u804A\u5929 "),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "true",
        class: "position-fixed",
        style: { "top": "100rpx", "bottom": "100rpx" }
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.userTopList, (user) => {
          return vue.openBlock(), vue.createBlock(_component_chat_item, {
            key: user.id,
            user,
            onClick: ($event) => $options.goChat(user),
            onTouchstart: (e) => $options.handleTouch(user, e),
            onTouchend: (e) => $options.handleLeave(user, e),
            class: "bg-common",
            "hover-class": "bg-dark"
          }, null, 8, ["user", "onClick", "onTouchstart", "onTouchend"]);
        }), 128)),
        vue.createCommentVNode(" \u5E38\u89C4\u804A\u5929 "),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.userList, (user) => {
          return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
            key: user.id
          }, [
            !user.is_top ? (vue.openBlock(), vue.createBlock(_component_chat_item, {
              key: 0,
              user,
              onClick: ($event) => $options.goChat(user),
              onTouchstart: (e) => $options.handleTouch(user, e),
              onTouchend: (e) => $options.handleLeave(user, e)
            }, null, 8, ["user", "onClick", "onTouchstart", "onTouchend"])) : vue.createCommentVNode("v-if", true)
          ], 64);
        }), 128))
      ]),
      vue.createVNode(_component_yx_popup, {
        show: $data.popShow,
        popPosittion: $data.popPosition,
        isDark: $data.popIsDark,
        popItem: $data.popData,
        onAction: $options.popAction,
        onHide: $options.handlePopHide
      }, null, 8, ["show", "popPosittion", "isDark", "popItem", "onAction", "onHide"])
    ]);
  }
  var PagesTabbarChatChat = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/chat/chat.vue"]]);
  const _sfc_main$b = {
    name: "yx-list",
    props: {
      item: {
        type: Object,
        default: {
          title: "\u5C55\u793A",
          img: "/static/contact/1.pngg"
        }
      },
      title: [String],
      img: [String],
      icon: [String],
      isCell: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "flex justify-between align-center pl-2",
      style: { "height": "100rpx" }
    }, [
      $props.icon ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 0,
        class: vue.normalizeClass(`iconfont font-md ${$props.icon}`)
      }, null, 2)) : vue.createCommentVNode("v-if", true),
      $props.img ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        style: { "width": "60rpx", "height": "60rpx" }
      }, [
        vue.createElementVNode("image", {
          src: $props.img,
          style: { "width": "100%", "height": "100%" },
          mode: "aspectFill"
        }, null, 8, ["src"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", {
        class: "flex-1 border-bottom ml-2",
        style: { "line-height": "70rpx", "font-size": "26rpx" }
      }, vue.toDisplayString($props.title), 1),
      vue.renderSlot(_ctx.$slots, "suffix"),
      $props.isCell ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "iconfont icon-right mr-2"
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  var YxList = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-list.vue"]]);
  const _sfc_main$a = {
    name: "yx-divider",
    data() {
      return {};
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { style: { "height": "30rpx", "width": "100%", "background-color": "#f1eced" } });
  }
  var YxDivider = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-divider.vue"]]);
  const _sfc_main$9 = {
    components: { YxList, YxDivider },
    data() {
      return {
        data: [
          [
            {
              id: 0,
              title: "\u670B\u53CB\u5708",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            },
            {
              id: 12,
              title: "\u5C0F\u7A0B\u5E8F",
              icon: "icon-xiaochengxu",
              isCell: true
            }
          ],
          [
            {
              id: 1,
              title: "\u626B\u4E00\u626B",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true,
              suffix: {
                content: "\u5185\u5BB9"
              }
            }
          ],
          [
            {
              id: 2,
              title: "\u6E38\u620F",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ],
          [
            {
              id: 3,
              title: "\u8D2D\u7269",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ],
          [
            {
              id: 4,
              title: "\u770B\u4E00\u770B",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ]
        ]
      };
    },
    methods: {}
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_list = vue.resolveComponent("yx-list");
    const _component_yx_divider = vue.resolveComponent("yx-divider");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.data, (group) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(group, (d) => {
            return vue.openBlock(), vue.createBlock(_component_yx_list, {
              style: { "background-color": "white" },
              key: d.id,
              "hover-class": "main-bg-hover-color",
              title: d.title,
              isCell: d.isCell,
              icon: d.icon
            }, {
              suffix: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(d.suffix && d.suffix.content), 1)
              ]),
              _: 2
            }, 1032, ["title", "isCell", "icon"]);
          }), 128)),
          vue.createVNode(_component_yx_divider)
        ], 64);
      }), 256))
    ]);
  }
  var PagesTabbarFindFind = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/find/find.vue"]]);
  const _sfc_main$8 = {
    name: "yx-card",
    props: {
      img: [String],
      title: [String],
      desc: [String]
    },
    data() {
      return {};
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "flex justify-between p-3",
      "hover-class": "bg-common",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      vue.createElementVNode("image", {
        class: "rounded size-1",
        src: $props.img,
        mode: "aspectFill"
      }, null, 8, ["src"]),
      vue.createElementVNode("view", { class: "flex flex-1 ml-2 flex-column justify-between" }, [
        vue.createElementVNode("view", { class: "text-ellipsis font-md text-dark text-primary" }, vue.toDisplayString($props.title), 1),
        vue.createElementVNode("view", { class: "text-ellipsis font-sm text-common mb-1" }, vue.toDisplayString($props.desc), 1)
      ]),
      vue.createElementVNode("view", { class: "font-sm text-common" }, [
        vue.renderSlot(_ctx.$slots, "right")
      ])
    ]);
  }
  var YxCard = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-card.vue"]]);
  const _sfc_main$7 = {
    components: { YxCard, YxDivider, YxList },
    data() {
      return {
        data: [
          [
            {
              id: 2,
              title: "\u652F\u4ED8",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ],
          [
            {
              id: 0,
              title: "\u6536\u85CF",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            },
            {
              id: 12,
              title: "\u76F8\u518C",
              icon: "icon-xiaochengxu",
              isCell: true
            },
            {
              id: 1,
              title: "\u8868\u60C5",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true,
              suffix: {
                content: "\u5185\u5BB9"
              }
            }
          ],
          [
            {
              id: 2,
              title: "\u8BBE\u7F6E",
              icon: "icon-iconfontzhizuobiaozhunbduan36",
              isCell: true
            }
          ]
        ]
      };
    },
    methods: {}
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_card = vue.resolveComponent("yx-card");
    const _component_yx_divider = vue.resolveComponent("yx-divider");
    const _component_yx_list = vue.resolveComponent("yx-list");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { style: { "width": "100%", "height": "150rpx", "background-color": "white" } }, [
        vue.createElementVNode("text", {
          class: "iconfont icon-help position-fixed",
          style: { "right": "20rpx", "top": "30rpx" }
        })
      ]),
      vue.createVNode(_component_yx_card, {
        img: "/static/logo.png",
        title: "\u695A\u4E91",
        desc: "\u6D4B\u8BD5\u6570\u636E"
      }, {
        right: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "mt-3" }, [
            vue.createElementVNode("text", { class: "iconfont icon-saoyisao font-lg" }),
            vue.createElementVNode("text", { class: "iconfont icon-right font-lg" })
          ])
        ]),
        _: 1
      }),
      vue.createVNode(_component_yx_divider),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.data, (group) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(group, (d) => {
            return vue.openBlock(), vue.createBlock(_component_yx_list, {
              key: d.id,
              "hover-class": "bg-dark",
              title: d.title,
              isCell: d.isCell,
              icon: d.icon
            }, {
              suffix: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(d.suffix && d.suffix.content), 1)
              ]),
              _: 2
            }, 1032, ["title", "isCell", "icon"]);
          }), 128)),
          vue.createVNode(_component_yx_divider)
        ], 64);
      }), 256))
    ]);
  }
  var PagesTabbarUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/user/user.vue"]]);
  const _sfc_main$6 = {
    components: { YxToolBar, YxList },
    data() {
      return {
        base_com: [
          {
            id: 1,
            img: "/static/contact/1.png",
            title: "\u7FA4\u804A"
          },
          {
            id: 2,
            img: "/static/contact/2.png",
            title: "\u6807\u7B7E"
          },
          {
            id: 3,
            img: "/static/contact/3.png",
            title: "\u65B0\u589E\u670B\u53CB"
          }
        ],
        friend_list: [
          {
            id: 1,
            img: "/static/contact/1.png",
            title: "\u963F\u8BDA"
          },
          {
            id: 2,
            img: "/static/contact/1.png",
            title: "\u9F99\u4E0E\u864E"
          },
          {
            id: 3,
            img: "/static/contact/1.png",
            title: "\u7EEA\u8BBA"
          },
          {
            id: 4,
            img: "/static/contact/1.png",
            title: "\u6768\u54E5"
          },
          {
            id: 5,
            img: "/static/contact/1.png",
            title: "\u590F\u65E5\u91CD\u73B0"
          },
          {
            id: 6,
            img: "/static/contact/1.png",
            title: "\u6F6E"
          },
          {
            id: 7,
            img: "/static/contact/1.png",
            title: "\u843D"
          }
        ]
      };
    },
    methods: {}
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_tool_bar = vue.resolveComponent("yx-tool-bar");
    const _component_yx_list = vue.resolveComponent("yx-list");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_yx_tool_bar, { title: "\u901A\u8BAF\u5F55" }),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.base_com, (item) => {
        return vue.openBlock(), vue.createBlock(_component_yx_list, {
          key: item.id,
          img: item.img,
          title: item.title
        }, null, 8, ["img", "title"]);
      }), 128)),
      vue.createElementVNode("view", { class: "font-md p-2 bg-common" }, "\u597D\u53CB\u5217\u8868"),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.friend_list, (item) => {
        return vue.openBlock(), vue.createBlock(_component_yx_list, {
          key: item.id,
          img: item.img,
          title: item.title
        }, null, 8, ["img", "title"]);
      }), 128))
    ]);
  }
  var PagesTabbarFriendFriend = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/friend/friend.vue"]]);
  const _sfc_main$5 = {
    name: "yx-nav-bar",
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {};
    },
    methods: {
      back() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("view", { class: "flex justify-between align-center p-2 bg-white fixed-top" }, [
        vue.createElementVNode("view", {
          id: "back-sign",
          class: "icon-left iconfont mr-2",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.back && $options.back(...args))
        }),
        vue.createElementVNode("view", {
          id: "user-view",
          class: "flex-1"
        }, vue.toDisplayString($props.title), 1),
        vue.createElementVNode("view", {
          id: "more-detail",
          class: "icon-ellipsis iconfont"
        })
      ]),
      vue.createCommentVNode(' <view style="margin-top: 90rpx;"></view> ')
    ], 2112);
  }
  var YxNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-nav-bar.vue"]]);
  const _sfc_main$4 = {
    name: "yx-chat-item-content",
    inject: ["isValidSetTouch"],
    props: {
      chatMessage: [Object]
    },
    mounted() {
    },
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      onTouchstart: _cache[0] || (_cache[0] = ($event) => $options.isValidSetTouch($props.chatMessage)),
      style: { "overflow": "auto" },
      class: "font-md"
    }, [
      $props.chatMessage.type === "text" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "text-overflow-line p-1"
      }, [
        vue.createElementVNode("view", {
          innerHTML: $props.chatMessage.data
        }, null, 8, ["innerHTML"]),
        vue.createCommentVNode(" {{}} ")
      ])) : vue.createCommentVNode("v-if", true),
      $props.chatMessage.type === "image" ? (vue.openBlock(), vue.createElementBlock("image", {
        key: 1,
        mode: "aspectFill",
        src: $props.chatMessage.data,
        style: { "height": "250rpx", "width": "140rpx" }
      }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
    ], 32);
  }
  var YxChatItemContent = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-item-content.vue"]]);
  const _sfc_main$3 = {
    name: "yx-chat-item-detail",
    components: {
      YxChatItemContent
    },
    props: {
      chatMessage: {
        type: Object,
        default: {
          user_id: 0,
          type: "image",
          message_time: Date.now() - 1e4,
          data: "/static/images/bg.jpg",
          user_image: "/static/logo.png",
          showTime: true
        }
      }
    },
    mounted() {
    },
    data() {
      return {};
    },
    methods: {},
    computed: {
      time() {
        return dayjs(this.chatMessage.message_time).format("YYYY\u5E74MM\u6708DD\u65E5 HH:mm");
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_chat_item_content = vue.resolveComponent("yx-chat-item-content");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $props.chatMessage.showTime && !$props.chatMessage.isDel ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 0,
        class: "ele-center mb-2 font-sm text-common"
      }, [
        vue.createCommentVNode(" 2022\u5E7412\u670813\u65E5 13:21 "),
        vue.createTextVNode(vue.toDisplayString($options.time), 1)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u6211\u65B9\u4FE1\u606F "),
      $props.chatMessage.user_id == 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "flex justify-end p-2 position-relative"
      }, [
        vue.createCommentVNode(" \u4E09\u89D2 "),
        vue.createElementVNode("view", {
          id: "me-triangle",
          class: "position-absolute left-triangle",
          style: { "top": "40rpx", "right": "81rpx", "border-left-color": "#08c060" }
        }),
        vue.createElementVNode("view", {
          class: "mr-2 font-small main-bg-color p-1 rounded",
          style: { "line-height": "38rpx", "min-height": "40rpx", "max-width": "600rpx" }
        }, [
          vue.createVNode(_component_yx_chat_item_content, { chatMessage: $props.chatMessage }, null, 8, ["chatMessage"])
        ]),
        vue.createElementVNode("image", {
          src: $props.chatMessage.user_image,
          mode: "scaleToFill",
          style: { "width": "60rpx", "height": "60rpx" }
        }, null, 8, ["src"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u5BF9\u65B9\u4FE1\u606F "),
      $props.chatMessage.user_id != 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "flex justify-start p-2 position-relative"
      }, [
        vue.createCommentVNode(" \u4E09\u89D2 "),
        vue.createElementVNode("view", {
          id: "other-triangle",
          class: "position-absolute right-triangle",
          style: { "top": "40rpx", "left": "81rpx", "border-right-color": "white" }
        }),
        vue.createElementVNode("image", {
          src: $props.chatMessage.user_image,
          mode: "scaleToFill",
          style: { "width": "60rpx", "height": "60rpx" }
        }, null, 8, ["src"]),
        vue.createElementVNode("view", {
          class: "ml-2 font-small bg-white p-1 rounded",
          style: { "line-height": "38rpx", "min-height": "40rpx", "max-width": "600rpx" }
        }, [
          vue.createVNode(_component_yx_chat_item_content, { chatMessage: $props.chatMessage }, null, 8, ["chatMessage"])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u4FE1\u606F\u88AB\u64A4\u56DE "),
      $props.chatMessage.isUndone ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "flex justify-center align-center text-common font-sm m-2"
      }, " \u8BE5\u6D88\u606F\u5DF2\u64A4\u56DE ")) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" \u6D88\u606F\u5185\u5BB9\u7C7B\u578B(\u6587\u672C\uFF0C\u8BED\u97F3\uFF0C\u56FE\u7247\uFF0C\u89C6\u9891) ")
    ]);
  }
  var YxChatItemDetail = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-item-detail.vue"]]);
  const _sfc_main$2 = {
    name: "yx-chat-detail-input",
    emits: ["syn", "addMessage", "activeUtil", "hide"],
    props: {},
    mounted() {
      this.getInputHeight();
      this.autoFocus = true;
    },
    data() {
      return {
        chatInputHeight: 0,
        curLine: 1,
        inputContent: "",
        textareaParams: {
          minHeight: 40,
          maxHeight: 150
        },
        keyboardHeight: 0,
        activeKeyboardHeight: 549,
        originVal: 105,
        stepVal: 55,
        inputChangeHeight: 0,
        isText: false,
        isOpenSwipeUtil: false,
        isOpenEmo: false,
        isFocus: false
      };
    },
    methods: {
      gobackOriginSize() {
        this.chatInputHeight = this.originVal;
      },
      getInputHeight(event = "keyboard") {
        switch (event) {
          case "keyboard":
            if (this.curLine == 1) {
              this.chatInputHeight = this.originVal;
            } else {
              this.chatInputHeight = this.increamentVal + this.originVal;
            }
            if (this.keyboardHeight > 0) {
              this.chatInputHeight += this.keyboardHeight + 90;
            }
            break;
          case "util":
            this.chatInputHeight = this.activeKeyboardHeight + this.originVal + this.stepVal;
            break;
          default:
            formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:98", "\u9519\u8BEF\u7684\u4E8B\u4EF6");
            break;
        }
        this.$emit("syn");
      },
      activeUtilSwiper() {
        this.isOpenSwipeUtil = true;
        this.$emit("activeUtil", "utils");
        this.getInputHeight("util");
      },
      activeEmot() {
        this.isOpenEmo = true;
        this.$emit("activeUtil", "emo");
        this.getInputHeight("util");
      },
      textareaLineChangeHandle(e) {
        formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:118", "lineChange", e);
        this.curLine = e.detail.lineCount;
        this.inputChangeHeight = e.detail.height;
        this.getInputHeight();
      },
      textareaInputChange(e) {
      },
      sendMessage() {
        if (!this.inputContent)
          return;
        formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:133", "@content---", this.inputContent);
        this.$emit("addMessage", this.inputContent);
        this.inputContent = "";
        this.isOpenEmo = false;
        this.isOpenSwipeUtil = false;
        this.$emit("hide");
      },
      keyboardHeightChangeHandle(e) {
        formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:141", "@keyboard", e);
        const height = e.detail.height;
        if (!this.keyboardHeight && height) {
          this.keyboardHeight = height + 200;
        }
        const isPullState = height > 0;
        if (isPullState) {
          this.isFocus = true;
          this.chatInputHeight += this.keyboardHeight;
        } else {
          this.chatInputHeight -= this.keyboardHeight;
          this.keyboardHeight = 0;
          this.isFocus = false;
          this.isOpenEmo = false;
          this.isOpenSwipeUtil = false;
          this.$emit("hide");
        }
        this.getInputHeight();
      }
    },
    watch: {
      inputContent: {
        handler() {
          formatAppLog("log", "at components/chat/yx-chat-detail-input.vue:171", "\u76D1\u542C\u5230\u957F\u5EA6\u53D8\u5316", this.inputContent.length);
          this.isText = this.inputContent.length > 0;
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      minHeight() {
        return this.textareaParams.minHeight;
      },
      maxHeight() {
        return this.textareaParams.maxHeight;
      },
      inputHeight() {
        return this.isFocus || this.isOpenEmo || this.isOpenSwipeUtil ? this.activeKeyboardHeight + 50 : 0;
      },
      increamentVal() {
        let res = this.inputChangeHeight > this.maxHeight - this.stepVal ? this.maxHeight - this.minHeight : this.inputChangeHeight - this.minHeight + this.stepVal;
        return res;
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "fixed-bottom bg-white-four-deep flex justify-between align-center p-1",
      style: vue.normalizeStyle(`min-height:60rpx;bottom:${$options.inputHeight}rpx`),
      ref: "inputRef",
      id: "chat-input"
    }, [
      vue.createElementVNode("view", {
        id: "record-sign",
        class: vue.normalizeClass(["icon-keyboard iconfont mr-1 font-lg", "icon-keyboard"])
      }),
      vue.createElementVNode("view", {
        id: "input",
        class: "flex-1 p-1"
      }, [
        vue.withDirectives(vue.createElementVNode("textarea", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.inputContent = $event),
          "auto-height": "",
          class: "flex-1 bg-white-one-deep p-1 rounded",
          onLinechange: _cache[1] || (_cache[1] = (...args) => $options.textareaLineChangeHandle && $options.textareaLineChangeHandle(...args)),
          onInput: _cache[2] || (_cache[2] = (...args) => $options.textareaInputChange && $options.textareaInputChange(...args)),
          onKeyboardheightchange: _cache[3] || (_cache[3] = (...args) => $options.keyboardHeightChangeHandle && $options.keyboardHeightChangeHandle(...args)),
          style: vue.normalizeStyle(`min-height: ${$options.minHeight}rpx;max-height:${$options.maxHeight}rpx;width: 95%;overflow:auto`),
          maxlength: -1,
          "placeholder-style": "color:#F76260",
          "adjust-position": false
        }, null, 36), [
          [vue.vModelText, $data.inputContent]
        ])
      ]),
      vue.createElementVNode("view", {
        id: "more-operate",
        class: "mr-2"
      }, [
        vue.createElementVNode("text", {
          class: "iconfont icon-smile font-lg mr-1 vertical-middle",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.activeEmot && $options.activeEmot(...args))
        }),
        !$data.isText ? (vue.openBlock(), vue.createElementBlock("text", {
          key: 0,
          class: "iconfont icon-add font-lg p-1 vertical-middle",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.activeUtilSwiper && $options.activeUtilSwiper(...args))
        })) : vue.createCommentVNode("v-if", true),
        $data.isText ? (vue.openBlock(), vue.createElementBlock("text", {
          key: 1,
          class: "iconfont font-sm main-bg-color p-1 text-white",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.sendMessage && $options.sendMessage(...args))
        }, "\u53D1\u9001")) : vue.createCommentVNode("v-if", true)
      ])
    ], 4);
  }
  var YxChatDetailInput = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-detail-input.vue"]]);
  var chatMesssage = [
    {
      id: "a1",
      user_id: 0,
      type: "text",
      message_time: Date.now() - 1e6,
      isUndone: false,
      isDel: false,
      data: `33
				3
				3`,
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a1",
      user_id: 0,
      type: "image",
      message_time: Date.now() - 1e6,
      isUndone: false,
      isDel: false,
      data: "/static/images/bg.jpg",
      user_image: "/static/logo.png",
      showTime: true
    },
    {
      id: "a2",
      user_id: 1,
      type: "image",
      message_time: Date.now() - 1e4,
      isUndone: false,
      isDel: false,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo1.png",
      showTime: true
    },
    {
      id: "a3",
      user_id: 1,
      type: "image",
      isUndone: false,
      isDel: false,
      message_time: Date.now() - 1e4,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo1.png",
      showTime: true
    },
    {
      id: "a4",
      user_id: 1,
      type: "image",
      isUndone: false,
      isDel: false,
      message_time: Date.now() - 1e4,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo1.png",
      showTime: true
    },
    {
      id: "a6",
      user_id: 0,
      type: "image",
      isUndone: false,
      isDel: false,
      message_time: Date.now() + 2e7,
      data: "/static/images/nothing/no_pay.png",
      user_image: "/static/logo.png",
      showTime: true
    }
  ];
  const _sfc_main$1 = {
    components: {
      YxNavBar,
      YxChatItemDetail,
      YxChatDetailInput,
      YxPopup
    },
    provide() {
      return {
        isValidSetTouch: this.isValidSetTouch
      };
    },
    onLoad(query) {
      this.name = query.name;
      formatAppLog("log", "at pages/chat-detail/chat-detail.vue:40", "@\u663E\u793A\u5F97\u4E3A", query);
    },
    mounted() {
      formatAppLog("log", "at pages/chat-detail/chat-detail.vue:45", "@scrollView-mounted", this.$refs.inputBar.chatInputHeight);
      formatAppLog("log", "at pages/chat-detail/chat-detail.vue:46", "@\u952E\u76D8\u6FC0\u6D3B\u7684\u9AD8\u5EA6", this.$refs.inputBar.activeKeyboardHeight);
    },
    data() {
      return {
        name: "",
        scrollHeight: 1,
        scrollViewHeight: 0,
        userMessage: chatMesssage,
        curUserMessage: {},
        popData: [],
        popPosition: {},
        popIsDark: false,
        popShow: false,
        isValidTouch: false,
        touchTarget: "",
        touchStartTime: 0,
        isBottom: false,
        popupHeight: 0
      };
    },
    methods: {
      changeInputState(event) {
        this.isBottom = true;
        this.popShow = true;
        formatAppLog("log", "at pages/chat-detail/chat-detail.vue:86", "@\u952E\u76D8\u6FC0\u6D3B\u7684\u9AD8\u5EA6", this.$refs.inputBar.activeKeyboardHeight);
        this.popupHeight = this.$refs.inputBar.activeKeyboardHeight;
        this.popPosition = { x: 0, y: 0 };
        switch (event) {
          case "utils":
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:92", "utils\u64CD\u4F5C");
            break;
          case "emo":
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:95", "emo\u64CD\u4F5C");
            break;
          default:
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:98", "\u6CA1\u6709\u547D\u4E2D\u4E8B\u4EF6");
        }
      },
      addMessage(message) {
        const m = {
          id: Date.now(),
          user_id: 0,
          type: "text",
          message_time: Date.now(),
          isUndone: false,
          isDel: false,
          data: this.convertln(message),
          user_image: "/static/logo.png",
          showTime: true
        };
        const lastIndex = this.userMessage.length - 1;
        const preTime = this.userMessage[lastIndex].message_time;
        const timeLimit = 1e3 * 60 * 10;
        m.showTime = m.message_time - preTime > timeLimit;
        formatAppLog("log", "at pages/chat-detail/chat-detail.vue:131", "\u6ED1\u52A8");
        this.scrollBottom();
        this.userMessage.push(m);
      },
      scrollBottom() {
        setTimeout(() => {
          this.scrollHeight += 100;
        }, 1);
        setTimeout(() => {
          this.scrollHeight -= 100;
        }, 2);
      },
      convertln(target) {
        let res = "";
        const pattern = /\n/g;
        res = target.replace(pattern, "<p></p>");
        return res;
      },
      scroll(e) {
        this.scrollHeight = e.detail.scrollHeight;
      },
      actionHandle(event) {
        switch (event) {
          case "undo":
            this.curUserMessage.isUndone = true;
            break;
          case "del":
            this.curUserMessage.isDel = true;
            break;
          default:
            formatAppLog("log", "at pages/chat-detail/chat-detail.vue:173", "\u6CA1\u6709\u6B64\u4E8B\u4EF6");
            break;
        }
      },
      isValidSetTouch(target) {
        this.touchTarget = target;
        this.isValidTouch = true;
      },
      handleTouch(user, e) {
        if (this.isValidTouch) {
          this.touchStartTime = e.timeStamp;
        }
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        const device = uni.getSystemInfoSync();
        const maxX = device.screenWidth;
        const maxY = device.screenHeight;
        x = x + 130 > maxX ? maxX - 130 : x;
        y = y + 300 > maxY ? maxY - 300 : y;
        y = y - 50 < 0 ? 50 : y;
        this.popPosition = { x, y };
      },
      handleLeave(message, e) {
        const endTime = e.timeStamp;
        if (this.touchStartTime && endTime - this.touchStartTime > 400) {
          this.isBottom = false;
          this.curUserMessage = message;
          const undoLimitTime = 1e3 * 60 * 3;
          const allowUndo = Date.now() - this.touchTarget.message_time < undoLimitTime && this.touchTarget.user_id === 0;
          this.popData = [
            {
              id: 1,
              content: "\u590D\u5236"
            },
            {
              id: 2,
              content: "\u53D1\u9001\u7ED9\u670B\u53CB"
            },
            {
              id: 3,
              content: allowUndo ? "\u64A4\u56DE" : "",
              event: "undo"
            },
            {
              id: 4,
              content: "\u5220\u9664",
              event: "del"
            },
            {
              id: 5,
              content: "\u6536\u85CF"
            }
          ];
          this.popShow = true;
          this.touchStartTime = 0;
          this.isValidTouch = false;
        } else {
          this.popShow = false;
        }
      },
      handlePopHide() {
        this.popShow = false;
        if (this.isBottom) {
          this.$refs.inputBar.isOpenSwipeUtil = false;
          this.$refs.inputBar.isOpenEmo = false;
          this.$refs.inputBar.getInputHeight();
        }
      },
      synMoveDistance() {
        this.scrollViewHeight = this.$refs.inputBar.chatInputHeight;
        this.scrollBottom();
        formatAppLog("log", "at pages/chat-detail/chat-detail.vue:271", "\u5B8C\u6210\u53D8\u5316\u540C\u6B65", this.scrollViewHeight);
      }
    },
    computed: {
      userChatMessage() {
        this.userMessage[0].data = this.convertln(this.userMessage[0].data);
        for (let i = 1; i < this.userMessage.length; i++) {
          const curTime = this.userMessage[i].message_time;
          const preTime = this.userMessage[i - 1].message_time;
          const timeLimit = 1e3 * 60 * 10;
          this.userMessage[i].showTime = curTime - preTime > timeLimit;
          this.userMessage[i].data = this.convertln(this.userMessage[i].data);
        }
        return this.userMessage;
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_yx_nav_bar = vue.resolveComponent("yx-nav-bar");
    const _component_yx_chat_item_detail = vue.resolveComponent("yx-chat-item-detail");
    const _component_yx_chat_detail_input = vue.resolveComponent("yx-chat-detail-input");
    const _component_yx_popup = vue.resolveComponent("yx-popup");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" \u5BFC\u822A\u680F "),
      vue.createVNode(_component_yx_nav_bar, {
        title: this.name
      }, null, 8, ["title"]),
      vue.createCommentVNode(" \u6ED1\u52A8\u5185\u5BB9 "),
      vue.createElementVNode("scroll-view", {
        "scroll-y": "true",
        onScroll: _cache[0] || (_cache[0] = (...args) => $options.scroll && $options.scroll(...args)),
        "scroll-top": $data.scrollHeight,
        class: "position-fixed",
        style: vue.normalizeStyle(`top:95rpx;bottom:${$data.scrollViewHeight}rpx`)
      }, [
        vue.createCommentVNode(' \r\n		<scroll-view scroll-y="true" @scroll="scroll" :scroll-top="scrollHeight"\r\n		class="position-fixed" :style="`top:95rpx;bottom:${scrollViewHeight}rpx`"> '),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.userChatMessage, (message) => {
          return vue.openBlock(), vue.createBlock(_component_yx_chat_item_detail, {
            key: message.id,
            chatMessage: message,
            onTouchstart: (e) => $options.handleTouch(message, e),
            onTouchend: (e) => $options.handleLeave(message, e)
          }, null, 8, ["chatMessage", "onTouchstart", "onTouchend"]);
        }), 128))
      ], 44, ["scroll-top"]),
      vue.createCommentVNode(" \u8F93\u5165\u6846 "),
      vue.createVNode(_component_yx_chat_detail_input, {
        onAddMessage: $options.addMessage,
        ref: "inputBar",
        onHide: $options.handlePopHide,
        onSyn: $options.synMoveDistance,
        onActiveUtil: $options.changeInputState
      }, null, 8, ["onAddMessage", "onHide", "onSyn", "onActiveUtil"]),
      vue.createVNode(_component_yx_popup, {
        show: $data.popShow,
        popPosittion: $data.popPosition,
        popHeight: $data.popupHeight,
        isDark: $data.popIsDark,
        popItem: $data.popData,
        isBottom: $data.isBottom,
        onHide: $options.handlePopHide,
        onAction: $options.actionHandle
      }, null, 8, ["show", "popPosittion", "popHeight", "isDark", "popItem", "isBottom", "onHide", "onAction"])
    ]);
  }
  var PagesChatDetailChatDetail = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/pages/chat-detail/chat-detail.vue"]]);
  __definePage("pages/tabbar/chat/chat", PagesTabbarChatChat);
  __definePage("pages/tabbar/find/find", PagesTabbarFindFind);
  __definePage("pages/tabbar/user/user", PagesTabbarUserUser);
  __definePage("pages/tabbar/friend/friend", PagesTabbarFriendFriend);
  __definePage("pages/chat-detail/chat-detail", PagesChatDetailChatDetail);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/aLearning/project/\u804A\u5929/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
