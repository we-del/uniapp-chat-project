import {defineStore} from 'pinia';
import {ref,computed} from 'vue';
import sessionStorage from '@/common/util/sessionStorage.js'
export const useWebsocketStore = defineStore('webSocket',()=>{
	const socketTask  = uni.connectSocket({
		url: 'ws://127.0.0.1:7001/ws',
		data() {
			return {
				x: '',
				y: ''
			};
		},
		header: {
			'content-type': 'application/json',
			'Authorization': sessionStorage.getStorage('token')
		},
		protocols: ['protocol1'],
		method: 'GET',
		complete:()=>{}
	});
	console.log('建立websocket连接中！~~')
	uni.onSocketOpen(function (res) {
	  console.log(res,'WebSocket连接已打开！');
	});
	uni.onSocketError(function (res) {
	  console.log(res,'WebSocket连接打开失败，请检查！');
	});
	uni.onSocketMessage(function (res) {
	  console.log('收到服务器内容：' + res.data);
	});
	uni.onSocketClose(function (res) {
	  console.log('WebSocket 已关闭！');
	});
	return {
		socketTask
	};
});