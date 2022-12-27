"use strict";
var common_vendor = require("../common/vendor.js");
const _sfc_main = {
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($options.count)
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-badge.vue"]]);
wx.createComponent(Component);
