<template>
	<view class="ele-center " style="width:100vw;height:80vh;">
		<view id="login-wrapper" class="p-2 font-lg bg-common">
			<view class=" text-center mt-4">title</view>
			<view class="py-4">
				<textarea maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 v-model="userInfo.user" placeholder="请输入用户名"></textarea>
				<textarea maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请输入密码" v-model="userInfo.password"></textarea>
				<textarea maxlength="13" v-if="isRegister" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请重复输入密码" v-model="userInfo.repeatPassword"></textarea>
			</view>
			<view class="mb-2 font-small main-text-color" @click="goRegister">{{isRegister? '去登录':'去注册'}}</view>
			<view class="py-2 main-bg-color text-white text-center font-md" @click="toLogin">{{isRegister ? '注册':'登录'}} </view>
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
					password:'',
					repeatPassword:''
				},
				isRegister:false,
				userAccount:[{
						user: 'user',
						password:'123456a'
					},{
						user: 'admin',
						password:'admin'
					},]
			}
		},
		methods: {
			toLogin(){
				if(this.isRegister){
					// 账号验证 
					// 密码验证
					if(this.userInfo.user && this.userInfo.password == this.userInfo.repeatPassword){
						uni.showToast({
							title:'注册成功',
							icon:'success'
						})
						this.isRegister = false
						this.userAccount.push({user:this.userInfo.user,password:this.userInfo.password})
						this.clearInput()
					}else{
						uni.showToast({
							title:'注册失败,账号存在或两次输入不一致',
							icon:'none'
						})
					}
				} else{
					let exist = 0 
					const key = JSON.stringify({user:this.userInfo.user,password:this.userInfo.password})
					
					exist = this.userAccount.findIndex(account=> {
						const data = JSON.stringify(account)
						if(key == data) return true
						return false
					})
					if(exist !=-1){
						uni.setStorageSync('token',key)
						uni.switchTab({
							url:'/pages/tabbar/chat/chat'
						})
						this.clearInput()
					}else{
						uni.showToast({
							title:'账号或密码错误',
							icon:'error'
						})
					}	
				}				
			},
			goRegister(){
				this.isRegister = !this.isRegister
				this.clearInput()
			
			},
			clearInput(){
				this.userInfo.password = ''
				this.userInfo.user = ''
				this.userInfo.repeatPassword = ''
			}
		}
	}
</script>

<style>

</style>
