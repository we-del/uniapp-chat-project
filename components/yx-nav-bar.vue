<template>
	<view class="flex justify-between align-center p-2  fixed-top" :style="`top:${fixedTop}rpx`" :class="isOpacity ? 'bg-transparent':'bg-white'" >
	<!-- <view class="flex justify-between align-center p-2  position-fixed" :class="isOpacity ? 'bg-transparent':'bg-white'" > -->
		<view id="back-sign" class="icon-left iconfont mr-2" @click="back"></view>
		<view id="user-view" class="flex-1" :class="titleCenter ? 'text-center':''">{{title}}</view>
		<view v-if="existMore" id="more-detail" class="icon-ellipsis  iconfont" @click="navPush"></view>
		<view id="end-detail">
			<slot name="suffix"></slot>
		</view>
	</view>
	
	<!-- 遮挡填充 -->
	<!-- <view v-if="requireOccupy" style="padding-top: 90rpx;"></view> -->
</template>

<script>
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		name:"yx-nav-bar",
		props:{
			title:{
				type:String
			},
			existMore:{
				type:Boolean,
				default:false
			},
			requireOccupy:{
				type:Boolean,
				default:true
			},
			isOpacity:{
				type:Boolean,
				default:false
			},
			routerPath:{
				type:String
			},
			isChat:{
				type:Boolean,
				default:false
			},
			titleCenter:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			back(){
				if(!this.isChat){
					uni.navigateBack()
				}else{
					uni.switchTab({
						url:'/pages/tabbar/chat/chat'
					})
				}
			},
			navPush(){
				console.log('去往',this.routerPath)
				uni.navigateTo({
					// 路径信息和携带参数因由主组件传递
					url:this.routerPath
				})
			}
		},
		computed:{
			...mapState(useDeviceStore,['fixedTop']),
		}
	}
</script>

<style>

</style>