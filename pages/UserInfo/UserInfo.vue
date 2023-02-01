<template>
	<view class="fill-screen bg-common" >
		<yx-nav-bar :routerPath="`/pages/UserInfo/UserCustomSetting/UserCustomSetting?id=${targetId}`" :existMore="isFriend"></yx-nav-bar>
		<yx-flexible-wrapper>
			<yx-card img="/static/logo.png" class="bg-white font-weight-bold "  :title="userInfo.username">
				<template #desc v-if="isFriend" @click="this">
					<view class="m-1" v-if="userInfo.nickname">昵称: {{userInfo.nickname}}</view>
					<view class="m-1">微信号: {{userInfo.wx_id}}</view>
					<view class="m-1" v-if="userInfo.area">地区：{{userInfo.area}}</view>
				</template>
				<template #right v-if="isFriend">
					<!-- 如果是关心用户则进行显示，通过后台字段返回 -->
					<text style="color:#ffbf01" class="font-lg iconfont icon-aixin-xian"></text>
					<!-- ♥⭐🧡🌟⭐🌟 -->
				</template>
			</yx-card>
			<view v-for="list in listData" class="mb-2 bg-white">
				<yx-list v-for="data in list"   v-if="isFriend"
				 @click="handleEvent(data)" :title="data.title" :isCell="data.isCell" :key="data.id">
					<template #suffix v-if="data.suffix || data.sign">
							<view v-if="data.suffix" style="width: 550rpx;" :class="data.sign==='tel' ? 'text-danger':''">{{data.suffix}}</view>
							<view v-if="data.sign === 'image'" style="width: 520rpx;">
								<image style="width: 75rpx;height: 75rpx;" src="/static/images/demo/cate_09.png" mode="aspectFit"></image>
								<image style="width: 75rpx;height: 75rpx;" src="/static//logo.png" mode="aspectFit"></image>
							</view>
					</template>
				</yx-list>
			</view>
			<view v-if="isFriend" class="text-center font-md  bg-white p-2" style="color:#6b859a" @click="toChat">发送消息</view>
			<view v-if="!isFriend" class="text-center font-md  bg-white p-2" style="color:#6b859a" @click="toAddFriend">添加到通讯录</view>
			<!-- 根据后台字段查看是否被添加到黑名单 -->
			<view v-if="isFriend" class="mt-2 font-small text-common-font text-center">已加入黑名单，你将无法接受到它的消息</view>
		</yx-flexible-wrapper>
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	import YxCard from '@/components/yx-card.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import {searchUser} from '@/api/user.js'
	export default {
		async onLoad(query){
			// 查看用户详情时显示此路由页面，传入输入的id,用户类别(好友|非好友)
			console.log('query',query)
			this.targetId = query.id
			this.isFriend = parseInt(query.isFriend)
			console.log('登录返回的内容',await searchUser(query.id))
			this.userInfo = await searchUser(query.id)
			console.log('@this',this)
		},
		components:{
			YxNavBar,YxList,YxCard,YxFlexibleWrapper
		},
		mounted(){
			this.listData = [
				[
					{
						id: Math.random()*2000,
						title:'设置标签和昵称',
						isCell:true,
						event:'tag'
					},
					{
						id: Math.random()*2000,
						title:'电话号码',
						suffix:this.userInfo.phone,
						sign:'tel',
						isCell:false,
					},
					{
						id: Math.random()*2000,
						title:'朋友权限',
						isCell:true,
						event:'auth'
					}
				],
				[
					{
						id: Math.random()*2000,
						title:'朋友圈',
						sign:'image',
						isCell:true,
						event:'friend'
					},
					{
						id: Math.random()*2000,
						title:'更多信息',
						isCell:true,
						event:'moreMsg'
					}
				]
			]
		},
		data() {
			return {
				targetId:0,
				isFriend:false,
				listData:[],
				userInfo:{}
			}
		},
		methods: {
			toAddFriend(){
				console.log('好友')
				this.routerGo(`/pages/search-user/AddFriend/AddFriend?id=${this.targetId}`)
			},
			toChat(){
				this.routerGo('/pages/chat-detail/chat-detail')
			},
			handleEvent(data){
				switch (data.event){
					case 'tag':
					this.routerGo('/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag')
						break;
					case 'auth':
					this.routerGo('/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth')
						break;
					case 'moreMsg':
					this.routerGo('/pages/UserInfo/UserCustomSetting/UserCustomSetting')
						break;
					case 'friend':
						this.routerGo('/pages/UserInfo/UserCustomSetting/FriendCircle/FriendCircle')
						break;
					default:
						break;
				}
			},
			routerGo(path){
				uni.navigateTo({
					url:path
				})
			}
		}
	}
</script>

<style>

</style>
