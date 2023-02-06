<template>
	<view>
		<yx-tool-bar title="通讯录"></yx-tool-bar>
		<!-- 无法包装为滑动块，导航会丢失 -->
		<scroll-view scroll-y="true" class="position-fixed font-sm"  :style="`top:${fixedTop+100}rpx;height:88vh`" :scroll-into-view="`hash-abc-1-${sliderTarget}`"  >

			<block v-for="item in base_com" :key="item.id">
				<yx-list @click="handleEvent(item)"  :count="item.applyCount" :img="item.img" :title="item.title"></yx-list>  
			</block>
			<view v-for="(friends,i) in friendList"  class="font-md " :key="i" >
				<view class="bg-common pl-2" style="width:100vw" :id="`hash-abc-1-${friends.title}`">{{friends.title}}</view>
				
				<yx-list  v-for="data in friends.list" :img="data.avatar" :title="data.nickname ?data.nickname  : data.username " :key="data.id"></yx-list>  
			</view>
		</scroll-view>
		<view class="flex flex-column position-fixed text-center font-sm text-dark" style="right:10rpx;top:200rpx;">
			<view v-for="prefix in friendPrefixPosition" @click="startSlide(prefix)" :key="prefix">
				{{prefix}}
			</view>
		</view>
	</view>
</template>

<script>
	import YxToolBar from '@/components/yx-tool-bar.vue'
	import YxList from '@/components/yx-list.vue'
	import friendList from '@/static/testData/friendList.js'
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	// 每天继续晚上申请好友显示
	import {getFriendApplyAcount,getFriendList} from '@/api/friend.js'
	export default {
		components:{YxToolBar,YxList,YxFlexibleWrapper},
		 mounted(){
			console.log('@rrrr',friendList)
			// this.friendList = friendList
			for (var i = 65; i <= 90; i++) {
				this.friendPrefixPosition.push(String.fromCharCode(i))
			}
			this.friendPrefixPosition.push('#')
			
			
			// 处理加载获取一次，之后每次onShow时在获取一次(可能存在添加好友的行为)
			
		},
		async onShow(){
			console.log('@@@',await getFriendApplyAcount())
			this.base_com[0].applyCount = await getFriendApplyAcount()
			console.log('onss',await getFriendList())
			this.friendList = (await getFriendList()).newList
			console.log('@fff',this.friendList)
		},
		data() {
			return {
				base_com:[
					{
							id:3,
							img:'/static/images/mail/friend.png',
							title:'新的朋友',
							event:'friend',
							applyCount: 0
					},
					{
							id:1,
							img:'/static/images/mail/group.png',
							title:'群聊',
							applyCount: 0
					},
					{
							id:2,
							img:'/static/images/mail/tag.png',
							title:'标签',
							applyCount: 0
					},
				],
				friendList:[],
				friendPrefixPosition:[],
				// 点击导航栏滑动到得id位置
				sliderTarget: '',
				friendApplyCount:0
				
			}
		},
		methods: {
			startSlide(target){
				// 快速滑动元素
				// 判断此组是否存在，不存在不滑动
				console.log('点击得为',target)
				console.log(this.friendList.find((obj)=>obj.group == target))
				if(this.friendList.find((obj)=>obj.group == target)){
					this.sliderTarget = target
				}else{
					this.slsiderTarget = ''
				}
			},
			handleEvent(data){
				switch (data.event){
					case 'friend':
					this.routerGo('/pages/tabbar/friend/FriendApplyList/FriendApplyList')
					
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
		},
		computed:{
			...mapState(useDeviceStore,['fixedTop'])
		}
	}
</script>

<style>

</style>
