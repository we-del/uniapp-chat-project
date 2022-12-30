"use strict";
var common_vendor = require("../../common/vendor.js");
var static_testData_chatMessage = require("../../static/testData/chatMessage.js");
var static_testData_chatUtils = require("../../static/testData/chatUtils.js");
var static_testData_chatEmo = require("../../static/testData/chatEmo.js");
const YxNavBar = () => "../../components/yx-nav-bar.js";
const YxChatItemDetail = () => "../../components/chat/yx-chat-item-detail.js";
const YxChatDetailInput = () => "../../components/chat/yx-chat-detail-input.js";
const YxPopup = () => "../../components/yx-popup.js";
const _sfc_main = {
  components: {
    YxNavBar,
    YxChatItemDetail,
    YxChatDetailInput,
    YxPopup
  },
  provide() {
    return {
      isValidSetTouch: this.isValidSetTouch
    };
  },
  onLoad(query) {
    this.name = query.name;
    console.log("@\u663E\u793A\u5F97\u4E3A", query);
  },
  mounted() {
    console.log("@scrollView-mounted", this.$refs.inputBar.chatInputHeight);
    console.log("@\u952E\u76D8\u6FC0\u6D3B\u7684\u9AD8\u5EA6", this.$refs.inputBar.activeKeyboardHeight);
    console.log("@wwwww", this.popupContentOfUtilInBottom);
  },
  data() {
    return {
      name: "",
      isCompleteConvert: false,
      scrollHeight: 1,
      scrollViewHeight: 0,
      userMessage: static_testData_chatMessage.chatMesssage,
      curUserMessage: {},
      popData: [],
      popPosition: {},
      popIsDark: false,
      popShow: false,
      isValidTouch: false,
      touchTarget: "",
      touchStartTime: 0,
      isBottom: false,
      popupHeight: 0,
      bottomMode: "",
      utilArr: static_testData_chatUtils.chatUtils,
      emoArr: static_testData_chatEmo.data,
      bottomClickTransition: false,
      popupBottomData: static_testData_chatUtils.chatUtils
    };
  },
  methods: {
    utilEventHandle(event) {
      const self = this;
      switch (event) {
        case "uploadImage":
          common_vendor.index.chooseImage({
            count: 4,
            success(e) {
              console.log("\u56FE\u7247\u8DEF\u5F84", e);
              e.tempFilePaths.forEach((path) => {
                self.addMessage(path, "image");
              });
            }
          });
          break;
        case "camera":
          console.log("plus", plus);
          break;
        default:
          console.log("utils event err");
          break;
      }
    },
    changeInputState(event) {
      switch (event) {
        case "utils":
          console.log("utils\u64CD\u4F5C");
          this.popupBottomData = static_testData_chatUtils.chatUtils;
          break;
        case "emo":
          console.log("emo\u64CD\u4F5C");
          this.popupBottomData = static_testData_chatEmo.data;
          break;
        default:
          console.log("\u6CA1\u6709\u547D\u4E2D\u4E8B\u4EF6");
      }
      this.bottomClickTransition = true;
      this.bottomMode = event;
      this.isBottom = true;
      this.popShow = true;
      console.log("@\u952E\u76D8\u6FC0\u6D3B\u7684\u9AD8\u5EA6", this.$refs.inputBar.activeKeyboardHeight);
      this.popupHeight = this.$refs.inputBar.activeKeyboardHeight;
      this.popPosition = { x: 0, y: 0 };
      setTimeout(() => {
        this.bottomClickTransition = false;
        console.log("\u5207\u6362\u663E\u793Asssss");
      }, 100);
    },
    addMessage(message, type) {
      const m = {
        id: Date.now(),
        user_id: 0,
        type,
        message_time: Date.now(),
        isUndone: false,
        isDel: false,
        data: type === "text" ? this.convertln(message) : message,
        user_image: "/static/logo.png",
        showTime: true
      };
      const lastIndex = this.userMessage.length - 1;
      const preTime = this.userMessage[lastIndex].message_time;
      const timeLimit = 1e3 * 60 * 10;
      m.showTime = m.message_time - preTime > timeLimit;
      this.scrollBottom();
      this.userMessage.push(m);
    },
    scrollBottom() {
      setTimeout(() => {
        this.scrollHeight += 100;
      }, 1);
      setTimeout(() => {
        this.scrollHeight -= 100;
      }, 2);
    },
    convertln(target) {
      let res = "";
      const patternln = /\n/g;
      const patternls = /\s/g;
      res = target.replace(patternln, "<p></p>");
      res = res.replace(patternls, "&nbsp;");
      console.log("\u52A0\u5DE5\u5B57\u7B26\u4E32", target);
      return res;
    },
    scroll(e) {
      this.scrollHeight = e.detail.scrollHeight;
    },
    actionHandle(event) {
      switch (event) {
        case "undo":
          this.curUserMessage.isUndone = true;
          break;
        case "del":
          this.curUserMessage.isDel = true;
          break;
        default:
          console.log("\u6CA1\u6709\u6B64\u4E8B\u4EF6");
          break;
      }
    },
    isValidSetTouch(target) {
      this.touchTarget = target;
      this.isValidTouch = true;
    },
    handleTouch(user, e) {
      if (this.isValidTouch) {
        this.touchStartTime = e.timeStamp;
      }
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      const device = common_vendor.index.getSystemInfoSync();
      const maxX = device.screenWidth;
      const maxY = device.screenHeight;
      x = x + 130 > maxX ? maxX - 130 : x;
      y = y + 300 > maxY ? maxY - 300 : y;
      y = y - 50 < 0 ? 50 : y;
      this.popPosition = { x, y };
    },
    handleLeave(message, e) {
      const endTime = e.timeStamp;
      if (this.touchStartTime && endTime - this.touchStartTime > 400) {
        this.isBottom = false;
        this.curUserMessage = message;
        const undoLimitTime = 1e3 * 60 * 3;
        const allowUndo = Date.now() - this.touchTarget.message_time < undoLimitTime && this.touchTarget.user_id === 0;
        this.popData = [
          {
            id: 1,
            content: "\u590D\u5236"
          },
          {
            id: 2,
            content: "\u53D1\u9001\u7ED9\u670B\u53CB"
          },
          {
            id: 3,
            content: allowUndo ? "\u64A4\u56DE" : "",
            event: "undo"
          },
          {
            id: 4,
            content: "\u5220\u9664",
            event: "del"
          },
          {
            id: 5,
            content: "\u6536\u85CF"
          }
        ];
        this.popShow = true;
        this.touchStartTime = 0;
        this.isValidTouch = false;
      } else {
        this.popShow = false;
      }
    },
    handlePopHide() {
      this.popShow = false;
      if (this.isBottom) {
        this.$refs.inputBar.isOpenSwipeUtil = false;
        this.$refs.inputBar.isOpenEmo = false;
        this.$refs.inputBar.getInputHeight();
      }
    },
    synMoveDistance() {
      this.scrollViewHeight = this.$refs.inputBar.chatInputHeight;
      this.scrollBottom();
      console.log("\u5B8C\u6210\u53D8\u5316\u540C\u6B65", this.scrollViewHeight);
    }
  },
  computed: {
    userChatMessage() {
      if (!this.isCompleteConvert) {
        this.userMessage[0].data = this.convertln(this.userMessage[0].data);
        for (let i = 1; i < this.userMessage.length; i++) {
          const curTime = this.userMessage[i].message_time;
          const preTime = this.userMessage[i - 1].message_time;
          const timeLimit = 1e3 * 60 * 10;
          this.userMessage[i].showTime = curTime - preTime > timeLimit;
          this.userMessage[i].data = this.convertln(this.userMessage[i].data);
        }
        this.isCompleteConvert = true;
      }
      return this.userMessage;
    }
  }
};
if (!Array) {
  const _component_yx_nav_bar = common_vendor.resolveComponent("yx-nav-bar");
  const _component_yx_chat_item_detail = common_vendor.resolveComponent("yx-chat-item-detail");
  const _component_yx_chat_detail_input = common_vendor.resolveComponent("yx-chat-detail-input");
  const _component_yx_popup = common_vendor.resolveComponent("yx-popup");
  (_component_yx_nav_bar + _component_yx_chat_item_detail + _component_yx_chat_detail_input + _component_yx_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: this.name
    }),
    b: common_vendor.f($options.userChatMessage, (message, k0, i0) => {
      return {
        a: message.id,
        b: common_vendor.o((e) => $options.handleTouch(message, e), message.id),
        c: common_vendor.o((e) => $options.handleLeave(message, e), message.id),
        d: "88aeac7a-1-" + i0,
        e: common_vendor.p({
          chatMessage: message
        })
      };
    }),
    c: common_vendor.o((...args) => $options.scroll && $options.scroll(...args)),
    d: $data.scrollHeight,
    e: common_vendor.s(`top:95rpx;bottom:${$data.scrollViewHeight}rpx`),
    f: common_vendor.sr("inputBar", "88aeac7a-2"),
    g: common_vendor.o($options.addMessage),
    h: common_vendor.o($options.handlePopHide),
    i: common_vendor.o($options.synMoveDistance),
    j: common_vendor.o($options.changeInputState),
    k: $data.bottomMode == "utils"
  }, $data.bottomMode == "utils" ? {
    l: common_vendor.f($data.utilArr, (itemArr, k0, i0) => {
      return {
        a: common_vendor.f(itemArr, (item, k1, i1) => {
          return {
            a: item.img_src,
            b: common_vendor.t(item.text),
            c: common_vendor.o(($event) => $options.utilEventHandle(item.event), item.id),
            d: item.id
          };
        })
      };
    }),
    m: common_vendor.n($data.bottomClickTransition ? "opacity-0" : "opacity-1")
  } : {}, {
    n: $data.bottomMode == "emo"
  }, $data.bottomMode == "emo" ? {
    o: common_vendor.f($data.emoArr, (emoItem, k0, i0) => {
      return {
        a: emoItem.img_src,
        b: common_vendor.t(emoItem.text),
        c: common_vendor.o(($event) => $options.addMessage(emoItem.img_src, "image"), emoItem.id),
        d: emoItem.id
      };
    }),
    p: common_vendor.n($data.bottomClickTransition ? "opacity-0" : "opacity-1")
  } : {}, {
    q: common_vendor.o($options.handlePopHide),
    r: common_vendor.o($options.actionHandle),
    s: common_vendor.p({
      show: $data.popShow,
      popPosittion: $data.popPosition,
      popHeight: $data.popupHeight,
      utilArr: $data.utilArr,
      emoArr: $data.emoArr,
      bottomMode: $data.bottomMode,
      bottomClickTransition: $data.bottomClickTransition,
      isDark: $data.popIsDark,
      popItem: $data.popData,
      isBottom: $data.isBottom,
      popupContentOfUtilInBottom: $data.popupBottomData
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/pages/chat-detail/chat-detail.vue"]]);
wx.createPage(MiniProgramPage);
