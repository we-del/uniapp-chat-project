<template>
	<view @click="handleAudio" @touchstart="(e)=>touchMessageOfChat(chatMessage,e)" @touchend="(e)=>touchLeaveMessageOfChat(chatMessage,e)"  style="overflow: auto;" class="font-md">
		<view v-if="chatMessage.type === 'text'" class="text-overflow-line p-1" > 
			<view v-html="chatMessage.data"></view>
			<!-- {{}} -->
		</view>
		<image v-if="chatMessage.type==='image'" @click="validPreviewOfImage(chatMessage.data)" mode="scaleToFill" :src="chatMessage.data" style="height:250rpx;width:200rpx"></image>
		
		<view v-if="chatMessage.type === 'audio'"  class="p-1" 
		style="min-width: 130rpx;max-width: 440rpx;" :style="`width:${recordWidth}rpx`" >
			<!-- 判断是哪一方的信息，便于在正确的位置上显示 -->
			<!-- 我方录音消息 -->
			<view v-if="chatMessage.user_id == 0"   class="flex justify-end  ">
				{{chatMessage.record_time}}"
				<text class="iconfont icon-wifi rotate-right-90 ml-2"></text>
			</view>
			<!-- 对方录音消息 -->
			<view v-if="chatMessage.user_id != 0" class="flex justify-start ">
				
				<text class="iconfont icon-wifi rotate-left-90 mr-2"></text>
				{{chatMessage.record_time}}"
			</view>
		</view>
		<view v-if="chatMessage.type==='video'">
			
		</view>
	</view>
</template>

<script>
	export default {
		name:"yx-chat-item-content",
		inject:["validPreviewOfImage","touchMessageOfChat","touchLeaveMessageOfChat"],
		props:{
			chatMessage:[Object]
		},
		mounted(){
			
		},
		data() {
			return {
				// 音频管理器
				// #ifdef APP-PLUS
				audioManager: plus.audio.createPlayer({})
				// #endif
			}
		},
		methods: {
			handleAudio(){
				if(this.chatMessage.type !=='audio') return
				console.log('播放录音',this.chatMessage)
				this.audioManager.setStyles({src:this.chatMessage.data})
				this.audioManager.play()
			}
		},
		computed:{
			recordWidth(){
				// 最长输入时间为60s
				// 因此把其分为10分 每一份则在原基础上+30，每满 6 就进一步增加宽度
				// 如果为一份或不足一份 按 最低的宽度展示
				// 只有录音存在record_time字段，因此需要做判断
				let time = this.chatMessage.record_time
				if(time){
					// 只有1份2
					if(time <= 6){
						return 130
					}
					// 此时说明有一份以上的数据需要处理，将第一份取出
					let resWidth = 130
					time -=6 
					while(time > 0){
						resWidth +=30
						time-=6
					}
					return resWidth
				}
			}
			
		}
	}
</script>

<style>

</style>
