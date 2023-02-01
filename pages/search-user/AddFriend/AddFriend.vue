<template>
	<view>
		<YxNavBar title="申请添加好友" titleCenter></YxNavBar>
		<scroll-view scroll-y="true" class="position-fixed" style="top:7%;bottom:10%">
			<view class="p-3 font-md">
				
				<!-- 发送申请的消息 -->
				<view class="my-3">
					<view class="mb-2 pl-2 font-sm text-common">发送添加朋友申请</view>
					<textarea v-model="applyInfo.apply_message" class="p-2 bg-common" style="height:120rpx;width:86vw" maxlength="50"></textarea>
				</view>
				<!-- 设置备注 -->
				<view class="my-3">
					<view class="mb-2 pl-2 font-sm text-common">设置备注</view>
					<input  class="p-2 bg-common" type="text" maxlength="12" 
					@input="e=>applyInfo.nickname = e.detail.value" :value="applyInfo.nickname"/>
					</view>
				<!-- 朋友圈状态  不看他，不准他看我-->
				<view class="my-2">
					<view class="mb-2 pl-2 font-sm text-common">朋友圈</view>
					<view class="p-2 bg-common">
						<YxList>
							<template #prefix>
								<view>不让他看我</view>
							</template>
							<template #suffix>
								<switch :checked="applyInfo.lookme" color="#42b983" 
								@change="(e)=>applyInfo.lookme = e.detail.value * 1" />
								<!-- @change="(e)=>applyInfo.lookme = e.detail.value" -->
							</template>
						</YxList>
						<YxList>
							<template #prefix>
								<view>不看他</view>
							</template>
							<template #suffix>
								<switch :checked="applyInfo.lookhim" color="#42b983"  @change="(e)=>applyInfo.lookhim = e.detail.value *1" />
							</template>
						</YxList>
					</view>
					
					<!-- <view class="mb-2 pl-2 font-sm text-common">发送添加朋友申请</view>
					<textarea class="p-2 bg-common" style="height:120rpx;width:86vw" maxlength="50"></textarea> -->
				</view>
			</view>
		</scroll-view>
		<view class="fixed-bottom py-2 text-center rounded main-bg-color text-white font-md" 
		style="bottom:50rpx;width:30vw;left:35%" @click="sendApply">发送</view>
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	import {sendFriendApply} from '@/api/friend.js'
	export default {
		components:{
			YxNavBar,YxList
		},
		// 能使用路由参数经量使用路由参数，实在无法处理就使用全局仓库
		onLoad(query){
			this.applyInfo.friend_id =  parseInt(query.id) 
		},
		data() {
			return {
				applyInfo:{
					"friend_id": 4,
					"lookme": 1,
					"lookhim": 1,
					"nickname": "我是铃音",
					"apply_message":""
				}
			}
		},
		methods: {
			fn(e){
				console.log('当前是',e.detail.value)
				console.log('当前是',typeof e.detail.value)
			},
			async sendApply(){
				// debugger
				if(!this.applyInfo.apply_message.length) this.applyInfo.apply_message = ' '
				const res = await sendFriendApply(this.applyInfo) 
				console.log('res',res)
				uni.showToast({
					title:res
				})
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
