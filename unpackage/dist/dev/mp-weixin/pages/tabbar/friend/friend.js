"use strict";
var common_vendor = require("../../../common/vendor.js");
const YxToolBar = () => "../../../components/yx-tool-bar.js";
const YxList = () => "../../../components/yx-list.js";
const _sfc_main = {
  components: { YxToolBar, YxList },
  data() {
    return {
      base_com: [
        {
          id: 1,
          img: "/static/contact/1.png",
          title: "\u7FA4\u804A"
        },
        {
          id: 2,
          img: "/static/contact/2.png",
          title: "\u6807\u7B7E"
        },
        {
          id: 3,
          img: "/static/contact/3.png",
          title: "\u65B0\u589E\u670B\u53CB"
        }
      ],
      friend_list: [
        {
          id: 1,
          img: "/static/contact/1.png",
          title: "\u963F\u8BDA"
        },
        {
          id: 2,
          img: "/static/contact/1.png",
          title: "\u9F99\u4E0E\u864E"
        },
        {
          id: 3,
          img: "/static/contact/1.png",
          title: "\u7EEA\u8BBA"
        },
        {
          id: 4,
          img: "/static/contact/1.png",
          title: "\u6768\u54E5"
        },
        {
          id: 5,
          img: "/static/contact/1.png",
          title: "\u590F\u65E5\u91CD\u73B0"
        },
        {
          id: 6,
          img: "/static/contact/1.png",
          title: "\u6F6E"
        },
        {
          id: 7,
          img: "/static/contact/1.png",
          title: "\u843D"
        }
      ]
    };
  },
  methods: {}
};
if (!Array) {
  const _component_yx_tool_bar = common_vendor.resolveComponent("yx-tool-bar");
  const _component_yx_list = common_vendor.resolveComponent("yx-list");
  (_component_yx_tool_bar + _component_yx_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      title: "\u901A\u8BAF\u5F55"
    }),
    b: common_vendor.f($data.base_com, (item, k0, i0) => {
      return {
        a: "029d0c28-1-" + i0,
        b: common_vendor.p({
          img: item.img,
          title: item.title
        }),
        c: item.id
      };
    }),
    c: common_vendor.f($data.friend_list, (item, k0, i0) => {
      return {
        a: "029d0c28-2-" + i0,
        b: common_vendor.p({
          img: item.img,
          title: item.title
        }),
        c: item.id
      };
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/friend/friend.vue"]]);
wx.createPage(MiniProgramPage);
