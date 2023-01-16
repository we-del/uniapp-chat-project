<template>
	<view class="flex justify-between align-center  pl-2 border-bottom font-md" style="height:100rpx">
		<view >
			<slot name="prefix"></slot>
		</view>
		<text v-if="icon" :class="`iconfont font-md ${icon}` "></text>
		<view v-if="img" class="rounded overflow-hidden" style="width: 75rpx;height:75rpx;">
			<image :src="img" style="width:100%;height:100%" mode="aspectFill"></image>
		</view>
		<view class="flex-1  ml-2 ">
		{{title}}
		</view>
		<view style="font-weight:300">
			<slot name="suffix" ></slot>
		</view>
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