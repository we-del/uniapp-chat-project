import sessionStorage from '@/common/util/sessionStorage.js'
import {useUserChatMessage} from '@/store/userChatMessage.js'
export default class Chat{
	static socketTask
	static _init(){
		const  userChatMessage = useUserChatMessage()
		console.log('建立连接')
		this.socketTask = uni.connectSocket({
			url: `ws://127.0.0.1:7001/ws?token=${sessionStorage.getStorage('token')}`,
			header: {
				'content-type': 'application/json',
				// 向header里增加请求头信息失效。只能将用户token暴露在query中(危险)
				'token':sessionStorage.getStorage('token')
			},
			method: 'GET',
			complete:()=>{}
		});
		
		this.socketTask.onMessage((msg)=>{
			console.log('我接收到了',msg)
			console.log('我接收到了',JSON.parse(msg.data))
			const data = JSON.parse(msg.data)
			
			// 接收离线消息
			if(Array.isArray(data)){
				// 数组则挨个遍历对象进行存储
				data.forEach((d,i)=>{
					console.log(i,JSON.parse(d))
					userChatMessage.storageReceiveMessage(d.user_id,d)
				})
			}else{
				// 接收及时消息
				userChatMessage.storageReceiveMessage(data.user_id,data)
			}
			
		})
		this.socketTask.onOpen((msg)=>{
			console.log('我建立了连接',msg)
		})
		this.socketTask.onClose((msg)=>{
			console.log('我关闭了',msg)
		})
		this.socketTask.onError((msg)=>{
			console.log('我出现了',msg)
		})
		
	}
	static sendMsg(data){
		console.log(this.socketTask)
		this.socketTask.send({
			data,
			success:(e)=>{
				console.log(e,'成功ws')
			},
			fail:(e)=>{
				console.log(e,'失败ws')
			}
		})
	}
	
	static closeChatSocket(reason='用户退出登录',code=1000){
		this.socketTask.close({
				code,reason
		})
	}
}