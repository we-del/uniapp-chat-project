<template>
	<view @touchstart="isValidSetTouch(chatMessage)" style="overflow: auto;" class="font-md">
		<view v-if="chatMessage.type === 'text'" class="text-overflow-line p-1" > 
		<view v-html="chatMessage.data"></view>
		<!-- {{}} -->
		</view>
		<image v-if="chatMessage.type==='image'" mode="scaleToFill" :src="chatMessage.data" style="height:250rpx;width:200rpx"></image>
		
	</view>
</template>

<script>
	export default {
		name:"yx-chat-item-content",
		inject:["isValidSetTouch"],
		props:{
			chatMessage:[Object]
		},
		mounted(){
			
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
