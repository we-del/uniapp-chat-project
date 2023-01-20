<template>
	<view :class="styleCustom" 
	class="zTop border-dark  p-2 flex t  position-fixed  rounded font-md" 
	:style="show ? `display:block;${position}`:`display:none;${position};`">
		<!-- 普通功能提示框 -->
		<view v-if="isChat">
			<view @click="handleReactive(item)" class="flex-1 "
			 v-for="(item,i) in popItem" :key="item.id"
			:style="i !== popItem.length-1 && item.content? 'margin-bottom:30rpx':''">
				<text v-if="item.icon" class="iconfont font-md p-1"  :class="item.icon"></text>
				<text v-if="item.content" class="font-md">{{item.content}}</text>
			</view>
		</view>
		<!-- 底部功能框 -->
		<view v-if="isBottom" class="transition-ease-fast" :style="`height:${popHeight}rpx;width:100%;`" >
			<slot name="util"></slot>
			<slot name="emo"></slot>
		</view>
		
		<view>
			<slot name="custom"></slot>
		</view>
	</view>
	<!-- 点击取消 -->
	<view @click="hide" :style="show ? 'display:block':'display:none'" :class="maskClass"  id="mask" class="fill-screen    position-absolute " style="left:0;top:0;"></view>
</template>

<script>
	export default {
		name:"yx-popup",
		emits:['hide','action'],
		props:{
			// pop展示的每条信息内容
			popItem:{
				Object,
				default: [
					{
						id:1,
						icon:'icon-chat1',
						content:'设为置顶',
						event:'setTop'
						
					},
					{
						id:2,
						icon:'icon-adduser',
						content:'删除该聊天',
						event:'delChat'
					},
				],
			},
			// pop所处的坐标位置
			popPosittion:{
				type:Object,
				default:{
					x:350,
					y:30
				}
			},
			// 背景颜色确定
			isDark:{
				type:Boolean,
				default: false
			},
			// 是否显示popup
			show:[Boolean],
			// 是否在底部显示
			isBottom:{
				type:Boolean,
				default:false
			},
			// 判断是否位chat地址框
			isChat:{				
				type:Boolean,
				default:false
			},
			// 判断是否为自制框
			isCustom:{				
				type:Boolean,
				default:false
			},
			// 在底部显示的情况下需要输入显示高度
			popHeight:{
				type:Number
			},
			popupContentOfUtilInBottom:[Array],
			utilArr:[Array],
			emoArr:[Array],
			// bottom显示下的模式 ，  util | emo
			bottomMode:[String],
			// 功能框点击过渡
			bottomClickTransition:[Boolean],
			// 是否需要给遮罩层进行深层覆盖
			isCoverTop:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
			};
		},
		methods:{
			// 执行对应的点击操作
			handleReactive(item){
				console.log('指令即将修改更改',item)
				this.$emit('action',item.event)
				// 隐藏聊天框
				this.$emit('hide')
			},
			hide(){
				console.log('我来完成隐藏')
				// 隐藏聊天框
				this.$emit('hide')
			}
		},
		computed:{
			position(){
				// 移动因子
				// let i = 1.4
				// console.log(uni.upx2px(this.popPosittion.x ))
				if(this.isBottom){
					
					return `left:${this.popPosittion.x}rpx;bottom:${this.popPosittion.y}rpx`
				}
				if(this.isChat){
					this.popPosittion.x*=2
					this.popPosittion.y*=2
				}
				return `left:${this.popPosittion.x}rpx;top:${this.popPosittion.y}rpx`
				// return !this.isBottom ? 
				// 						`left:${this.popPosittion.x}px;top:${this.popPosittion.y}px`
				// 						: `left:${this.popPosittion.x}px;bottom:${this.popPosittion.y}px`
			},
			styleCustom(){
				let res = ''
				if(this.isBottom){
					
					res+=this.isBottom ? ' fixed-bottom  bg-gray ' : ' border '
				}else{
					
					res +=this.isDark ? ' bg-dark text-white ':'bg-white text-dark '
				}
				return res
			},
			maskClass(){
				let res = ''
				if(this.isCoverTop){
					res+='zTop'
				}
				if(this.isCustom){
					res+='bg-dark lucency-5'
				}
				console.log('@pop',res)
				return res
			}
		}
	}
</script>

<style>

</style>