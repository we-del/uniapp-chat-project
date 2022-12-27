"use strict";
var common_vendor = require("../../common/vendor.js");
const YxChatItemContent = () => "./yx-chat-item-content.js";
const _sfc_main = {
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
      return common_vendor.dayjs(this.chatMessage.message_time).format("YYYY\u5E74MM\u6708DD\u65E5 HH:mm");
    }
  }
};
if (!Array) {
  const _component_yx_chat_item_content = common_vendor.resolveComponent("yx-chat-item-content");
  _component_yx_chat_item_content();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.chatMessage.showTime && !$props.chatMessage.isDel
  }, $props.chatMessage.showTime && !$props.chatMessage.isDel ? {
    b: common_vendor.t($options.time)
  } : {}, {
    c: $props.chatMessage.user_id == 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone
  }, $props.chatMessage.user_id == 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone ? {
    d: common_vendor.p({
      chatMessage: $props.chatMessage
    }),
    e: $props.chatMessage.user_image
  } : {}, {
    f: $props.chatMessage.user_id != 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone
  }, $props.chatMessage.user_id != 0 && !$props.chatMessage.isDel && !$props.chatMessage.isUndone ? {
    g: $props.chatMessage.user_image,
    h: common_vendor.p({
      chatMessage: $props.chatMessage
    })
  } : {}, {
    i: $props.chatMessage.isUndone
  }, $props.chatMessage.isUndone ? {} : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-item-detail.vue"]]);
wx.createComponent(Component);
