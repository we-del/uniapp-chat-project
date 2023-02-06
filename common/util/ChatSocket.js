import sessionStorage from '@/common/util/sessionStorage.js'
export default class Chat{
	static socketTask
	static _init(){
		
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
		this.socketTask.sendMsg({
			data,
			success:(e)=>{
				console.log(e,'成功ws')
			},
			fail:(e)=>{
				console.log(e,'失败ws')
			}
		})
	}
}