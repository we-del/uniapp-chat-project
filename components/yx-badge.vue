<template>
	<view id="badge"  class="rounded-circle bg-danger font-sm p-1 position-absolute">
		{{count}}
	</view>
</template>

<script>
	export default {
		name:"yx-badge",
		props:{
			messageCount:{
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			count(){
				return this.messageCount > 99 ? `99+` : this.messageCount
			}
		}
	}
</script>

<style>
#badge{
	margin-left:75rpx;margin-top: -10rpx;
	height:15rpx;
	font-size: 10rpx;
	/* color: #ec242c; */
	line-height: 15rpx;
	text-align: center;
	color: white;
}
</style>