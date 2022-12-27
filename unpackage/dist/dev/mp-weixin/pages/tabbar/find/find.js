"use strict";
var common_vendor = require("../../../common/vendor.js");
const YxList = () => "../../../components/yx-list.js";
const YxDivider = () => "../../../components/yx-divider.js";
const _sfc_main = {
  components: { YxList, YxDivider },
  data() {
    return {
      data: [
        [
          {
            id: 0,
            title: "\u670B\u53CB\u5708",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true
          },
          {
            id: 12,
            title: "\u5C0F\u7A0B\u5E8F",
            icon: "icon-xiaochengxu",
            isCell: true
          }
        ],
        [
          {
            id: 1,
            title: "\u626B\u4E00\u626B",
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
            title: "\u6E38\u620F",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true
          }
        ],
        [
          {
            id: 3,
            title: "\u8D2D\u7269",
            icon: "icon-iconfontzhizuobiaozhunbduan36",
            isCell: true
          }
        ],
        [
          {
            id: 4,
            title: "\u770B\u4E00\u770B",
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
  const _component_yx_list = common_vendor.resolveComponent("yx-list");
  const _component_yx_divider = common_vendor.resolveComponent("yx-divider");
  (_component_yx_list + _component_yx_divider)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.data, (group, k0, i0) => {
      return {
        a: common_vendor.f(group, (d, k1, i1) => {
          return {
            a: common_vendor.t(d.suffix && d.suffix.content),
            b: d.id,
            c: "8dc78470-0-" + i0 + "-" + i1,
            d: common_vendor.p({
              ["hover-class"]: "main-bg-hover-color",
              title: d.title,
              isCell: d.isCell,
              icon: d.icon
            })
          };
        }),
        b: "8dc78470-1-" + i0
      };
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/aLearning/project/\u804A\u5929/pages/tabbar/find/find.vue"]]);
wx.createPage(MiniProgramPage);
