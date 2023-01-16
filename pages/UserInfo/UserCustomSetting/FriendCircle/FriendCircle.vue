<template>
	<view>
		<yx-nav-bar title="" :existMore="false" :isOpacity="true" :requireOccupy="false"  v-if="!expandBackground"></yx-nav-bar>
		<view @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
			<!-- 为了适配屏幕而单位需要统一，这里使用vh作为单位则下面的外边距也要使用vh（不适用vh则无法达到适配）,使用device拿到当前屏幕的信息根据移动距离换算出vw | vh -->
			<!-- <view class="position-absolute bg-common "   style="left:0;height:80vh;width:100vw" :style="`top:${sliderBgDistance}rpx`"> -->
			<view class="position-absolute bg-common "   style="left:0;height:80vh;width:100vw" :style="`top:${sliderBgDistance}vh`">
				<image src="/static/images/friendCircleBg.png" style="width:100%;height:100%"></image>
				<view class="zTop position-relative" >
					<view class="position-absolute p-1 rounded-circle border font-sm text-white text-center" style="right:30rpx;top:-80rpx;border-color: white;width: 80rpx;" v-if="expandBackground">❤ 赞</view>
				</view>
			</view>

			<!-- 展示用户图片和姓名 -->
			<!-- 上面布局使用了absolute脱离了文档流，因此我们这里的盒子会出现在第一行，因此需要使用外边距来进行移动达到正确的位置 -->
			<!-- <view class="flex  justify-end p-2 align-center " :style="`padding-top: ${350+sliderHeight}rpx;`"> -->
			<view class="flex  justify-end p-2 align-center " :style="`padding-top: ${25+sliderHeight}vh;`">
				<view class="mr-2 zTop text-common-font font-sm">我是mera</view>
				<view class="rounded overflow-hidden" style="width: 100rpx;height:100rpx"> 
					<image src="/static/logo.png" style="width: 100%;height: 100%;"></image>
				</view>
			</view>
			<!-- 展示具体信息 -->
			<view class="mt-5 pt-5">
				<view class="flex align-start p-2" v-for="data in showList" :key="data.id">
					<view class="font-lg font-weight-bold ">{{data.publish_time}}</view>
					<view class="rounded overflow-hidden mx-2" style="width: 140rpx;height:140rpx">
						<image :src="data.img" style="width: 100%;height: 100%;"></image>
					</view>
					<view class="flex-1 text-overflow-line-2">{{data.message}}</view>
				</view>
				<view class="  font-sm text-common text-center" v-if="commentCount>3">点击查看更多信息 ></view>
			</view>
			<view class="p-5 font-small flex text-common align-center">
				<view class="flex-1" style="border: 1rpx solid #ccc"></view>
				<view class="mx-2">朋友仅展示{{true?'三天':'一个月'}}的朋友圈</view>
				<view class="flex-1" style="border: 1rpx solid #ccc"></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	
	export default {
		onLoad(query){
			// console.log('@id',query)
			
		},
		components:{
			YxNavBar,YxList
		},
		mounted(){
			this.listData = [
				{
					id:Math.random()*2000,
					publish_time:'昨天',
					img:'/static/logo.png',
					message:'我发不了一个评论，快来和我一起讨论吧，期待你的加入'
				},
				{
					id:Math.random()*2000,
					publish_time:'今天',
					img:'/static/logo.png',
					message:'天行健，君子以自强不息。人生是一场努力，就算结局是一个烧糊的花卷子，也不要懊悔自己曾经的一番烈火锻炼。人生风景在路过，不在结局'
				},
				{
					id:Math.random()*2000,
					publish_time:'16点',
					img:'/static/logo.png',
					message:'人生就是这样，得失无常，常存安静之心，常存宽容之心，心里放不下，自然就成了负担，负担越多，人生就越不快乐。优雅的人生，就是用平静的心，平和的心态，别再为错过了什么而懊悔。'
				},
				{
					id:Math.random()*2000,
					publish_time:'前天',
					img:'/static/logo.png',
					message:'【节俭格言】：天下之事，常成于勤俭而败于奢靡。——陆游 人生格言 身外障碍事小，心中障碍事大。——爱默生 财富与胆识同在。——维吉尔（古罗马诗人）实力的来源不是胜利。唯有奋斗才能增强实力。当你历经苦难而不气馁，那就是...'
				},
			]
		
			
			if(window){
				console.log('浏览器屏幕',window?.screen)
				this.screenInfo.width = window.screen.width
				this.screenInfo.height = window.screen.height
			}else if(plus){
				console.log(plus.device)
				console.log('手机设备信息',plus.screen)
				
				this.screenInfo.width = plus.screen.resolutionWidth
				this.screenInfo.height = plus.screen.resolutionHeight
				// this.screenInfo.width = plus.
				// this.screenInfo.height = plus.resolutionHeight
			}
		},
		data() {
			return {
				targetId:'',
				expandBackground:false,
				listData:[],
				sliderStartY:0,
				sliderHeight:0,
				screenInfo:{
					width:'',
					height:''
				}
				
			}
		},
		methods: {
			handleTouchStart(e){
				this.sliderStartY = e.changedTouches[0].clientY
			},
			handleTouchMove(e){
				let y = e.changedTouches[0].clientY
				let target = y - this.sliderStartY 
				// rpx
				// this.sliderHeight =  target > 0 ? target * 2 : 0
				// vw
				/*
				 元素所占vw求法
				  vw = 100 / 设备宽度 * 元素px宽度
				  vh = 100 / 设备高度 * 元素px高度
				*/
				 let dest =  target > 0 ?  100/ this.screenInfo.height * target: 0
				 dest =  dest > 25 ? 25 +(dest*0.2): dest
				 console.log('dest',dest)
				 this.sliderHeight = dest
			},
			handleTouchEnd(e){
				// rpx
				// this.expandBackground = this.sliderHeight>300
				// vw
				this.expandBackground = this.sliderHeight>25
				if(this.expandBackground){
					// 超出边界展示全部背景图
					this.sliderHeight = 120
				}else{
					this.sliderStartY=0
					this.sliderHeight=0
				}
				
			},
			handleObjEvent(data){
				console.log('data',data)
				switch (data.event){
					case 'tag':
						this.routerGo('/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag')
						break;
					case 'auth':
						this.routerGo('/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth')
						break;
					case 'recommend':
						this.routerGo('/pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend')
						break;
					default:
					console.log('无法处理此配置')
						break;
				}
			},
			routerGo(path){
				uni.navigateTo({
					url:path
				})
			}
		},
		computed:{
			sliderBgDistance(){
				// rpx
				// const distance = -800 + this.sliderHeight
				
				// return distance > 0 ? 0 : distance

				// vw
				const distance = -50 + this.sliderHeight
				console.log('slider',this.sliderHeight)
				return distance > 0 ? 0 : distance
			},
			commentCount(){
				return this.listData.length
			},
			showList(){
				
					return this.listData.splice(0,2)
			},
			sliderVh(){
				return 100/ this.screenInfo.height * target
			}
		}
	}
</script>

<style>

</style>
