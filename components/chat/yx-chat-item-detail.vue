<template>
	<view>
		
			<text v-if="chatMessage.showTime && !chatMessage.isDel" class="ele-center mb-2 font-sm text-common">
				<!-- 2022年12月13日 13:21 -->
				{{time}}
			</text>
			
			<!-- 我方信息 -->
			<view class="flex justify-end p-2 position-relative " 
				v-if="chatMessage.user_id == 0 && !chatMessage.isDel && !chatMessage.isUndone" >
				<!-- 三角 -->
				<view id="me-triangle" class="position-absolute left-triangle"
					style="top:40rpx;right:81rpx;border-left-color:#08c060"></view>
					
				<view class="mr-2 font-small main-bg-color p-1 rounded " 
				style="line-height: 38rpx;min-height:40rpx;max-width:500rpx">
					<yx-chat-item-content :chatMessage="chatMessage"></yx-chat-item-content>
				</view>
			
				<image @click="toUserMessagePage" :src="chatMessage.user_image" mode="scaleToFill" style="width: 60rpx;height:60rpx;"></image>
			</view>
			
			<!-- 对方信息 -->
			<view class="flex justify-start p-2 position-relative" 
				v-if="chatMessage.user_id != 0   && !chatMessage.isDel && !chatMessage.isUndone" >
				<!-- 三角 -->
				<view id="other-triangle" class="position-absolute right-triangle" 
				style="top:40rpx;left:81rpx;border-right-color:white"></view>
				<image @click="toUserMessagePage" :src="chatMessage.user_image" mode="scaleToFill" style="width: 60rpx;height:60rpx;"></image>
								
				<view class="ml-2 font-small bg-white p-1 rounded" style="line-height: 38rpx;min-height:40rpx;max-width:500rpx">
					<yx-chat-item-content :chatMessage="chatMessage"></yx-chat-item-content>
				</view>
			</view>
			
			<!-- 信息被撤回 -->
			<view v-if="chatMessage.isUndone" class="flex justify-center align-center text-common font-sm m-2">
				该消息已撤回
			</view>
			<!-- 消息内容类型(文本，语音，图片，视频) -->
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import YxChatItemContent from '@/components/chat/yx-chat-item-content.vue'
	export default {
		name:"yx-chat-item-detail",
		components:{
			YxChatItemContent
		},
		props:{
			chatMessage:{
				type:Object,
				default:{
					// user_id标识是那个用户发送得信息，0为本人，其他为其他人
					user_id:0,
					// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
					// type:'text',
					type:'image',
					// 标识消息发送时间  number | null 用于标识是否出现时间文本
					// message_time:1671783711881,
					message_time:Date.now()-10000,
					// 用于存储用户数据
					// data: '我是数据',
					data: '/static/images/bg.jpg',
					user_image:'/static/logo.png',
					showTime: true
				}
			}
		},
		mounted(){
		},
		
		data() {
			return {
			};
		},
		methods:{
			toUserMessagePage(){
				uni.navigateTo({
					url: `/pages/UserInfo/UserInfo`
				})
			}
		},
		computed:{
			time(){
				return dayjs(this.chatMessage.message_time).format('YYYY年MM月DD日 HH:mm')
			}
		}
	}
</script>

<style>

</style>