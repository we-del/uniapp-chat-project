"use strict";
var chatMesssage = [
  {
    id: "a1",
    user_id: 0,
    type: "text",
    message_time: Date.now() - 1e6,
    isUndone: false,
    isDel: false,
    data: `33
				3
				3`,
    user_image: "/static/logo.png",
    showTime: true
  },
  {
    id: "a1",
    user_id: 0,
    type: "image",
    message_time: Date.now() - 1e6,
    isUndone: false,
    isDel: false,
    data: "/static/images/bg.jpg",
    user_image: "/static/logo.png",
    showTime: true
  },
  {
    id: "a2",
    user_id: 1,
    type: "image",
    message_time: Date.now() - 1e4,
    isUndone: false,
    isDel: false,
    data: "/static/images/nothing/no_pay.png",
    user_image: "/static/logo1.png",
    showTime: true
  },
  {
    id: "a3",
    user_id: 1,
    type: "image",
    isUndone: false,
    isDel: false,
    message_time: Date.now() - 1e4,
    data: "/static/images/nothing/no_pay.png",
    user_image: "/static/logo1.png",
    showTime: true
  },
  {
    id: "a4",
    user_id: 1,
    type: "image",
    isUndone: false,
    isDel: false,
    message_time: Date.now() - 1e4,
    data: "/static/images/nothing/no_pay.png",
    user_image: "/static/logo1.png",
    showTime: true
  },
  {
    id: "a6",
    user_id: 0,
    type: "image",
    isUndone: false,
    isDel: false,
    message_time: Date.now(),
    data: "/static/images/nothing/no_pay.png",
    user_image: "/static/logo.png",
    showTime: true
  }
];
exports.chatMesssage = chatMesssage;
