import {defineStore} from 'pinia';
import {ref,computed,reactive} from 'vue';
import {getFriendDetail} from '@/api/friend.js'
import sessionStorage from '@/common/util/sessionStorage.js'
import {useUserChatList} from '@/store/userChatList.js'
export const useUserChatMessage = defineStore('chatMessage',()=>{
	// 存储当前消息的总数，判断消息是否存在，如果存在就进行消息数量上的添加，不存在就添加消息，并计算数目
	// 将消息的总和与chatList做上述对比添加到消息列表中，如果读取了某个用户消息，则该用户的消息数量清零

	// 数据格式 {user_id:[{某个好友的消息对象}]}
	const receiveMessageList = reactive({})
	// const userChatList = useUserChatList()
	/**
	 * @param k(string) 为好友的id
	 * @param msg(object) 好友发送给我的消息对象
	 * @effect 用于更新chat页面的消息信息 ，和存储当前对象的聊天信息
	 */
	async function storageReceiveMessage(k,msg,isMe=false){
		if(!k) return
		const userChatList = useUserChatList()
		// 约定 ref和reactive都可以将一个对象包装为响应状态，但如果是后续操作不会改变该状态指向的场合推荐使用reactive，反之使用ref(ref.value可以直接改变响应数据原，而reactive需要一个一个赋值)
		
		// 此状态用来存储每个聊天对象中所有聊天数据(相当于历史记录)
		receiveMessageList[k] = receiveMessageList[k] || []  
		// 更新消息个数和消息最新消息时间
		// 应该调用关联着用户表和朋友表的接口
		let chatList = userChatList.userList
		// if(!chatList) {
		// 	// 该用户第一次使用没有聊天对象
		// 	chatList = []
		// }
		// user_id 为消息的发送者   friend_id 为消息的接收着，因此我们要存储发送者发送的消息,更新其消息
		// const friObj = chatList.find(c=>c.id ==msg.user_id)
		const friObj = chatList.find(c=>c.id ==msg.friend_id)
		// 更新chat展示
		if(!friObj){
			// 该消息还没有存储到列表
			
			const userInfo = await getFriendDetail(msg.friend_id)
			console.log('@请求由',userInfo)
			const msgObj = {
				id:msg.user_id,
				image_src: msg.user_image,
				is_top:false,
				message_count:1,
				message_time:msg.message_time,
				// 文本则显示对应文本，处理外显示 [文件类型] ，如[音频] [图片] [视频]
				user_message: typeExcept(msg),
				// 第一次通过id查找对应的name然后进行存储，在此完成
				user_name: userInfo.nickname  || userInfo.username
				
			}
			// chatList.push(msgObj)
			// 添加chat
			userChatList.addChat(msgObj)
			
		}else{
			// 添加消息个数
			console.log('friObj',friObj)
			// 更新chat
			
			// 只有收到的消息才需要提醒
			const curUser = sessionStorage.getStorage('user')
			if(!isMe){
				userChatList.updateChatMsg(friObj.id,'message_count',friObj.message_count+1)
			}
			userChatList.updateChatMsg(friObj.id,'user_message',typeExcept(msg))
			userChatList.updateChatMsg(friObj.id,'message_time',Date.now())
		}
		// 保存此消息到消息对象中
		receiveMessageList[k].push(msg)
		
		// 保存每个用户的聊天记录
		sessionStorage.setStorage('chat-cache',receiveMessageList)
	}
	
	function typeExcept(msg){
		switch (msg.type){
			case 'text':
				return  msg.data;
			case 'image':
				return  '[图片]';
			case 'audio':
				return  '[音频]';
			case 'video':
				return  '[视频]';
			default:
				console.log('输入错误');
		}
	}
	
	return {
		receiveMessageList,storageReceiveMessage
	};
});