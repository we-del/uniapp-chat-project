"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
          console.log("\u9519\u8BEF\u7684\u4E8B\u4EF6");
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
      console.log("lineChange", e);
      this.curLine = e.detail.lineCount;
      this.inputChangeHeight = e.detail.height;
      this.getInputHeight();
    },
    handleFocus() {
      this.isOpenEmo = false;
      this.isOpenSwipeUtil = false;
      this.$emit("hide");
    },
    textareaInputChange(e) {
    },
    sendMessage() {
      if (!this.inputContent)
        return;
      console.log("@content---", this.inputContent);
      console.log(this.inputContent);
      this.$emit("addMessage", this.inputContent, "text");
      this.inputContent = "";
    },
    keyboardHeightChangeHandle(e) {
      console.log("@keyboard", e);
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
        console.log("\u76D1\u542C\u5230\u957F\u5EA6\u53D8\u5316", this.inputContent.length);
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n("icon-keyboard"),
    b: common_vendor.o((...args) => $options.textareaLineChangeHandle && $options.textareaLineChangeHandle(...args)),
    c: common_vendor.o((...args) => $options.handleFocus && $options.handleFocus(...args)),
    d: common_vendor.o([($event) => $data.inputContent = $event.detail.value, (...args) => $options.textareaInputChange && $options.textareaInputChange(...args)]),
    e: common_vendor.o((...args) => $options.keyboardHeightChangeHandle && $options.keyboardHeightChangeHandle(...args)),
    f: common_vendor.s(`min-height: ${$options.minHeight}rpx;max-height:${$options.maxHeight}rpx;width: 95%;overflow:auto`),
    g: -1,
    h: $data.inputContent,
    i: common_vendor.o((...args) => $options.activeEmot && $options.activeEmot(...args)),
    j: !$data.isText
  }, !$data.isText ? {
    k: common_vendor.o((...args) => $options.activeUtilSwiper && $options.activeUtilSwiper(...args))
  } : {}, {
    l: $data.isText
  }, $data.isText ? {
    m: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  } : {}, {
    n: common_vendor.s(`min-height:60rpx;bottom:${$options.inputHeight}rpx`)
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/chat/yx-chat-detail-input.vue"]]);
wx.createComponent(Component);
