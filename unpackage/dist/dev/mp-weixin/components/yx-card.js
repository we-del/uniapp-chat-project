"use strict";
var common_vendor = require("../common/vendor.js");
const _sfc_main = {
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.img,
    b: common_vendor.t($props.title),
    c: common_vendor.t($props.desc),
    d: common_vendor.o((...args) => _ctx.handleClick && _ctx.handleClick(...args))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-card.vue"]]);
wx.createComponent(Component);
