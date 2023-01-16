<template>
	<yx-common-wrapper>
		<yx-nav-bar :titleCenter="true" :title="`选择${sendSingle ? '一':'多'}个聊天`" :existMore="false">
			<template #suffix>
				<!-- 单选模式或多选模式没有选择时展示此 -->
				<view v-if="!selectedTargetInMoreChoseMode" @click="changeSelectedMode">{{sendSingle ? '多':'单'}}选</view>
				<!-- 多选模式且选择了目标展示此 -->
				<view v-if="selectedTargetInMoreChoseMode" class="p-1 rounded main-bg-color text-white" @click="sendDataToUser">发送({{selectedCount}})</view>
			</template>
		</yx-nav-bar>
		<!-- 搜索框（盒子占位，点击后上方开始搜索框(跟着遮罩层)） | 最近转发的对象(如果最近没转发则不显示) -->
		<view class="p-2">
			<view  class="py-2 rounded bg-white text-center text-common-font font-sm" @click="()=>{}">
				<!-- 在多选时，选择的用户会此进行显示 -->
				<view v-if="!sendSingle" class="flex flex-wrap">
					<view class="m-2 rounded  font-small text-common-font text-center  text-ellipsis position-relative"   style=" width: 50rpx;" v-for="user in selectedUserList" :key="user.id">
						
						<image :src="user.image_src" style="width: 100%;height:50rpx"></image>
						<!-- <image src="/static/logo.png"></image> -->
					</view> 
				</view>
				<textarea auto-height :maxlength="-1" @keyup="inputWatcher" v-model="searchVal" style="max-height: 75rpx; max-width: 400rpx;overflow:auto;margin:auto" placeholder="🔍 搜索"></textarea>
			
			</view>
			<!-- 最近转发的对象用户，如果没有转发过则不显示 -->
			
			<view class="py-4" v-if="!havingSearchUser">
				<view class="font-small">最近转发</view>
				<!-- 转发的对象 -->
				<view class="flex flex-wrap">
					<view class="m-2 rounded  font-small text-common-font text-center  text-ellipsis position-relative"   style=" width: 100rpx;" @click="sendToIt(user)" v-for="user in recentContact" :key="user.id">
						<!--  圆圈选择框 -->
						<view v-if="!sendSingle" class="position-absolute  zTop flex justify-center align-center rounded-circle border" style="top:5rpx;right:5rpx;width:30rpx;height:30rpx">
							<!-- 选中时此样式显示 -->
							<view v-if="user.isSelected" style="height:15rpx; width:15rpx" class="main-bg-color rounded-circle"></view>
						</view>
						<image :src="user.image_src" style="width: 100%;height:100rpx"></image>
						<view class="text-ellipsis">{{user.user_name}}</view>
						<!-- <image src="/static/logo.png"></image> -->
					</view> 
				</view>
			
			</view>
		</view>
		<!-- 可分享的对象用户 -->
		<view class="bg-white" v-if="!havingSearchUser">
			<view class="flex p-2 font-small justify-between bg-common-shallow" >
				<view>最近聊天</view>
				<view class="main-text-color">+ 创建新的聊天</view>
			</view>
			<!-- 置顶对象用户 -->
			<yx-list v-for="user in userTopList" @click="sendToIt(user)" class="bg-common-shallow" :title="user.user_name" :img="user.image_src" :key="user.id">
				<template #prefix>
					<view class="pr-2" v-if="!sendSingle">
						<view class="  zTop flex justify-center align-center rounded-circle border" style="top:5rpx;right:5rpx;width:30rpx;height:30rpx;border-color:black">
							<!-- 选中时此样式显示 -->
							<view v-if="user.isSelected" style="height:15rpx; width:15rpx" class="main-bg-color rounded-circle"></view>
						</view>
						</view>
				</template>
			</yx-list>
			<!-- 非置顶对象用户 -->
			<yx-list v-for="user in userListOfNotTop" @click="sendToIt(user)"  :title="user.user_name" :img="user.image_src" :key="user.id">
				<template #prefix>
					<view class="pr-2" v-if="!sendSingle">
						<view class=" zTop flex justify-center align-center rounded-circle border" style="top:5rpx;right:5rpx;width:30rpx;height:30rpx;border-color:black">
							<!-- 选中时此样式显示 -->
							<view  v-if="user.isSelected" style="height:15rpx; width:15rpx" class="main-bg-color rounded-circle"></view>
						</view>
					</view>
				</template>
			</yx-list>
		</view>
		
		
		<!-- 搜索用户时显示 ,显示多选框 -->
		<view v-if="havingSearchUser">
			<!-- 联系人 ，显示昵称-->
			<view>
				<view class="font-small text-common-font m-2">联系人</view>
			</view>
			<!-- 群聊 ，不显示昵称-->
			<view class="font-small text-common-font m-2">群聊</view>
			<view></view>
			正在搜索用户，有时间在进行功能完善，整体和用户显示相同
		</view>
		<yx-popup :show="show" :isCustom="true" @hide="hidePopup" :popPosittion="popPosition">
			<template #custom>
				<view class="p-2 mt-1">
					<view class="m-1 font-weight-bold font-sm">发送给：</view>
					<!-- 发送对象用户列表 -->
					<view class="flex flex-wrap m-2">
						<view  v-for="user in selectedUserList" :key="user.id" class="rounded overflow-hidden m-1" style="width: 60rpx;height:60rpx;">
							<image :src="user.image_src" style="width:100%;height:100%" mode="aspectFill"></image>
						</view>
					</view>
					<view class="ml-1 my-2 font-sm text-common-font">[个人名片]超人</view>
					<view class="my-4 bg-common p-1 ">
						<textarea auto-height :maxlength="-1"  style="max-height: 75rpx; max-width: 400rpx;overflow:auto" placeholder="给朋友留言"></textarea>
					</view>
					<!-- 提交模块 -->
					<view class="font-sm pt-3 font-weight-bold flex text-center justify-center align-center">
						<view style="border-right: 1px solid #ccc;height:50rpx;line-height: 50rpx;" class="flex-1" @click="hidePopup">取消</view>
						<view class="main-text-color flex-1" style="height:50rpx;line-height: 50rpx;" @click="sendDataToUser">发送</view>
					</view>
				</view>
			</template>
		</yx-popup>
	</yx-common-wrapper>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxPopup from '@/components/yx-popup.vue'
	import userList from '@/static/testData/userList.js'
	export default {
		onLoad(query){
			// console.log('@id',query)
		},
		components:{
			YxNavBar,YxList,YxCommonWrapper,YxPopup
		},
		mounted(){
			this.userList = this.userList.map(user=>{
				user.isSelected = false
				return user
			})
			this.userTopList =  this.userList.filter(user=>user.is_top) 
			this.recentContact = [...this.userList].splice(2,2)
			
				// #ifdef APP-PLUS
				plus.key.addEventListener('keyup',(e)=>{
					console.log('key',e)
				})
				// #endif
				
		},
		data() {
			return {
				targetId:'',
				selectedUserList:[],
				userTopList:[],
				recentContact:[],
				userList,
				// 单选转发 | 多选转发  
				sendSingle: true,
				selectedTargetInMoreChoseMode: false,
				show:false,
				popPosition:{
					x:140,
					y:400
				},
				selectedCount: 0,
				havingSearchUser:false,
				searchVal:''
			}
		},
		methods: {
			inputWatcher(e){
				// 如果没有内容且此事件触发，则说明按下了 backspace按键(删除前一个输出内容)
					console.log('输入',e)
					if(!this.sendSingle && this.searchVal.length === 0 && this.selectedUserList.length){
						const last = this.selectedUserList.length-1
						this.selectedUserList[last].isSelected = false
						this.selectedUserList.pop()
					}
			},
			handleObjEvent(data){
				console.log('data',data)
				switch (data.event){
					case 'chat':
					case 'moreAuth':
						data.radio = true
						const authList = this.authList
						authList.filter(list => list.id !== data.id).forEach(list=> list.radio = false)
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
			},
			sendToIt(user){
				// 单选模式
				if(this.sendSingle){
					this.selectedTargetInMoreChoseMode = false
					this.selectedUserList.push(user)
					this.show = true
				}else{
				// 多选模式
					this.selectedTargetInMoreChoseMode = true
					user.isSelected = !user.isSelected
					if(user.isSelected){
						this.selectedUserList.push(user)
					}else{
						const i = this.selectedUserList.findIndex(u=> user.id == u.id)
						this.selectedUserList.splice(i,1)
					}
				}
				
			},
			changeSelectedMode(){
				this.sendSingle = !this.sendSingle
			},
			hidePopup(){
				if(this.sendSingle){
					this.selectedUserList = []
				}
				this.show = false
			},
			sendDataToUser(){
				// 恢复初始状态
				// this.userList.forEach(user=>user.isSelected = false)
				// 转发逻辑，配合后端接口
				this.show=true
				// uni.navigateBack()
			},
			handleSearchUser(e){
				
			}
		},
		computed:{
			authList(){
				return this.listData[0].list
			},
			userListOfNotTop(){
				return this.userList.filter(user=> !user.is_top)
			},
		},
		watch:{
			userList:{
				deep:true,
				handler(){
					console.log('c',userList.filter(user=> user.isSelected).length)
					this.selectedCount = userList.filter(user=> user.isSelected).length
					if(this.selectedCount === 0){
						this.selectedTargetInMoreChoseMode = false
					}
				}
			},
			searchVal(){
				this.havingSearchUser = this.searchVal.length > 0
			}
		}
	}
</script>

<style>

</style>
