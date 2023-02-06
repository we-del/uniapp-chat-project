<script>
	import {mapActions,mapWritableState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	import sessionStorage from '@/common/util/sessionStorage.js'

	export default {
		onReady(){
			console.log('app render')
		},
		onLaunch: function() {
			console.log('App Launch')
			// 在此对用户鉴权，通过权限去判断用户可访问的数据
			let token = uni.getStorageSync('token')
			if(!token) token = sessionStorage.getStorage('token')
			if(!token){ // 没有登陆过
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}else{
				uni.switchTab({
					url:'/pages/tabbar/chat/chat'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		mounted(){
			// console.log('app mounted')
			// console.log(this)
			const {statusBarHeight,brand} = uni.getSystemInfoSync()
			this.statusBarHeight = statusBarHeight
			if(brand){
				// h5端没有此属性，移动端有
				this.device = 'android'
			}
			// console.log(this.statusBarHeight)
			// console.log(this.device)
			// console.log('model',plus.device.model)
			console.log('device',uni.getSystemInfoSync())
			// plus.device.getInfo((e)=>{
			// 	console.log('获取设备信息成功',e)
			// },(e)=>{
			// 	console.log('获取设备信息失败',e)
			// },(e)=>{
			// 	console.log('信息获取完成',e)
			// });
			
		},
		computed:{
			// computed其实就是defineProperty数据劫持  mapState只读 ，mapWritableState可读可写
			...mapWritableState(useDeviceStore,['statusBarHeight']),
			...mapWritableState(useDeviceStore,['device'])
		}
	}
</script>

<style>
	@import '@/common/free.css';
	@import '@/common/common.css';
	@import '@/common/free-icon.css';
	.uni-app--showtopwindow uni-page-head {
		display: none;
	}
	/* For Chrome and Safari */
	::-webkit-scrollbar {
	  width:0;
	  background-color: transparent;
	}
	 
	::-webkit-scrollbar-thumb {
	  background-color: #000000;
	}
	
	/* For Internet Explorer and Edge */
	body {
	    -ms-overflow-style: none;
	}

	/*每个页面公共css */
</style>
