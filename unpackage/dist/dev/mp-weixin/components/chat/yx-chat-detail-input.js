"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "yx-chat-detail-input",
  emits: ["syn", "addMessage"],
  mounted() {
    this.getInputHeight();
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
      keyboardHeight: 0
    };
  },
  methods: {
    getInputHeight(row = 1, height) {
      console.log("@doc", document);
      const originVal = 105;
      if (row == 1) {
        this.chatInputHeight = originVal;
      } else {
        const stepVal = 55;
        let increamentVal = height > this.maxHeight - stepVal ? this.maxHeight - this.minHeight : height - this.minHeight + stepVal;
        this.chatInputHeight = increamentVal + originVal;
      }
      this.$emit("syn");
    },
    textareaLineChangeHandle(e) {
      console.log("lineChange", e);
      this.curLine = e.detail.lineCount;
      const height = e.detail.height;
      this.getInputHeight(e.detail.lineCount, height);
    },
    textareaInputChange(e) {
      console.log("change", e);
      this.inputContent = e.detail.value;
    },
    sendMessage() {
      if (!this.inputContent)
        return;
      console.log("@content---", this.inputContent);
      this.$emit("addMessage", this.inputContent);
      this.inputContent = "";
    },
    keyboardHeightChangeHandle(e) {
      console.log("@keyboard", e);
      const height = e.detail.height;
      if (!this.keyboardHeight && height) {
        this.keyboardHeight = height;
      }
      if (height > 0) {
        this.chatInputHeight += this.keyboardHeight;
      } else {
        this.chatInputHeight -= this.keyboardHeight;
      }
      this.$emit("syn");
    }
  },
  computed: {
    minHeight() {
      return this.textareaParams.minHeight;
    },
    maxHeight() {
      return this.textareaParams.maxHeight;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n("icon-keyboard"),
    b: common_vendor.o((...args) => $options.textareaLineChangeHandle && $options.textareaLineChangeHandle(...args)),
    c: common_vendor.s(`min-height: ${$options.minHeight}rpx;max-height:${$options.maxHeight}rpx;width: 95%;overflow:auto`),
    d: -1,
    e: common_vendor.o((...args) => $options.keyboardHeightChangeHandle && $options.keyboardHeightChangeHandle(...args)),
    f: $data.inputContent,
    g: common_vendor.o(($event) => $data.inputContent = $event.detail.value)
  }, {}, {
    i: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-detail-input.vue"]]);
wx.createComponent(Component);
