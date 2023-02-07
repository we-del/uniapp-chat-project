<template>
	<view class="ele-center " style="width:100vw;height:80vh;">
		<view id="login-wrapper" class="p-2 font-lg bg-common">
			<view class=" text-center mt-4">{{!isRegister? '登录':'注册'}}</view>
			<view class="py-4">
		<!-- 		<textarea maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 v-model="userInfo.username" placeholder="请输入用户名"></textarea>
				<textarea maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请输入密码" v-model="userInfo.password"></textarea>
				<textarea maxlength="13" v-if="isRegister" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请重复输入密码" v-model="userInfo.repeatPassword"></textarea> -->
				 
				
				
				<!-- 回去测试app端是否兼容v-model(似乎不兼容) -->
				 
				<input maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 v-model="userInfo.username" placeholder="请输入用户名"/>
				<input maxlength="13" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请输入密码" v-model="userInfo.password"/>
				<input maxlength="13" v-if="isRegister" class="bg-white p-2 my-2" style="max-height: 60rpx;width:60vw"
				 placeholder="请重复输入密码" v-model="userInfo.repeatPassword"/>
			</view>
			<view class="mb-2 font-small main-text-color" @click="goRegister">{{isRegister? '去登录':'去注册'}}</view>
			<view class="py-2 main-bg-color text-white text-center font-md" @click="toLogin">{{isRegister ? '注册':'登录'}} </view>
		</view>
	</view>
</template>

<script>
	import {login,register} from '@/api/user.js'
	import sessionStorage from '@/common/util/sessionStorage.js'
	export default {
		data() {
			return {
				userInfo:{
					// user:user; password:'123456a'
					username:'轻井泽惠',
					password:'1234155',
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
			async toLogin(){
				
				if(this.isRegister){
					// 账号验证 
					// 密码验证
					if(this.userInfo.username && this.userInfo.password == this.userInfo.repeatPassword){
						await register(this.userInfo)
						uni.showToast({
							title:'注册成功',
							icon:'success'
						})
						this.isRegister = false
						// this.userAccount.push({user:this.userInfo.username,password:this.userInfo.password})
						this.clearInput()
					}else{
						uni.showToast({
							title:'注册失败,账号存在或两次输入不一致',
							icon:'none'
						})
					}
				} else{
					console.log('开始登录')
					//两个条件有一个为空就执行
					if(!this.userInfo.username || !this.userInfo.password){
						uni.showToast({
							title:'输入不能为空',
							icon: 'error'
						})
						return
					}
						const res  = await login({username:this.userInfo.username,password:this.userInfo.password})
						if(typeof res === 'string'){
							uni.showToast({
								title:res,
								icon:'none'
							})
						}else{
							sessionStorage.setStorage('user',res)
							sessionStorage.setStorage('token',res.token)
							uni.switchTab({
								url:'/pages/tabbar/chat/chat'
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
				this.userInfo.username = ''
				this.userInfo.repeatPassword = ''
			}
		}
	}
</script>

<style>

</style>
