<template>
	<view class="flex justify-between align-center pl-2" style="height:100rpx">
		<text v-if="icon" :class="`iconfont font-md ${icon}` "></text>
		<view v-if="img" style="width: 60rpx;height:60rpx;">
			<image :src="img" style="width:100%;height:100%" mode="aspectFill"></image>
		</view>
		<view class="flex-1 border-bottom ml-2 " style="line-height: 70rpx;font-size: 26rpx;">
		{{title}}
		</view>
		<slot name="suffix"></slot>
		<view v-if="isCell" class="iconfont icon-right mr-2"></view>
	</view>
</template>

<script>
	export default {
		name:"yx-list",
		props:{
			item:{
				type:Object,
				default:{
					title:'展示',
					img:'/static/contact/1.pngg'
				}
			},
			title:[String],
			img:[String],
			icon:[String],
			isCell:{
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>