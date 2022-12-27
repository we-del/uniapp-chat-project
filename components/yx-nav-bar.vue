<template>
	<view class="flex justify-between align-center p-2 bg-white fixed-top">
		<view id="back-sign" class="icon-left iconfont mr-2" @click="back"></view>
		<view id="user-view" class="flex-1">{{title}}</view>
		<view id="more-detail" class="icon-ellipsis iconfont"></view>
	</view>
	
	<!-- <view style="margin-top: 90rpx;"></view> -->
</template>

<script>
	export default {
		name:"yx-nav-bar",
		props:{
			title:{
				type:String
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>