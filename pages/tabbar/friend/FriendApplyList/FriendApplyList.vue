<template>
	<YxFlexibleWrapper >
		<YxNavbar title="新增朋友" titleCenter>
			<template #suffix>
				<view @click="goAddFriend">添加朋友</view>
			</template>
		</YxNavbar>
		<!-- <view v-for="i in 20" class="bg-common" style="height: 100rpx;">1
		</view> -->
		<view class="p-5 font-md bg-common"
		v-if="!applyList.length">你还没有好友，快去添加一个吧</view>
		<view v-if="applyList.length" @click="expandOpe=false">
			<!-- 展示两类信息，一类是添加我的信息(有操作数据的能力)，一类是我发出的信息 
				我发出的信息备注已 我：请求消息组成   ，且状态一栏 有一个斜向上箭头
				
			-->
			<YxCard v-for="apply in applyList" 
			:img="apply.avatar"
			:title="apply.username">
				<template #desc>
					<view class="flex justify-between"
					>
						<!-- // 文字显示 -->
						<view class="text-ellipsis "
						style="width:40vw;overflow: clip;"
						v-if="!apply.expandContent">
						{{isMeSend(apply) ? '我：':''}} 
							{{apply.apply_message}}
						</view>
						<text v-else
						style="width:40vw;min-height:1vh;word-break:break-all;">
						{{apply.apply_message}}</text>
						<!-- 展开全部内容图标 -->
						<text class="font-sm main-text-color" v-if="!apply.expandContent" @click="apply.expandContent = true">展开</text>
					</view>
					
				</template>
				<template #right>
					<!-- 此部分应区分发出的请求和接收的请求，接收的请求会被me处理 -->
					<view style="text-align: right;width:200rpx" class="overflow-hidden">
						<text :class="isMeSend(apply) ? 'iconfont icon-jiantou_youshang':''"></text>
						
						<!-- 判断此请求是否过期，是否由me发出 -->
						<text v-if="!isMeHandleAppLy(apply)"
						class="ml-2 font-md"> {{applyStatus(apply)}}</text>
						<view v-else>
							<!-- // 在此编写处理好友请求逻辑 -->
							<!-- 我来处理请求 -->
							<view class="mt-3 font-sm main-bg-color p-1" style="float:right;text-align: left;">
								<view>
									<text class="text-dark mr-1" @click="handleApply(apply,'agree')">
									<!-- {{opeSign ? '同意':'拒绝'}} -->
										同意
									</text>
									<text class="iconfont icon-arrow_down_fat " @click.stop="expandOpe=true" style="border-left: 1rpx solid white;"></text>
								</view>
								<view class="text-danger mt-1" 
								@click="handleApply(apply,'refuse')"
								:style="expandOpe ? 'display:block':'display:none'">
								<!-- {{!opeSign ? '同意':'拒绝'}} -->
									拒绝
								</view>
							</view>
						</view>
					</view>
				</template>
			</YxCard>
		</view>
	</YxFlexibleWrapper>
</template>

<script>
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import YxNavbar from '@/components/yx-nav-bar.vue'
	import YxCard from '@/components/yx-card.vue'
	import {getFriendApplyList,handleFriendApply} from '@/api/friend.js'
	import {searchUser} from '@/api/user.js'
	import sessionStorage from '@/common/util/sessionStorage.js'
	import {timeToDay} from '@/common/util/publishTimeComputed.js'
	export default {
		components:{YxFlexibleWrapper,YxNavbar,YxCard},
		async mounted(){
			
			this.curUserId = sessionStorage.getStorage('user').id
			console.log('@api',await getFriendApplyList())
			this.applyList = await getFriendApplyList()
			
			
			 Promise.all( this.applyList.map(async(apply)=>{
				
				if(apply.user_id != this.curUserId){
					// 我发出的好友申请
					const {username,avatar} = await searchUser(apply.user_id)
					
					apply.username = username
					apply.avatar = avatar
				}else{
					// 别人发出的好友申请
					 const {username,avatar} = await searchUser(apply.friend_id)
					 
					 apply.username = username
					 apply.avatar = avatar
				}
			})).then(()=>{
				this.applyList = this.applyList.map(apply => {
				    apply.avatar= apply.avatar ? apply.avatar : '/static/logo1.png'
					// 展开申请好友信息
					apply.expandContent = false
					return apply
				})
				console.log('aa',this.applyList)
			})
			
		},
		data() {
			return {
				applyList:[],
				curUserId:0,
				// 添加好友时是否展开
				expandOpe:false,
				// 添加好友时选择的操作 , 1同意 0 拒绝
				opeSign: 1
			}
		},
		methods: {
			goAddFriend(){
				uni.navigateTo({
					url:'/pages/search-user/search-user'
				})
			},
			// 处理好友申请
			async handleApply(u,status){
				console.log('添加好友中！！',u)
				const ope = status === 'agree' ? '同意':'拒绝' 
				console.log('model',uni.showModal)
				uni.showModal({
					title:'好友处理',
					content:`你要${ope+u.username}成为你的好友吗?`,
					confirmText:ope,
					cancelText:'取消',
					confirmColor:'red',
					async success(res){
						if (res.confirm) {
							try{
								// 数据操作完成添加好友成功(数据写入数据库)
								const res = await handleFriendApply({user_id:u.user_id,status})
								console.log('处理结果',res)
								// 此时手动改变显示状态，不重新获取列表了，避免页面抖动(当下次进入页面获取的是操作完成后的状态)
								u.status = status
								uni.showToast({
									title:'好友操作完成'
								})
							}catch(e){
								//TODO handle the exception
							}
						
						} 
					}
				})
			},
			// 判断是否为自己发送的好友申请
			isMeSend(u){
				const me = sessionStorage.getStorage('user')
				return me.id == u.user_id
			},
			// 判断当前申请的状态(如果超过7天没同意或者是拒绝则为已过期，否则为已添加)
			applyStatus(u){
				const day = timeToDay(u.created_at)
				// debugger
				
				// 已经处理的请求或者是过期的请求
				if(day>=7 && u.status !=='agree') return '已过期'
				if(u.status == 'pending') return '添加中'
				if(u.status == 'refuse') return '被拒绝'
 				return '已添加'
			},
			// 判断当前添加是由谁发起的，确认处理行为
			isMeHandleAppLy(u){
				const day = timeToDay(u.created_at)
				// 我需要处理的请求
				if(u.friend_id == this.curUserId && day < 7 && u.status=='pending'){
					return true
				}
				return false
			}
		},
		computed:{
		}
	}
</script>

<style>

</style>
