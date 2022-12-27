"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "yx-chat-item-content",
  inject: ["isValidSetTouch"],
  props: {
    chatMessage: [Object]
  },
  mounted() {
    console.log("content", this);
  },
  data() {
    return {};
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.chatMessage.type === "text"
  }, $props.chatMessage.type === "text" ? {
    b: $props.chatMessage.data
  } : {}, {
    c: $props.chatMessage.type === "image"
  }, $props.chatMessage.type === "image" ? {
    d: $props.chatMessage.data
  } : {}, {
    e: common_vendor.o(($event) => $options.isValidSetTouch($props.chatMessage))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-item-content.vue"]]);
wx.createComponent(Component);
