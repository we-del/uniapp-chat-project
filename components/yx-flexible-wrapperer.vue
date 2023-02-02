<template>
	<!-- 增加状态栏遮挡层，防止元素暴露 -->
	<view class="zTop bg-common  position-fixed" :style="`height:${fixedTop}rpx;top:0;width:100%`"></view>
	<!-- <view class="fill-screen overflow-hidden "> -->
	<!-- scroll-top 用于初始化加载一次滚动 -->
	<scroll-view  @scrolltoupper="scrollToTop" @scroll="scrolling" @scrolltolower="scrollToBottom" scroll-y="true" 
	:scroll-top="scrollTop" :scrollinto-view="scrollIntoView"
			class="position-fixed font-md "  :style="contentShowBorder">
			
		<!-- 内容区域 -->
			
			<!-- 顶部占位 -->
			<!-- <view  class="bg-transparent"  :style="topBox"></view> -->
			<!-- ！！滚动到顶部和底部事件只有在能完成滚动时才能够触发，达到滚动条件 -->
			<!-- 当触底或触顶时按固定定位进行显示 -->
			<!-- <view class="position-fixed" > -->
			
			<!-- 滑动策略1 给一个position:fixed进行滑动失败 上滑动生效，下滑动因为其默认行为每次都会回到顶部失败 ;; bug以解决，通过改变scroll-view内容进行处理即可 -->
			<!-- 滑动策略2 给一个position:absolute进行滑动 -->
			<!-- 滑动策略3 给一个上下占位框(透明)，其高度为0，实际高度通过滑动的距离确定 ，下拉存在bug，因为只有滑动时内容才能被展示(上拉之所以为bug因为首元素在其前，不需要滑动即可加载)。使用定位解决？-->
			
			<!-- 可完成底部滚动，当触摸事件添加到scroll-view上时无法完成底部滚动 -->
			<!-- 策略一 -->
			<!-- <view :style="requireScroll"   @touchstart="handleTouchStart"   @touchend="handleTouchEnd" @touchmove="handleTouchMove" style="height: 100vh;"> -->
			<!-- 策略二 -->
			<!-- <view  style="height:90%"  @touchstart="handleTouchStart"   @touchend="handleTouchEnd" @touchmove="handleTouchMove" > -->
			
			<view  style="height:100vh"  @touchstart="handleTouchStart"   @touchend="handleTouchEnd" @touchmove="handleTouchMove" >
			
				
				<slot>		
				</slot>
				
			</view>
			
			<!-- 底部占位 -->
			<!-- <view  class="bg-transparent" :style="bottomBox"></view> -->
	</scroll-view>
	<!-- </view> -->
</template>

<script>
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		name:"yx-flexible-wrapperer",
		emits:['scroll'],
		props:{
			bottom:{
				type:String,
				default:'12vh'
			},
			height:{
				type:String,
				default:'100vh'
			},
			scrollIntoView:{
				type:String
			},
			scrollTop:{
				type:Number,
				default:4
			}
		},
		data() {
			return {
				// 初始状态默认有内容滚动
				havingContentScrolling:true,
				// 初始状态如果是下拉则能够进行滚动(上拉加载更多内容)
				reachBorder:true,
				scrollDirection:'top',
				movingPosition:{},
				// 滑动的距离
				movingDistance: 0,
				isReachingBorder:false,
				// 内容不足以开启滑动时，两边内容都可以进行滑动
				contentLack:true,
				// 内容缺失时进行上拉
				contentLackToTop:false,
				// 记录首屏加载，如果是首屏加载则双重判断，否则反之
				isFirstLoad : true
				// 滑动定时器，定时器个数解决滑动bug
				// timer:null
			};
		},
		methods:{
			scrolling(e){
				// 使用执行任务优先级达到限制效果
				// if(this.timer){
				// 	clearTimeout(this.timer)
				// }
				// this.timer = setTimeout(()=>{
					// 用于首屏加载判断内容是否溢出可视范围，溢出了则会执行此
					if(this.isFirstLoad ){
						this.isFirstLoad = false
						this.contentLack = false
					}
					if(!this.havingContentScrolling ||this.isFirstLoad && this.scrollDirection ) return
					console.log('滑动中',this.havingContentScrolling)
					this.contentLack = false
					this.reachBorder = false
					this.isReachingBorder  = false
					this.scrollDirection = ''
					this.isFirstLoad = false
				// },10)
				// this.$emit('scroll')
			},
			scrollToTop(e){
				
				this.havingContentScrolling = false
				console.log('滚动到顶部',this.havingContentScrolling)
				this.reachBorder = true
				this.scrollDirection = e.detail.direction
			},
			scrollToBottom(e){
				
				this.havingContentScrolling = false
				console.log('滚动到底部',e)
				this.reachBorder = true
				this.scrollDirection = e.detail.direction
			},
			handleTouchStart(e){
				// 每次点击的时候的值都应该记录，避免出现NaN | undefined情况
				// if(this.reachBorder){
					let x = e.changedTouches[0].clientX
					let y =  e.changedTouches[0].clientY
					this.movingPosition = {x,y}
					// 触摸边界，开始变化
					// this.reachBorder = true
					console.log('开始触摸',e)
				// }
			},
			handleTouchMove(e){
				// console.log('moving')
				if(this.reachBorder){
					let x = e.changedTouches[0].clientX
					let y =  e.changedTouches[0].clientY
					// 无法触顶或触底原因：在触摸顶部时，要记录第一次touch的值
					let distance
					// 此属性用于判断当前内容是否溢出了可视范围，如果溢出了则进行上下拉
					if(this.contentLack){
						distance = this.movingPosition.y - y 
						this.contentLackToTop = distance > 0
						this.movingDistance =  distance
						this.isReachingBorder = true
						console.log('内容缺失')
					}else if(this.scrollDirection === 'top'){
						// 允许下拉(origin-y < 0)
						distance = this.movingPosition.y - y 
						if(distance< 0){
							// 下拉
							this.movingDistance = distance
							this.isReachingBorder = true
							console.log('成功的下拉')
						}else if(distance){
							// 正常的滚动
							this.havingContentScrolling =true
							this.reachBorder = false
							this.isReachingBorder = false
							this.scrollDirection = ''
							this.isFirstLoad = false
							console.log('下拉结束，开始滑动')
						}
					}else if(this.scrollDirection === 'bottom'){
						// 允许上拉(origin-y > 0)
						distance = this.movingPosition.y - y
						if(distance> 0){
							// 上拉
							this.movingDistance = distance
							console.log(this.movingDistance)
							this.isReachingBorder = true
							console.log('成功的上拉')
						}else if(distance){
							// 正常的滚动
							this.havingContentScrolling =true
							this.reachBorder = false
							this.isReachingBorder = false
							this.scrollDirection = ''
							
							this.isFirstLoad = false
							console.log('上拉结束，开始滑动')
						}
						
					}
					
					console.log('distance',distance)
				}
			},
			handleTouchEnd(e){
				if(this.reachBorder){
					console.log('结束移动',e)
					
					
					// 恢复初始状态
					// 初始状态默认有内容滚动
					this.havingContentScrolling =true
					// 初始状态如果是下拉则能够进行滚动(上拉加载更多内容)
					this.reachBorder = true
					this.isReachingBorder  = false
					this.movingDistance = 0
					// 重置距离
					this.movingPosition  = {}
				}
			}
		},
		computed:{
			...mapState(useDeviceStore,['fixedTop']),
			
			
			// 策略一
			// requireScroll(){
			// 	let style = ''
			// 	if(this.isReachingBorder ){
			// 		if(this.scrollDirection === 'top'){
						
			// 			style+= `position:fixed;top:${this.movingDistance*-2}rpx;left:0`
			// 			// style+= `top:${this.movingDistance*-2}rpx;left:0`
			// 		}else if(this.scrollDirection === 'bottom'){
			// 			console.log('底部滚动距离',this.movingDistance)
			// 			// style+= `position:fixed;bottom:${this.movingDistance*2}rpx;top:${this.movingDistance*-2}rpx;`
			// 			style+= `position:fixed;bottom:${this.movingDistance*2}rpx;left:0;top:${this.movingDistance*-2}rpx;`
			// 			// style+= `bottom:${this.movingDistance*2}rpx;left:0`
			// 		}
					
			// 	}
			// 	console.log('@style',style)
			// 	return style
			// },
			// 策略三
			// topBox(){
			// 	if(this.scrollDirection === 'top'){
			// 		console.log(this.movingDistance)
			// 		return `height:${Math.abs(this.movingDistance)}rpx;width:100vw;`
			// 	}
			// 	return ''
			// },
			// bottomBox(){
			// 	if(this.scrollDirection === 'bottom'){
					
			// 		return `position:fixed;bottom:0rpx;height:${this.movingDistance}rpx;width:100vw;`
			// 	}
			// 	return ''
			// },
			contentShowBorder(){
				// 下拉 或 没内容时下拉时走此
				if(this.scrollDirection === 'bottom' || this.contentLackToTop){
					return `top:${this.fixedTop+100-this.movingDistance}rpx;bottom:${this.bottom};height:${this.height}`
				}else if(this.scrollDirection === 'top'){
					// 上拉 或 没内容上拉时走此(初始为top)
					return `top:${this.fixedTop+100+Math.abs(this.movingDistance)}rpx;bottom:${this.bottom};height:${this.height}`
				}
				return `top:${this.fixedTop+100}rpx;bottom:${this.bottom};height:${this.height}`
			}
		}
	}
</script>

<style>

</style>