<template>
	<yx-nav-bar title="" :existMore="false" :routerPath="`/pages/tabbar/find/FriendCIrcle/FriendCIrcle?${name}`">
		<template #suffix>
			<view class="p-1 font-sm main-bg-color text-white rounded" @click="publishDynamic">
				发布
			</view>
		</template>
	</yx-nav-bar>
	<yx-flexible-wrapper>
		<!-- <view class="p-3" @click="clearImgUtilState"> -->
		<view class="p-3" >
			<!-- <view class="bg-common el-full"> -->
				<!-- 在文本域滑动时禁止（因触底或触顶）产生事件冒泡产生的全局滑动 -->
				<textarea v-model="content" class=" zTop" @touchstart.stop="" @touchmove.stop="" @touchend.stop="" :focus="true" style="max-height: 200rpx;width:100%" :maxlength="-1"  placeholder="分享这一刻的感想..."></textarea>
				<!-- 可添加图片进行描述 -->
				<view class="flex my-3 flex-wrap ">
					<view class="size-2 rounded bg-common overflow-hidden mr-1 mb-1 position-relative" @click="showUtilOfImg(imgOBj.src)" v-for="(imgOBj,i) in srcList" :key="i">
						<image :src="imgOBj.src" class="el-full"></image>
						<!-- 图片遮罩层，用于选择是删除还是预览图片 -->
						<!-- <view :style="imgOBj.showUtil ? 'display:block':'display:none'" class="el-full bg-dark lucency-5 zTop position-absolute grid-2 grid-center-by-el" style="left:0;top:0"> -->
						<view :style="imgOBj.showUtil ? 'display:block':'display:none'" class="el-full bg-dark lucency-5 zTop position-absolute" style="left:0;top:0">
							<view class="text-center" style="line-height: 200rpx;">
								<text class="iconfont icon-preview text-white font-lg mr-1" @click.stop="previewRes(imgOBj.src)"></text>
								<text class="iconfont icon-ashbin text-white font-lg ml-1" @click.stop="delRes(imgOBj.src)"></text>
							</view>
						</view>
					</view>
					<view class="size-2 rounded bg-common font-lg grid grid-center-by-grid-and-ele" @click="addImage">
						+
					</view>
				</view>
			<!-- </view> -->
		</view>
	<!-- 	<YxPopup isBottom :show="show" @hide="show = false" :popPosittion="{x:0,y:0}">
			<template #custom>
				<view class="grid  grid-center-by-grid-and-ele main-bg-color text-white rounded font-md" style="grid-auto-rows: 100rpx;">
					<view @click.stop="cameraAction">拍摄</view>
					<view @click.stop="getSrcFromAlbum" class="zTop">从相册选择</view>
					<view style="border-top: 10rpx solid white;width:100vw;"  class=" text-center py-2" @click="show=false">取消</view>
				</view>
			</template>
		</YxPopup> -->
		
		<YxPictureSelect  :show="show"/>
	</yx-flexible-wrapper>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import friendDynamicList  from '@/static/testData/friendCircleMessage.js'
	import YxPopup from '@/components/yx-popup.vue'
	import YxPictureSelect from '@/components/yx-picture-select.vue'
	export default {
		components:{
			YxNavBar,YxFlexibleWrapper,YxPopup,YxPictureSelect
		},
		provide(){
			return {
				setShow:this.setPopShow,
				getPicture:this.getPictureFromDevice
			}
		},
		mounted(){
			
		},
		data() {
			return {
				friendDynamicList,
				content:'',
				srcList:[],
				show: false,
				utilCloseTimer:null
			}
		},
		methods: {
			setPopShow(flag){
				this.show = flag
				console.log('show',this.show)
			},
			// 展示此图片的扩展功能(删除或预览)
			showUtilOfImg(img){
				this.srcList.forEach(srcObj=>{
					srcObj.showUtil = srcObj.src == img
				})
				// 避免重复开启定时器
				if(this.utilCloseTimer) clearTimeout(this.utilCloseTimer)
				// 3s后自动关闭选项
				this.utilCloseTimer = setTimeout(()=>{
					this.srcList.forEach(srcObj=>{
						srcObj.showUtil =  false
					})
				},3000)
			},
			previewRes(img){
				uni.previewImage({
					current:img,
					urls:[img]
				})
			},
			delRes(img){
				const self = this
				uni.showModal({
					title:'删除图片',
					content:'你确定要移除该图片吗?',
					success(res){
						if(res.confirm){
							const index = self.srcList.findIndex(srcObj=>srcObj.src == img)
							self.srcList.splice(index,1)
						}
					}
				})
				
			},
			publishDynamic(){
				if(this.content){
					const publishDynmaicObj = {
						id:Math.random()*2000, // 随机id，用于即使测试
						user_img:'/static/logo.png', // 用户图片
						user_name:'me', // 用户名称
						content:this.content, // 发布内容
						image_list:this.srcList.map(srcObj=>srcObj.src), // 发布的图片，可以为空
						publish_time: Date.now(), // 消息发布使用
						like_list:[], // 存储每个回复用户的id，通过id查找对应的name值
						reply_list:[]
						
					}
					this.friendDynamicList.unshift(publishDynmaicObj)
					this.content = ''
					this.srcList = []
					uni.navigateTo({
						url:'/pages/tabbar/find/FriendCIrcle/FriendCIrcle'
					})
				}
			},
			addImage(){
				this.show = true
			},
			getPictureFromDevice(path){
				console.log('@ddd-p',path)
				this.srcList.push({src:path,showUtil:false} )
			},
			getSrcFromAlbum(){
				console.log('相册')
				const self = this
				plus.gallery.pick(({files})=>{
					files.forEach(path=>{
						self.srcList.push({src:path,showUtil:false} )
					})
				},(err)=>{
					console.log(err)
				},{
					multiple:true,
					permissionAlert:true,
					filter:'none'
				});
				
				this.show = false
			},
			cameraAction(){
				console.log('开始拍照')
				const camera = plus.camera.getCamera();
				const self = this
				camera.captureImage((path)=>{
					// 照片虚拟路径，将虚拟路径存储到手机存储中
					plus.gallery.save(path,(path)=>{
						console.log('@success',path)
						self.srcList.push({src:path.file,showUtil:false})
					})
				}, (err)=>{
					console.log(err)
				});
				this.show = false
			}
		}
	}
</script>

<style>

</style>
