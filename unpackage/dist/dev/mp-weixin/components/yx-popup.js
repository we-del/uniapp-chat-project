"use strict";
var common_vendor = require("../common/vendor.js");
const _sfc_main = {
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
    },
    popupContentOfUtilInBottom: [Array],
    utilArr: [Array],
    emoArr: [Array],
    bottomMode: [String],
    bottomClickTransition: [Boolean]
  },
  data() {
    return {};
  },
  methods: {
    handleReactive(item) {
      console.log("\u6307\u4EE4\u5373\u5C06\u4FEE\u6539\u66F4\u6539", item);
      this.$emit("action", item.event);
      this.$emit("hide");
    },
    hide() {
      console.log("\u6211\u6765\u5B8C\u6210\u9690\u85CF");
      this.$emit("hide");
    }
  },
  computed: {
    position() {
      return !this.isBottom ? `left:${this.popPosittion.x}px;top:${this.popPosittion.y}px` : `left:${this.popPosittion.x}px;bottom:${this.popPosittion.y}px`;
    },
    styleCustom() {
      let res = "";
      if (this.isBottom) {
        res += this.isBottom ? " fixed-bottom  bg-common " : " border ";
      } else {
        res += this.isDark ? " bg-dark text-white " : "bg-white text-dark ";
      }
      return res;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.isBottom
  }, !$props.isBottom ? {
    b: common_vendor.f($props.popItem, (item, i, i0) => {
      return common_vendor.e({
        a: item.icon
      }, item.icon ? {
        b: common_vendor.n(item.icon)
      } : {}, {
        c: item.content
      }, item.content ? {
        d: common_vendor.t(item.content)
      } : {}, {
        e: common_vendor.o(($event) => $options.handleReactive(item), item.id),
        f: item.id,
        g: common_vendor.s(i !== $props.popItem.length - 1 && item.content ? "margin-bottom:30rpx" : "")
      });
    })
  } : {}, {
    c: $props.isBottom
  }, $props.isBottom ? {
    d: common_vendor.s(`height:${$props.popHeight}rpx;width:100%;`)
  } : {}, {
    e: common_vendor.n($options.styleCustom),
    f: common_vendor.s($props.show ? `display:block;${$options.position}` : `display:none;${$options.position};`),
    g: common_vendor.o((...args) => $options.hide && $options.hide(...args)),
    h: common_vendor.s($props.show ? "display:block" : "display:none")
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-popup.vue"]]);
wx.createComponent(Component);
