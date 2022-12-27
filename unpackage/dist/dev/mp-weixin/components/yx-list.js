"use strict";
var common_vendor = require("../common/vendor.js");
const _sfc_main = {
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.icon
  }, $props.icon ? {
    b: common_vendor.n(`iconfont font-md ${$props.icon}`)
  } : {}, {
    c: $props.img
  }, $props.img ? {
    d: $props.img
  } : {}, {
    e: common_vendor.t($props.title),
    f: $props.isCell
  }, $props.isCell ? {} : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-list.vue"]]);
wx.createComponent(Component);
