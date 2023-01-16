<template>	
	<yx-common-wrapper>
	<!-- <view class="bg-common fill-screen font-md"> -->
		<yx-nav-bar :existMore="false" :title="title"></yx-nav-bar>
		<scroll-view scroll-y="true" class="position-fixed font-sm"  :style="`top:${fixedTop+90}rpx;height:88vh`">
		
			<view id="group-member" class="bg-white p-1">
				
				<!-- 最多显示19个角色头像，每行5个，最末尾的一个使用添加符号占位(如只有两个则，两个用户正常显示，气候跟着一个添加号占位（显示一行），如大于20个用户，显示19个最后一个使用添加符号占位) -->
				 <!-- 期待后续补充，得到群组的所有成员进行展示，样式和占位符相似 -->
				<!-- 占位添加符号 -->
				<view class=" grid grid-5 grid-gap-1 justify-between">
					<view class="rounded font-lg text-center ml-2 cursor-pointer" style="width: 100rpx;height:100rpx;line-height: 100rpx;  border:2rpx dashed #ccc;"> + </view>
				</view>
				<view class="text-center text-common mb-2 ">查看更多群成员 > </view>
			</view>
			<view id="detail-setting-operate" class="mt-2 " >
				<!-- 使用 list-compo集合数据可能出现事件处理挤兑，即所有的可能行都需要在yx-list-compo组件内进行完成，可能不是一个好的选择 -->
			<!-- 	<yx-list-compo :listData="listData">
					<view v-if="data.suffix">{{data.suffix}}</view>
					<text v-if="data.sign === 'qrCode'" class="iconfont icon-qrcode" ></text>
					<view v-if="data.sign === 'switch'">
						<switch @change="(e)=>switchToggle(e,data)" />
					</view>
				</yx-list-compo> -->
				<view v-for="list in listData" class="mb-2 bg-white">
					<yx-list v-for="data in list" :title="data.title" :isCell="data.isCell" :key="data.id">
						<template #suffix v-if="data.suffix || data.sign">
							<view v-if="data.suffix">{{data.suffix}}</view>
							<text v-if="data.sign === 'qrCode'" class="iconfont icon-qrcode" ></text>
							<view v-if="data.sign === 'switch'">
								<switch @change="(e)=>switchToggle(e,data)" />
							</view>
						</template>
					</yx-list>
				</view>
			</view>
			<view class="text-center font-md text-danger bg-white p-2">退出群聊</view>
		</scroll-view>
	<!-- </view> -->
	</yx-common-wrapper>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxListCompo from '@/components/yx-list-compo.vue'
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		onLoad(query){
			console.log('query',query)
			this.title = query.title
		},
		components:{
			YxNavBar,YxList,YxCommonWrapper,YxListCompo
		},
		mounted(){
			// 后缀定制标准 ， 查看suffix是否存在后缀或 查看特殊标识(sign （qrCode -> 二维码 | switch -> 开关组件switch）)是否需要定制后缀
			this.listData = [
				[
					{
						id: Math.random()*2000,
						title:'群聊名称',
						suffix:'一家人',
						isCell:true
					},{
						id: Math.random()*2000,
						title:'群二维码',
						sign:'qrCode',
						isCell:true
					},{
						id: Math.random()*2000,
						title:'群公告',
						isCell:true
					},{
						id: Math.random()*2000,
						title:'备注',
						isCell:true
					}
				],
				[
					{
						id: Math.random()*2000,
						title:'消息免打扰',
						isCell:true
					}
				],
				[
					{
						id: Math.random()*2000,
						title:'置顶聊天',
						sign:'switch',
						isCell:false
					},
					{
						id: Math.random()*2000,
						title:'保存到通讯录',
						sign:'switch',
						isCell:false
					},
					{
						id: Math.random()*2000,
						title:'查看聊天记录',
						sign:'switch',
						isCell:false
					}
				],
				[
					
					{
						id: Math.random()*2000,
						title:'我在群里的昵称',
						suffix:'帅气',
						isCell:true
					},
					{
						id: Math.random()*2000,
						title:'显示群成员昵称',
						sign:'switch',
						isCell:false
					}
				],
				[
					{
						id: Math.random()*2000,
						title:'设置当前聊天背景',
						isCell:true
					},
					{
						id: Math.random()*2000,
						title:'清空聊天记录',
						isCell:true
					},
					{
						id: Math.random()*2000,
						title:'投诉',
						isCell:true
					}
				]
			]
			console.log('@list,id',this.listData)
		},
		data() {
			return {
				title:'',
				listData:''
			}
		},
		methods: {
			switchToggle(e,target){
				console.log('switch切换',e,target)
			}
		},
		computed:{
			...mapState(useDeviceStore,['fixedTop'])
		}
	}
</script>

<style>

</style>
