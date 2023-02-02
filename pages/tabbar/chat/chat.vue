<template>
		<yx-common-wrapper bg="white" >	
			<yx-tool-bar @clickNav="clickNav" :title="`微信(${userCount})`" isSelf></yx-tool-bar>
			<!-- <yx-tool-bar  :title="`微信(${userCount})`"></yx-tool-bar> -->
			<!-- 置顶聊天 -->
			<!-- <scroll-view @scrolltolower="scrollBottom" scroll-y="true" class="position-fixed font-md"  :style="`top:${fixedTop+100}rpx;bottom:100rpx`"> -->
			<yx-flexible-wrapper height="87vh">
				<block  v-for="user in userTopList" :key="user.id">
					<chat-item :user="user" @click="goChat(user)"  @touchstart="(e)=>handleTouch(user,e)"
				 @touchend="(e)=>handleLeave(user,e)" class="bg-common" hover-class="bg-dark"></chat-item>
				</block>
				<!-- 常规聊天 -->
				<block  v-for="user in userList" :key="user.id">
					<chat-item v-if="!(user.is_top)" :user="user" @click="goChat(user)"  @touchstart="(e)=>handleTouch(user,e)"
				 @touchend="(e)=>handleLeave(user,e)"></chat-item>
					<chat-item v-if="!(user.is_top)" :user="user" @click="goChat(user)"  @touchstart="(e)=>handleTouch(user,e)"
				 @touchend="(e)=>handleLeave(user,e)"></chat-item>
					<chat-item v-if="!(user.is_top)" :user="user" @click="goChat(user)"  @touchstart="(e)=>handleTouch(user,e)"
				 @touchend="(e)=>handleLeave(user,e)"></chat-item>
					<chat-item v-if="!(user.is_top)" :user="user" @click="goChat(user)"  @touchstart="(e)=>handleTouch(user,e)"
				 @touchend="(e)=>handleLeave(user,e)"></chat-item>
				</block>
			</yx-flexible-wrapper>
			<!-- </scroll-view> -->
			
			<yx-popup :show="popShow" :popPosittion="popPosition" 
			:isDark="popIsDark"  :isChat="true"
			:popItem="popData" @action="popAction"
			@hide="handlePopHide"></yx-popup>
		</yx-common-wrapper>
</template>

<script>
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxToolBar from '@/components/yx-tool-bar.vue'
	import chatItem from '@/components/chat-item.vue'
	import YxPopup from '@/components/yx-popup.vue'
	import userList from '@/static/testData/userList.js'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		components:{
			YxToolBar,chatItem,YxPopup,YxCommonWrapper,YxFlexibleWrapper
		},
		mounted(){
			this.userTopList =  this.userList.filter(user=>user.is_top)
		}
		,
		data() {
			// 外部传入user对象，我们结构出其的内容进行渲染
			/*
			  {
				  id:number
				  image_src: string
				  messagge_count:string
				  user_name:string
				  user_message:string
				  message_time:number
				  is_touch:false
			  }
			*/
			return {
				//聊天用户占位信息
				curUser:{},
				userList,
				userTopList:[],
				// pop待展示的每一项
				popData:[],
				popPosition:{},
				popShow:false,
				popIsDark:false,
				touchPosition:{},
				touchStartTime:0 // 记录touchTime时间， 使用结束点击时间减去当前触摸时间即可判断执行什么操作
			}
		},
		methods: {
			scrollBottom(e){
				console.log('滚动到底部了',e)
			},
			// 前往聊天
			goChat(user){
				uni.navigateTo({
					url:`/pages/chat-detail/chat-detail?id=${user.id}&name=${user.user_name}`
				})
			},
			// 触摸聊天框时调用
			handleTouch(user,e){
				// user.is_touch = true
				// console.log('我点击他了',e)
				this.touchStartTime = e.timeStamp
				let x = e.touches[0].clientX
				let y = e.touches[0].clientY 
				this.touchPosition = {x,y}
				const device = uni.getSystemInfoSync()
				const maxX = device.screenWidth
				const maxY = device.screenHeight
				x = x +130 > maxX ? maxX-130 : x
				y = y +100 > maxY ? maxY-100 : y
				y = y - 60 < 0 ? 60 : y
				this.popPosition={x,y}
				
			},
			handleLeave(user,e){
				// user.is_touch = false
				// console.log('我离开了',e)
				const endTime = e.timeStamp
				
				let y = e.changedTouches[0].clientY 
				if(endTime - this.touchStartTime>400 && Math.abs(this.touchPosition.y - y) <100){
					// 有效的touch呼出popup
					// console.log('展示pop')
					// 设置内容
					this.popShow = true
					this.popIsDark=false
					this.curUser = user
					this.popData = [
						{
							id:1,
							icon:'',
							content: user.is_top ? '取消置顶':'设为置顶',
							event: user.is_top ?  'undoTop':'setTop'
							
						},
						{
							id:2,
							icon:'',
							content:'删除该聊天'	,
							event:'delChat'
						},
					]
					
				}
				
			},
			handlePopHide(){
				this.popShow = false
			},
			popAction(event){
				switch(event){
					case 'delChat':
						this.userList = this.userList.filter(user=> user.id !=this.curUser.id)
						this.userTopList = this.userTopList.filter(user=> user.id !=this.curUser.id)
					return;
					case 'undoTop':
						this.userTopList = this.userTopList.filter(user=> user.id !=this.curUser.id)
						this.userList.forEach(user=> {
							if(user.id === this.curUser.id ){
								 user.is_top = false
							}
						})
					return;
					case 'setTop':
						this.curUser.is_top = true
						this.userTopList.unshift({...this.curUser})
						this.userList.forEach(user=> {
							if(user.id === this.curUser.id) user.is_top = true
						})
					return
					default:
					console.log('错误得事件调用')
				}
			},
			// 点击的为+号图标
			clickNav(){
				const device = uni.getSystemInfoSync()
				const maxX = device.screenWidth
				const maxY = device.screenHeight
				this.popPosition={x:maxX-180,y:100}
				this.popIsDark = true
				this.popShow = true
				console.log('@clickNav')
				this.popData = [
					{
						id:1,
						icon:'icon-chat1',
						content:'发起群聊',
						
					},
					{
						id:2,
						icon:'icon-adduser',
						content:'添加朋友'						
					},
					{
						id:3,
						icon:'icon-saoyisao',
						content:'扫一扫'						
					},
					{
						id:4,
						icon:'icon-shoufukuan1',
						content:'收付款'						
					},
					{
						id:5,
						icon:'icon-help',
						content:'帮助与反馈'						
					},
				]
			}
		},
		computed:{
			userCount(){
				return this.userList.length
			},
			...mapState(useDeviceStore,['fixedTop']),
		}
	}
</script>

<style>
</style>
