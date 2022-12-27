"use strict";
var common_vendor = require("../common/vendor.js");
const YxPopup = () => "./yx-popup.js";
const _sfc_main = {
  name: "yx-tool-bar",
  emits: ["clickNav"],
  props: {
    title: [String],
    isSelf: {
      type: Boolean,
      default: false
    }
  },
  components: { YxPopup },
  mounted() {
    if (!this.isSelf) {
      this.initPopup();
    }
    console.log("@tool", this);
  },
  data() {
    return {
      popShow: false,
      popPosition: {},
      popData: []
    };
  },
  methods: {
    initPopup() {
      const device = common_vendor.index.getSystemInfoSync();
      const maxX = device.screenWidth;
      device.screenHeight;
      this.popPosition = { x: maxX - 160, y: 60 };
      this.popIsDark = true;
      this.popShow = false;
      this.popData = [
        {
          id: 1,
          icon: "icon-chat1",
          content: "\u53D1\u8D77\u7FA4\u804A"
        },
        {
          id: 2,
          icon: "icon-adduser",
          content: "\u6DFB\u52A0\u670B\u53CB"
        },
        {
          id: 3,
          icon: "icon-saoyisao",
          content: "\u626B\u4E00\u626B"
        },
        {
          id: 4,
          icon: "icon-shoufukuan1",
          content: "\u6536\u4ED8\u6B3E"
        },
        {
          id: 5,
          icon: "icon-help",
          content: "\u5E2E\u52A9\u4E0E\u53CD\u9988"
        }
      ];
    },
    showPopup() {
      this.popShow = true;
    },
    handleClick() {
      console.log("@clickcc", this);
      if (this.isSelf) {
        this.$emit("clickNav");
      } else {
        this.showPopup();
      }
    }
  }
};
if (!Array) {
  const _component_yx_popup = common_vendor.resolveComponent("yx-popup");
  _component_yx_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.title),
    b: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    c: !$props.isSelf
  }, !$props.isSelf ? {
    d: common_vendor.o(($event) => $data.popShow = false),
    e: common_vendor.p({
      popItem: $data.popData,
      popPosittion: $data.popPosition,
      show: $data.popShow,
      isDark: true
    })
  } : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/components/yx-tool-bar.vue"]]);
wx.createComponent(Component);
