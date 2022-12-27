"use strict";
var common_vendor = require("../../../common/vendor.js");
const YxCard = () => "../../../components/yx-card.js";
const YxDivider = () => "../../../components/yx-divider.js";
const YxList = () => "../../../components/yx-list.js";
const _sfc_main = {
  components: { YxCard, YxDivider, YxList },
  data() {
    return {
      data: [
        [
          {
            id: 2,
            title: "\u652F\u4ED8",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true
          }
        ],
        [
          {
            id: 0,
            title: "\u6536\u85CF",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true
          },
          {
            id: 12,
            title: "\u76F8\u518C",
            icon: "icon-xiaochengxu",
            isCell: true
          },
          {
            id: 1,
            title: "\u8868\u60C5",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true,
            suffix: {
              content: "\u5185\u5BB9"
            }
          }
        ],
        [
          {
            id: 2,
            title: "\u8BBE\u7F6E",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true
          }
        ]
      ]
    };
  },
  methods: {}
};
if (!Array) {
  const _component_yx_card = common_vendor.resolveComponent("yx-card");
  const _component_yx_divider = common_vendor.resolveComponent("yx-divider");
  const _component_yx_list = common_vendor.resolveComponent("yx-list");
  (_component_yx_card + _component_yx_divider + _component_yx_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      img: "/static/logo.png",
      title: "\u695A\u4E91",
      desc: "\u6D4B\u8BD5\u6570\u636E"
    }),
    b: common_vendor.f($data.data, (group, k0, i0) => {
      return {
        a: common_vendor.f(group, (d, k1, i1) => {
          return {
            a: common_vendor.t(d.suffix && d.suffix.content),
            b: d.id,
            c: "384d9908-2-" + i0 + "-" + i1,
            d: common_vendor.p({
              ["hover-class"]: "bg-dark",
              title: d.title,
              isCell: d.isCell,
              icon: d.icon
            })
          };
        }),
        b: "384d9908-3-" + i0
      };
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/user/user.vue"]]);
wx.createPage(MiniProgramPage);
