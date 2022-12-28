/**
 * @description 功能列表，用于陈列数据和功能
 */

const data = []
// 图片路径
// /static/images/emoticon/5497/${n}.gif
// 写死最大表情数，期待后台返回
const nMax = 19
// 记录当前新增的二维数组索引
let index = 0  
for (var i = 0; i <=nMax; i++) {
	// debugger;
	// 根据布局情况而定是否分组
	// if(i% 8 == 0){ // 每8个为一组
	
	// 	if(i != 0) index++
	// 	data[index] = []
	// }
	const obj = {
			id: `00${i}`,
			text: `表情${i}`,
			img_src: `/static/images/emoticon/5497/${i}.gif`
		}
	// data[index].push(obj)
	data.push(obj)
}	
export default data
