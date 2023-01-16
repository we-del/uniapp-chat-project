


let groups = []; // 存储数组

// 生成 A-Z 的 group
for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
  if(Math.floor(Math.random()*3) === 0) continue
  let group = {
    group: String.fromCharCode(i),
    userList: []
  };
  
  // 生成 userList
  for (let j = 0; j < Math.floor(Math.random() * 5)+1; j++) {
    let user = {
      id: Math.random() * 10000,
      img: '/static/images/mail/friend.png',
      title: String.fromCharCode(i) + (j+1)
    };
    group.userList.push(user);
  }
  groups.push(group);
}

console.log('@group',groups);

export default groups