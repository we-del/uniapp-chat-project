"use strict";
var common_vendor = require("../common/vendor.js");
const YxBadge = () => "./yx-badge.js";
const _sfc_main = {
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
      return common_vendor.dayjs(this.user.message_time).format("HH:mm");
    }
  }
};
if (!Array) {
  const _component_yx_badge = common_vendor.resolveComponent("yx-badge");
  _component_yx_badge();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.user.image_src,
    b: common_vendor.p({
      messageCount: $props.user.message_count
    }),
    c: common_vendor.t($props.user.user_name),
    d: common_vendor.t($props.user.user_message),
    e: common_vendor.t($options.time),
    f: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat-item.vue"]]);
wx.createComponent(Component);
