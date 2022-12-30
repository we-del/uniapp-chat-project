"use strict";
const data = [];
const nMax = 19;
for (var i = 0; i <= nMax; i++) {
  const obj = {
    id: `00${i}`,
    text: `\u8868\u60C5${i}`,
    img_src: `/static/images/emoticon/5497/${i}.gif`
  };
  data.push(obj);
}
exports.data = data;
