<template>
	<view @click="handleAudio" @touchstart="(e)=>touchMessageOfChat(chatMessage,e)" @touchend="(e)=>touchLeaveMessageOfChat(chatMessage,e)"   class="font-md overflow-hidden">
		<view v-if="chatMessage.type === 'text'" class="text-overflow-line p-1" > 
			<view v-html="chatMessage.data"></view>
			<!-- {{}} -->
		</view>
		<image v-if="chatMessage.type==='image'" @click="validPreviewOfImage(chatMessage.data)" mode="scaleToFill" :src="chatMessage.data" style="height:250rpx;width:200rpx"></image>
		
		<view v-if="chatMessage.type === 'audio'"  class="p-1" 
		style="min-width: 130rpx;max-width: 440rpx;" :style="`width:${recordWidth}rpx`" >
			<!-- 判断是哪一方的信息，便于在正确的位置上显示 -->
			<!-- 我方录音消息 -->
			<view v-if="chatMessage.user_id == user_id"   class="flex justify-end  ">
				{{chatMessage.record_time}}"
				<image v-if="playAudio" src="/static/audio/play.gif" class="play-icon" ></image>
				<text v-else class=" iconfont icon-wifi rotate-right-90 ml-2"></text>
			</view>
			<!-- 对方录音消息 -->
			<view v-if="chatMessage.user_id != user_id" class="flex justify-start ">
				<image v-if="playAudio" class="play-icon" src="/static/audio/play.gif" ></image>
				<text v-else class="iconfont icon-wifi rotate-left-90 mr-2"></text>
				{{chatMessage.record_time}}"
			</view>
		</view>
		<view v-if="chatMessage.type==='video'" class="overflow-hidden">
			<video  :src="chatMessage.data" style="width:300rpx;height:400rpx"  play-btn-position="center"  @loadedmetadata="videoFirstLoad"></video>
		<!-- <image :src="videoImage"></image> -->
		</view>
	</view>
</template>

<script>
	import sessionStorage from '@/common/util/sessionStorage.js'
	export default {
		name:"yx-chat-item-content",
		inject:["validPreviewOfImage","touchMessageOfChat","touchLeaveMessageOfChat"],
		props:{
			chatMessage:[Object]
		},
		mounted(){
			this.user_id = sessionStorage.getStorage('user').id
			console.log('uuu',this.user_id )
		},
		data() {
			return {
				// 音频管理器
				// #ifdef APP-PLUS
				audioManager: plus.audio.createPlayer({}),
				// #endif
				playAudio:false,
				videoImage:'',
				user_id:''
			}
		},
		methods: {
			videoFirstLoad(width,height,during){
				console.log(width,height,during)
			},
			handleAudio(){
				if(this.chatMessage.type !=='audio') return
				// 监听播放录音开始
				this.audioManager.addEventListener('play', ()=>{
					// 回到初始状态
					this.audioManager.seekTo(0)
					this.playAudio = true
				});
				// 监听播放录音结束(自然结束，播放完成)
				this.audioManager.addEventListener('stop', ()=>{
					this.playAudio = false
				});
				// 监听播放录音结束(手动结束，播放终止)
				this.audioManager.addEventListener('ended', ()=>{
					this.playAudio = false
				})
				// 监听播放录音结束(暂停)
				this.audioManager.addEventListener('pause', ()=>{
					this.playAudio = false
				})
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


<style scoped>
	.play-icon{
		display:inline-block;
		margin: 0 10rpx;
		height: 40rpx;
		width: 40rpx;
	}
</style>
