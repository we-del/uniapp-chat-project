<template>
	<view class="bg-common fill-screen font-sm position-fixed overflow-hidden" :class="bgColor" :style="`top:${fixedTop}rpx;`">
		<slot></slot>
	</view>
</template>

<script>
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		name:"yx-common-wrapper",
		props:{
			bg:{
				type:String,
				default:'common'
			}
		},
		mounted(){
		},

		data() {
			return {
			};
		},
		methods:{
		},
		computed:{
			// computed其实就是defineProperty数据劫持  mapState只读 ，mapWritableState可读可写
			...mapState(useDeviceStore,['fixedTop']),
			bgColor(){
				switch (this.bg){
					case 'common':
						return 'bg-common'
					case 'white':
						return 'bg-white'
					default:
						console.log('没有匹配到样式')
					break;
				}
			}
		}
	}
</script>

<style>

</style>