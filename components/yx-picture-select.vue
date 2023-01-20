<template>
	<YxPopup isBottom :show="show" @hide="setShow(false)" :popPosittion="{x:0,y:0}">
		<template #custom>
			<view class="grid  grid-center-by-grid-and-ele main-bg-color text-white rounded font-md" style="grid-auto-rows: 100rpx;">
				<view @click.stop="cameraAction">拍摄</view>
				<view @click.stop="getSrcFromAlbum" class="zTop">从相册选择</view>
				
				<!-- <view style="height: 10rpx;width:100vw" class="bg-white"></view> -->
				<view style="border-top: 10rpx solid white;width:100vw;"  class=" text-center py-2" @click="setShow(false)">取消</view>
			</view>
		</template>
	</YxPopup>
</template>

<script>
	import YxPopup from '@/components/yx-popup.vue'
	export default {
		name:"yx-picture-select",
		inject:['setShow','getPicture'],
		props:{
			show:{
				type:Boolean
			},
			maxSelecPic:{
				type:[Number,String],
				default:'Infinity'
			}
		},
		components:{
			YxPopup
		},
		mounted(){
			console.log(this)
		},
		data() {
			return {
			};
		},
		methods:{
			getSrcFromAlbum(){
				console.log('相册')
				const self = this
				plus.gallery.pick(({files})=>{
					files.forEach(path=>{
						console.log('path',path)
						this.getPicture(path)
						// self.srcList.push({src:path,showUtil:false} )
					})
				},(err)=>{
					console.log(err)
				},{
					multiple:true,
					permissionAlert:true,
					filter:'none',
					maximum:this.maxSelecPic
				});
				
				this.setShow(false)
			},
			cameraAction(){
				console.log('开始拍照')
				const camera = plus.camera.getCamera();
				const self = this
				camera.captureImage((path)=>{
					// 照片虚拟路径，将虚拟路径存储到手机存储中
					plus.gallery.save(path,(path)=>{
						console.log('@success',path)
						
						this.getPicture(path)
						// self.srcList.push({src:path.file,showUtil:false})
					})
				}, (err)=>{
					console.log(err)
				});
				this.setShow(false)
			}
		}
	}
</script>

<style>

</style>