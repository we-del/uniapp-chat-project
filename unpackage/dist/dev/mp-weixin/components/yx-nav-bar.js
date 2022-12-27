"use strict";
var common_vendor = require("../common/vendor.js");
const _sfc_main = {
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
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.back && $options.back(...args)),
    b: common_vendor.t($props.title)
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-nav-bar.vue"]]);
wx.createComponent(Component);
