<template>
	<view class="flex justify-between  p-3 text-ellipsis"
	:hover-class="isCover ? 'bg-common':''" >
		<image class="rounded size-1" :src="img" style="width: 100rpx;height: 100rpx;" mode="aspectFill"></image>
		<view  class="flex flex-1 ml-2 flex-column justify-between">
			<view class="text-ellipsis font-md text-dark text-primary " >{{title}}</view>
			<view class="text-ellipsis font-sm text-common mb-1">
			{{desc}}
				<slot name="desc"></slot>
			</view>
		</view>
		<view  class="font-sm text-common" >
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"yx-card",
		props:{
			img:[String],
			title:[String],
			desc:[String],
			isCover:{
				type:[Boolean],
				default:true
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