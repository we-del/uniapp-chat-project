<template>
	<view>
		<yx-nav-bar title="" :existMore="false" :routerPath="`/pages/tabbar/find/find?${name}`">
			<template #suffix>
				<view class="p-1 font-sm main-bg-color text-white rounded">
					发布
				</view>
			</template>
		</yx-nav-bar>
		<yx-flexible-wrapper height="92vh" >
			<view @touchstart="touchStart" >
			
				<!-- 顶部配置 -->
				<view style="height: 40vh;">
					<image src="/static/images/friendCircleBg.png" mode="aspectFill" style="height: 100%;width:100%"></image>
				</view>
				<view class=" position-relative" style="height:150rpx">
					<view class="position-absolute" style="right:20rpx;top:-80rpx">
						<view class="flex align-center justify-end font-md text-white">
							Zz
							<view class="rounded overflow-hidden ml-2" style="width: 120rpx;height: 120rpx;">
								<image src="/static/logo.png" mode="aspectFill" style="width: 100%;height: 100%;"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="mt-2 p-1 " style="border-bottom: 1rpx solid #ccc;" v-for="dynamic in friendDynamicList" :key="dynamic.id">
					<yx-card :img="dynamic.user_img" :isCover="false">
						<template #desc>
							<!-- 内容边距 -->
							<view class="pr-2">
								<view class="dynamic-common-color font-md mb-1">{{dynamic.user_name}}</view>
								<view class=" mb-1 font-md text-dark">{{dynamic.content}}</view>
								<!-- 动态图片 -->
								<view class="mb-2 flex flex-wrap" v-if="dynamic.image_list.length > 0">
									<view class="size-2 m-1 flex-1" v-for="(img,i) in dynamic.image_list" :key="i">
										<image :src="img" mode="aspectFit" class="el-full"></image>
									</view>
								</view>
								<!-- 发布时间-点赞 -->
								<view class="m-2 flex justify-between align-center position-relative">
									<!-- <view>{{dynamic.publish_time}}</view> -->
									<view>{{publishTimeConvert(dynamic.publish_time)}}</view>
									<view class=" bg-common  p-1 " @click="toggleComment(dynamic)"> 
										<text class="font-sm ">更多</text>
									</view>
									<!--  伸展的选项 -->
									<view class="position-absolute grid grid-2 bg-dark grid-center-by-el transition-ease-fast " style="right:80rpx;top:0;grid-auto-rows: 60rpx;width:300rpx;" 
									:style="dynamic.expandComment ? 'opacity:1' :'opacity:0'" >
										<view @click="clickThumb(dynamic)"> {{dynamic.isThumb ? '取消点赞':'赞'}} </view>
										<view @click="clickComment">评论</view>
									</view>
								</view>
								<view class="bg-common p-1" v-if="dynamic.like_list.length > 0 || dynamic.reply_list.length>0">
									<!-- like列表 -->
									<view class="flex flex-wrap dynamic-common-color font-sm mb-1" v-if="dynamic.like_list.length > 0">
										<text class=" iconfont icon-aixin-xian mr-1 " style="margin-top: 3rpx;" ></text>
										<view v-for="(like_id,i) in dynamic.like_list" :key="like_id">
											{{like_id}} {{i != dynamic.like_list.length-1 ? ',' : ''}}
										</view>
									</view>
										<!-- 评论对话对列表 -->
										<view class="flex flex-wrap font-sm mb-1" v-for="reply_user in dynamic.reply_list" :key="reply_user.id" v-if="dynamic.reply_list.length>0">
											<view class="dynamic-common-color">{{reply_user.name}} 
												<text v-if="reply_user.having_reply_obj">
													<text class="text-dark">回复</text> 
													{{reply_user.having_reply_obj}}
												</text> 
												: 
											</view>
											<view class="text-dark ml-1">{{reply_user.replay_content}}</view>
										</view>
								</view>
							</view>
							
						</template>
					</yx-card>
				</view>
				
			</view>
			<!-- 回复评论时调用 -->
			<view class=" position-fixed bg-danger" style="width: 100%;height100%;" :style="commentInputStyle">
				<textarea  class="bg-common" :focus="isComment" style="width: 100%;max-height: 100rpx"  placeholder="我是tea"></textarea>
			</view>
		</yx-flexible-wrapper>
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import friendDynamicList  from '@/static/testData/friendCircleMessage.js'
	import YxCard from '@/components/yx-card.vue'
	import {publishTimeConvert} from '@/common/util/publishTimeComputed.js'
	export default {
		components:{YxNavBar,YxFlexibleWrapper,YxCard},
		mounted(){
			this.friendDynamicList = this.friendDynamicList.map(dynamic=>{
				// 装饰expandComment属性，用于判断当前是否开启评论
				dynamic.expandComment=false
				dynamic.isThumb = false
				return dynamic
			})
			if(uni.onKeyboardHeightChange){
				uni.onKeyboardHeightChange((e)=>{
					console.log('键盘高度改变了',e)
					this.keyboardHeight = e
				})
			}
		},
		data() {
			return {
				friendDynamicList,
				isComment:false,
				keyboardHeight:0,
				replyObj:'' // 回复对象
			}
		},
		methods: {
			publishTimeConvert,
			touchStart(){
				console.log('开始触摸了')
				// 取消所有评论的评论状态
				this.friendDynamicList.forEach(dynamic=>dynamic.expandComment = false)
				
				this.isComment = false
			},
			toggleComment(dynamic){
				dynamic.expandComment = !dynamic.expandComment
			},
			clickThumb(dynamic){
				dynamic.isThumb = !dynamic.isThumb
				if(dynamic.isThumb){
					dynamic.like_list.push('me')
				}else{
					const index = dynamic.like_list.findIndex(like=>like=='me')
					dynamic.like_list.splice(index,1)
				}
				console.log('点赞')
			},
			clickComment(){
				console.log('评论')
				this.isComment = true
			}
		},
		computed:{
			commentInputStyle(){
				let style = this.isComment ? 'opacity:1;':'opacity:0;'
				style+=`bottom:${ this.keyboardHeight ? this.keyboardHeight*2 : 500}rpx`
				console.log('@style',style)
				return style
			}
		}
	}
</script>

<style>

</style>
