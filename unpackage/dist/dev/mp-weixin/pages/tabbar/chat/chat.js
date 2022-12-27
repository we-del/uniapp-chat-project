"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var common_vendor = require("../../../common/vendor.js");
var static_testData_userList = require("../../../static/testData/userList.js");
const YxToolBar = () => "../../../components/yx-tool-bar.js";
const chatItem = () => "../../../components/chat-item.js";
const YxPopup = () => "../../../components/yx-popup.js";
const _sfc_main = {
  components: {
    YxToolBar,
    chatItem,
    YxPopup
  },
  mounted() {
  },
  data() {
    return {
      curUser: {},
      userList: static_testData_userList.userList,
      userTopList: [],
      popData: [],
      popPosition: {},
      popShow: false,
      popIsDark: false,
      touchStartTime: 0
    };
  },
  methods: {
    goChat(user) {
      common_vendor.index.navigateTo({
        url: `/pages/chat-detail/chat-detail?id=${user.id}&name=${user.user_name}`
      });
    },
    handleTouch(user, e) {
      this.touchStartTime = e.timeStamp;
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      const device = common_vendor.index.getSystemInfoSync();
      const maxX = device.screenWidth;
      const maxY = device.screenHeight;
      x = x + 130 > maxX ? maxX - 130 : x;
      y = y + 100 > maxY ? maxY - 100 : y;
      y = y - 60 < 0 ? 60 : y;
      this.popPosition = { x, y };
    },
    handleLeave(user, e) {
      const endTime = e.timeStamp;
      if (endTime - this.touchStartTime > 400) {
        this.popShow = true;
        this.popIsDark = false;
        this.curUser = user;
        console.log("@user", user);
        this.popData = [
          {
            id: 1,
            icon: "",
            content: user.is_top ? "\u53D6\u6D88\u7F6E\u9876" : "\u8BBE\u4E3A\u7F6E\u9876",
            event: user.is_top ? "undoTop" : "setTop"
          },
          {
            id: 2,
            icon: "",
            content: "\u5220\u9664\u8BE5\u804A\u5929",
            event: "delChat"
          }
        ];
      }
    },
    handlePopHide() {
      this.popShow = false;
    },
    popAction(event) {
      switch (event) {
        case "delChat":
          this.userList = this.userList.filter((user) => user.id != this.curUser.id);
          this.userTopList = this.userTopList.filter((user) => user.id != this.curUser.id);
          return;
        case "undoTop":
          this.userTopList = this.userTopList.filter((user) => user.id != this.curUser.id);
          this.userList.forEach((user) => {
            if (user.id === this.curUser.id) {
              user.is_top = false;
            }
          });
          return;
        case "setTop":
          this.curUser.is_top = true;
          this.userTopList.unshift(__spreadValues({}, this.curUser));
          this.userList.forEach((user) => {
            if (user.id === this.curUser.id)
              user.is_top = true;
          });
          return;
        default:
          console.log("\u9519\u8BEF\u5F97\u4E8B\u4EF6\u8C03\u7528");
      }
    },
    clickNav() {
      const device = common_vendor.index.getSystemInfoSync();
      const maxX = device.screenWidth;
      device.screenHeight;
      this.popPosition = { x: maxX - 160, y: 60 };
      this.popIsDark = true;
      this.popShow = true;
      console.log("@clickNav");
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
    }
  },
  computed: {
    userCount() {
      return this.userList.length;
    }
  }
};
if (!Array) {
  const _component_yx_tool_bar = common_vendor.resolveComponent("yx-tool-bar");
  const _component_chat_item = common_vendor.resolveComponent("chat-item");
  const _component_yx_popup = common_vendor.resolveComponent("yx-popup");
  (_component_yx_tool_bar + _component_chat_item + _component_yx_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.clickNav),
    b: common_vendor.p({
      title: `\u5FAE\u4FE1(${$options.userCount})`,
      isSelf: true
    }),
    c: common_vendor.f($data.userTopList, (user, k0, i0) => {
      return {
        a: common_vendor.o(($event) => $options.goChat(user)),
        b: common_vendor.o((e) => $options.handleTouch(user, e)),
        c: common_vendor.o((e) => $options.handleLeave(user, e)),
        d: "19043928-1-" + i0,
        e: common_vendor.p({
          user,
          ["hover-class"]: "bg-dark"
        }),
        f: user.id
      };
    }),
    d: common_vendor.f($data.userList, (user, k0, i0) => {
      return common_vendor.e({
        a: !user.is_top
      }, !user.is_top ? {
        b: common_vendor.o(($event) => $options.goChat(user)),
        c: common_vendor.o((e) => $options.handleTouch(user, e)),
        d: common_vendor.o((e) => $options.handleLeave(user, e)),
        e: "19043928-2-" + i0,
        f: common_vendor.p({
          user
        })
      } : {}, {
        g: user.id
      });
    }),
    e: common_vendor.o($options.popAction),
    f: common_vendor.o($options.handlePopHide),
    g: common_vendor.p({
      show: $data.popShow,
      popPosittion: $data.popPosition,
      isDark: $data.popIsDark,
      popItem: $data.popData
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/chat/chat.vue"]]);
wx.createPage(MiniProgramPage);
