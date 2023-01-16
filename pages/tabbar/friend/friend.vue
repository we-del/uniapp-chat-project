<template>
	<view>
		<yx-tool-bar title="通讯录"></yx-tool-bar>
		<!-- <scroll-view scroll-y="true" style="width: 100vw;height: 100vh;" :scroll-into-view="`hash-abc-1-${sliderTarget}`"  > -->
		<scroll-view scroll-y="true" class="position-fixed font-sm"  :style="`top:${fixedTop+100}rpx;height:88vh`" :scroll-into-view="`hash-abc-1-${sliderTarget}`"  >

			<block v-for="item in base_com" :key="item.id">
				<yx-list  :img="item.img" :title="item.title"></yx-list>  
			</block>
			<!-- <view >好友列表</view> -->
			<view v-for="friends in friendList"  class="font-md " >
				<view class="bg-common pl-2" style="width:100vw" :id="`hash-abc-1-${friends.group}`">{{friends.group}}</view>
				<yx-list  v-for="data in friends.userList" :img="data.img" :title="data.title" :key="data.id"></yx-list>  
			</view>
		</scroll-view>
		<!-- 快速移动到对应得分组上 -->
		<view class="flex flex-column position-fixed text-center font-sm text-dark" style="right:10rpx;top:200rpx;">
			<view v-for="prefix in friendPrefixPosition" @click="startSlide(prefix)">
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
	export default {
		components:{YxToolBar,YxList},
		mounted(){
			console.log('@rrrr',friendList)
			this.friendList = friendList
			for (var i = 65; i <= 90; i++) {
				this.friendPrefixPosition.push(String.fromCharCode(i))
			}
			this.friendPrefixPosition.push('#')
		},
		data() {
			return {
				base_com:[
					{
							id:1,
							img:'/static/images/mail/group.png',
							title:'群聊'
					},
					{
							id:2,
							img:'/static/images/mail/tag.png',
							title:'标签'
					},
					{
							id:3,
							img:'/static/images/mail/friend.png',
							title:'新增朋友'
					},
				],
				friendList:[],
				friendPrefixPosition:[],
				// 点击导航栏滑动到得id位置
				sliderTarget: ''
				
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
			}
		},
		computed:{
			...mapState(useDeviceStore,['fixedTop'])
		}
	}
</script>

<style>

</style>
