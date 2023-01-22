<template>
	<yx-nav-bar title="个人信息" :existMore="false" :routerPath="`/pages/tabbar/user/user?${name}`">
	</yx-nav-bar>
	<yx-flexible-wrapper>
		<yx-list v-for="t in list" :key="t.id" :title="t.title" isCell @click="handleClick(t)" >
			<template #suffix>
				<view v-if="t.suffix =='image'">
					<image :src="t.data" class="size-1"></image>
				</view>
				<view v-if="t.suffix =='text'">
					{{t.data}}
				</view>
				<view v-if="t.suffix =='QRcode'">
					<text class="icon-qrcode iconfont"></text>
				</view>
			</template>
		</yx-list>
		<YxPictureSelect :maxSelecPic="1" :show="show"/>
		<YxDialog :show="dialogShow" @hide="dialogShow = false">
			<template #custom>
				<!-- <view class="position-relative p-3 font-md text-white  el-full overflow-hidden"> -->
				<view class="position-relative p-3 text-white ">
					<view class="text-center">设置昵称</view>
						<!-- <textarea maxlength="15" class="bg-white" style="margin-top: 100rpx;"
						 v-model="name" auto-height placeholder="输入你喜欢的昵称吧"></textarea> -->
					 <textarea maxlength="15" class="bg-white main-text-color p-2 ml-5" auto-focus  auto-height 
					 style="margin-top: 100rpx;min-height: 40rpx;width:400rpx"
						  v-model="name"  placeholder="输入你喜欢的昵称吧"></textarea>
					<view class="grid grid-2 grid-center-by-el" style="margin-top: 16vh;"  >
						<view @click.stop="setDialogShow(false)">取消</view>
						<view @click.stop="rename">确认</view>
					</view>
				</view>
			</template>
		</YxDialog>
	</yx-flexible-wrapper>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import YxList from '@/components/yx-list.vue'
	import YxPictureSelect from '@/components/yx-picture-select.vue'
	import YxDialog from '@/components/yx-dialog.vue'
	export default {
		components:{
			YxNavBar,
			YxFlexibleWrapper,YxList,YxPictureSelect,YxDialog
		},
		provide(){
			return{
				setShow:this.setShow,
				getPicture:this.getPicture
			}
		},
		mounted(){
			this.list = [
				{
					id:this.avatarId,
					title:'头像',
					suffix:'image',
					// 这里是一个只读操作(调用get得到响应)，此时this.avatar的值即使改变了也无法响应式更新，配合watch完成
					data:this.avatar,
					event:'avatar'
				},
				{
					id:this.nameId,
					title:'名字',
					suffix:'text',
					data:this.name,
					event:'name'
				},
				{
					id:Math.random()*2000,
					title:'微信号',
					suffix:'text',
					data:'my_123'
				},
				{
					id:Math.random()*2000,
					title:'二维码名片',
					suffix:'QRcode'
				}
			]
		},
		data() {
			return {
				list:[],
				show:false,
				avatar:'/static/logo.png',
				avatarId: Math.random()*2000,
				name:'Zz',
				nameId: Math.random()*2000,
				dialogShow: false
			}
		},
		methods: {
			setShow(flag){
				this.show = flag
			},
			setDialogShow(flag){
				this.dialogShow = flag
			},
			rename(){
				console.log('rename')
				const self = this
				const target = this.list.find(obj=>obj.id== self.nameId)
				target.data = this.name
				this.dialogShow= false
			},
			getPicture(path){
				console.log('设置图片为')
				this.avatar = path
				console.log('avat',this.avatar)
			},
			handleClick(data){
				switch (data.event){
					case 'avatar':
						this.setShow(true)
						break;
					case 'name':
						this.dialogShow = true
					default:
						break;
				}
				if(data.suffix != 'image') return
			}
		},
		watch:{
			avatar(){
				const self = this
				const target = this.list.find(obj=>obj.id== self.avatarId)
				target.data = this.avatar
			}
		}
	}
</script>

<style>

</style>
