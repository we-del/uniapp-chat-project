<template>
	<yx-nav-bar title="" :existMore="false" :routerPath="`/pages/tabbar/find/FriendCIrcle/FriendCIrcle?${name}`">
		<template #suffix>
			<view class="p-1 font-sm main-bg-color text-white rounded" @click="publishDynamic">
				发布
			</view>
		</template>
	</yx-nav-bar>
	<yx-flexible-wrapper>
		<view class="p-3">
			<!-- <view class="bg-common el-full"> -->
				<!-- 在文本域滑动时禁止（因触底或触顶）产生事件冒泡产生的全局滑动 -->
				<textarea v-model="content" class=" zTop" @touchstart.stop="" @touchmove.stop="" @touchend.stop="" :focus="true" style="max-height: 200rpx;width:100%" :maxlength="-1"  placeholder="分享这一刻的感想..."></textarea>
				<!-- 可添加图片进行描述 -->
				<view class="flex my-3 flex-wrap ">
					<view class="size-2 rounded bg-common overflow-hidden mr-1 mb-1" v-for="(img,i) in srcList" :key="i">
						<image :src="img" mode="aspectFill"></image>
					</view>
					<view class="size-2 rounded bg-common font-lg grid grid-center-by-grid-and-ele" @click="addImage">
						+
					</view>
				</view>
			<!-- </view> -->
		</view>
		<YxPopup isBottom :show="show" @hide="show = false" :popPosittion="{x:0,y:0}">
			<template #custom>
				<view class="grid  grid-center-by-grid-and-ele main-bg-color text-white rounded font-md" style="grid-auto-rows: 100rpx;">
					<view @click="cameraAction">拍摄</view>
					<view @clcik="getSrcFromAlbul">从相册选择</view>
					
					<!-- <view style="height: 10rpx;width:100vw" class="bg-white"></view> -->
					<view style="border-top: 10rpx solid white;width:100vw;"  class=" text-center py-2" @click="show=false">取消</view>
				</view>
			</template>
		</YxPopup>
	</yx-flexible-wrapper>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import friendDynamicList  from '@/static/testData/friendCircleMessage.js'
	import YxPopup from '@/components/yx-popup.vue'
	export default {
		components:{
			YxNavBar,YxFlexibleWrapper,YxPopup
		},
		mounted(){
			
		},
		data() {
			return {
				friendDynamicList,
				content:'',
				srcList:['/static/logo.png','/static/logo1.png','/static/logo1.png','/static/logo1.png'],
				show: true
			}
		},
		methods: {
			publishDynamic(){
				if(this.content){
					const publishDynmaicObj = {
						id:Math.random()*2000, // 随机id，用于即使测试
						user_img:'/static/logo.png', // 用户图片
						user_name:'me', // 用户名称
						content:this.content, // 发布内容
						image_list:this.srcList, // 发布的图片，可以为空
						publish_time: Date.now(), // 消息发布使用
						like_list:[], // 存储每个回复用户的id，通过id查找对应的name值
						reply_list:[]
						
					}
					this.friendDynamicList.push(publishDynmaicObj)
					this.content = ''
				}
			},
			addImage(){
				this.show = true
			},
			getSrcFromAlbul(){
				console.log('相册')
				const self = this
				plus.gallery.pick(({files})=>{
					files.forEach(path=>{
						self.srcList.push(path)
					})
				},(err)=>{
					console.log(err)
				},{
					multiple:true,
					permissionAlert:true,
					filter:'none'
				});
			},
			cameraAction(){
				const camera = plus.camera.getCamera();
				const self = this
				camera.captureImage((path)=>{
					// 照片虚拟路径，将虚拟路径存储到手机存储中
					plus.gallery.save(path,(path)=>{
						console.log('@success',path)
						self.srcList.push(path.file)
					})
				}, (err)=>{
					console.log(err)
				});
			}
		}
	}
</script>

<style>

</style>
