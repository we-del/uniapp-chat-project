"use strict";
var userList = [
  {
    id: 1,
    image_src: "../../../static/logo.png",
    messagge_count: 7,
    user_name: "\u65E0\u5948",
    user_message: "\u4F60\u4ECA\u5929\u5403\u7684\u662F\u4EC0\u4E48",
    message_time: Date.now() - 2e5,
    is_top: false
  },
  {
    id: 2,
    image_src: "../../../static/logo1.png",
    messagge_count: 3,
    user_name: "\u6B66\u57CE",
    user_message: "\u57CE\u5899\u539A\u5B9E",
    message_time: Date.now() - 12e4,
    is_top: false
  },
  {
    id: 3,
    image_src: "../../../static/logo.png",
    messagge_count: 1,
    user_name: "\u4E4C\u6765",
    user_message: "\u4E4C\u62C9",
    message_time: Date.now() - 15e4,
    is_top: false
  },
  {
    id: 4,
    image_src: "../../../static/logo1.png",
    messagge_count: 0,
    user_name: "\u8389\u5A1C",
    user_message: "\u6211\u6765\u8FA3",
    message_time: Date.now() - 34e4,
    is_top: false
  },
  {
    id: 5,
    image_src: "../../../static/logo.png",
    messagge_count: 1,
    user_name: "\u963F\u82B3",
    user_message: "\u4F60\u597D\uFF0C\u6211\u54E6\u662F\u963F\u82B3",
    message_time: Date.now() - 15e4,
    is_top: false
  },
  {
    id: 6,
    image_src: "../../../static/logo1.png",
    messagge_count: 0,
    user_name: "\u73CD\u59AE\u7279",
    user_message: "\u8D77\u98DE",
    message_time: Date.now() - 34e4,
    is_top: false
  },
  {
    id: 7,
    image_src: "../../../static/logo.png",
    messagge_count: 1,
    user_name: "\u874E\u5B50\u83B1\u83B1",
    user_message: "\u6211\u4F1A\u53D8\u8EAB",
    message_time: Date.now() - 15e4,
    is_top: false
  },
  {
    id: 8,
    image_src: "../../../static/logo1.png",
    messagge_count: 0,
    user_name: "\u708E\u9F99\u94E0\u7532",
    user_message: "\u708E\u9F99\u4E4B\u529B",
    message_time: Date.now() - 34e4,
    is_top: false
  }
];
exports.userList = userList;
