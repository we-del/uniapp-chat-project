<template>
	<!-- <view class="fixed-top flex justify-between p-2 align-center pr-4 " :style="`top:${fixedTop}rpx`" style="background-color: #efefeb;"> -->
	<view class="fixed-top flex justify-between p-2 align-center pr-4 " :style="`top:${fixedTop}rpx`" style="background-color: #efefeb;">
		<view class="font-lg">{{title}}</view>
		<view>
			<text class="iconfont icon-search font-lg pr-5 font-lg" @click="goSearch"></text>
			<text class="iconfont icon-add font-lg " @click="handleClick"> </text>
		</view>
	</view>
	<!-- <view style="margin-top: 100rpx;"></view> -->
	<yx-popup v-if="!isSelf" :popItem="popData" :popPosittion="popPosition" :show="popShow" :isDark="true"  :isChat="true" :isCoverTop="true"
	@hide="popShow=false"></yx-popup>
	<!-- 占位墙 -->
	<!-- <view style="margin-top: 100rpx;"> </view> -->
</template>

<script>
	import YxPopup from '@/components/yx-popup.vue'
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		name:"yx-tool-bar",
		emits:['clickNav'],
		props:{
			title:[String],
			// 是否有自己的popup组件
			isSelf:{
				type:Boolean,
				default: false
			}
		},
		components:{YxPopup},
		mounted(){
			if(!this.isSelf){
				this.initPopup()
				console.log('初始化')
			}
			console.log('@tool',this)
		},
		data() {
			return {
				popShow: false,
				popPosition: {},
				popData :[]
			};
		},
		methods:{
			goSearch(){
				uni.navigateTo({
					url:'/pages/search-user/search-user'
				})
			},
			// 写死tool-bar的数据()
			initPopup(){
				const device = uni.getSystemInfoSync()
				const maxX = device.screenWidth
				const maxY = device.screenHeight
				this.popPosition={x:maxX-170,y:100}
				this.popIsDark = true
				this.popShow = false
				this.popData = [
					{
						id:1,
						icon:'icon-chat1',
						content:'发起群聊',
						
					},
					{
						id:2,
						icon:'icon-adduser',
						content:'添加朋友'						
					},
					{
						id:3,
						icon:'icon-saoyisao',
						content:'扫一扫'						
					},
					{
						id:4,
						icon:'icon-shoufukuan1',
						content:'收付款'						
					},
					{
						id:5,
						icon:'icon-help',
						content:'帮助与反馈'						
					},
				]
			},
			showPopup(){
				this.popShow = true
			},
			handleClick(){
				console.log('@clickcc',this)
				if(this.isSelf){
					this.$emit('clickNav')
				}else{
					this.showPopup() 
				}
			}
		},
		computed:{
			...mapState(useDeviceStore,['fixedTop']),
		}
	}
</script>

<style>

</style>