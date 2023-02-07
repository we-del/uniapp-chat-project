// 用于存储当前临时聊天列表，当点击对应的好友页签后，即可将其加入到临时聊天列表中，点击删除时移除信息

import {defineStore} from 'pinia';
import {ref,computed,reactive} from 'vue';
import sessionStorage from '@/common/util/sessionStorage.js'
export const useUserChatList = defineStore('userChatList',()=>{
	/**
	 @description 数据格式
		 {
		   id:1, // 唯一标识
		   image_src: '/static/logo.png', // 用户头像
		   message_count:7, //  未读消息个数
		   user_name:'无奈', // 用户名(nickname&username)
		   user_message:'你今天吃的是什么', // 用户的最后一条消息(如果是文字则进行显示，图片视频录音显示对应的文本即可，如[录音])
		   message_time:Date.now()-200000, // 最后一条消息的发布时间
		   is_top:false // 临时聊天框是否置顶
		 },
	@description 需要字段
		userList:[], // 存储普通非指定列表
		// 将userList和userTopList都存储到localStorage中(真实开发场景，由于是测试阶段，因此暂时存储到sessionStorage中，后期只需修改仓库类型即可)
		userTopList:[], // 存储置顶列表
	@description 功能需求
		点击对应的好友框进入聊天状态，此时将其添加到临时聊天列表中，记录最后一条消息的发送信息，在点击删除聊天框时删除对应的零时聊天
	*/
   
   
    // 改变聊天框的单个状态
	let userList = reactive(sessionStorage.getStorage('chatList') || [])
	// const userTopList = reactive([])
	
	// pop框改变单个聊天框状态
	function popAction(event,curUser){
		switch(event){
			case 'delChat':
			const i = userList.findIndex(user=> user.id ===curUser.id)
				 userList.splice(i,1)
			break;
			case 'undoTop':
				userList.forEach(user=> {
					if(user.id === curUser.id ){
						 user.is_top = false
					}
				})
			break;
			case 'setTop':
				userList.forEach(user=> {
					if(user.id === curUser.id) user.is_top = true
				})
			break
			default:
				console.log('错误得事件调用')
		}
		saveChat()
	}
	
	
	// 添加临时聊天
	function addChat(data){
			console.log('添加字段操作')
		if(!(userList.find(u=> u.id === data.id))){
			userList.push(data)
			console.log('userList',data)
			saveChat()
			console.log('添加字段成功')
		}
		
	}
	// 更新指定临时聊天信息(如更新最后一条消息事件，未读消息，聊天间隔)
	function updateChatMsg(id,key,val){
		userList.forEach(u => {
			if(u.id === id){
				u[key] = val
			}
		})
	}
	
	
	
	// 存储聊天
	function saveChat(){
		sessionStorage.setStorage('chatList',userList)
	}
	const userCount = computed(()=> userList.length)
	const userTopList = computed(()=> userList.filter(user=>user.is_top))
	
	// 暴露给全局的函数或状态
	return {
		popAction,addChat,userList,userTopList,userCount
	};
});