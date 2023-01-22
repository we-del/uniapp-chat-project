<template>
	<view class="ele-center " style="width:100vw;height:80vh;">
		<view id="login-wrapper" class="p-2 font-lg bg-common">
			<view class=" text-center mt-4">title</view>
			<view class="py-4">
				<textarea maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 v-model="userInfo.user" placeholder="请输入用户名"></textarea>
				<textarea maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请输入密码" v-model="userInfo.password"></textarea>
			</view>
			<view class="py-2 main-bg-color text-white text-center font-md" @click="toLogin">登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{
					// user:user; password:'123456a'
					user:'',
					password:''
				}
			}
		},
		methods: {
			toLogin(){
				const verify = {
					user: 'user',
					password:'123456a'
				}
				const lock = JSON.stringify(verify)
				const key = JSON.stringify(this.userInfo)
				console.log(lock)
				console.log(key)
				console.log(key == lock)
				if(lock == key){
					uni.setStorageSync('token',key)
					uni.switchTab({
						url:'/pages/tabbar/chat/chat'
					})
				}
			}
		}
	}
</script>

<style>

</style>
