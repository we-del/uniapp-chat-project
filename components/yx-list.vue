<template>
	<view class="flex justify-between align-center  pl-2  font-md" :class="havingBottomBorder ? 'border-bottom':'' "  style="height:100rpx">
		<view >
			<slot name="prefix"></slot>
		</view>
		<text v-if="icon" :class="`iconfont font-md ${icon}` "></text>
		<view v-if="img" class="rounded  position-relative" style="width: 75rpx;height:75rpx;">
			<image :src="img" style="width:100%;height:100%" mode="aspectFill"></image>
			<YxBadge style="top:0;right:-10rpx" :messageCount="count"></YxBadge>
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
	import YxBadge from '@/components/yx-badge.vue'
	export default {
		name:"yx-list",
		components:{YxBadge},
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
			havingBottomBorder:{
				type:Boolean,
				default:true
			},
			isCell:{
				type:Boolean,
				default: false
			},
			// badge的消息个数
			count:{
				type:Number,
				default:0
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