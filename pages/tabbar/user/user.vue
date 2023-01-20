<template>

	<yx-common-wrapper>
		<yx-tool-bar title=""></yx-tool-bar>
		<yx-flexible-wrapper>
			<view class="position-relative" style="width: 100%;height:150rpx;background-color: white;">
				<text class="iconfont icon-help position-absolute" style="right:20rpx;top:30rpx"></text>
			</view>
			<yx-card img="/static/logo.png" class="bg-white" title="楚云" desc="测试数据" @click="toUserInfo">
				<template #right>
					<view class="mt-3">
							<text class="iconfont icon-saoyisao  font-lg"></text>
							<text class="iconfont  icon-right font-lg"></text>
					</view>
				</template>
			</yx-card>
			<yx-divider></yx-divider>
			<view v-for="(group,i) in data" :key="i" class="bg-white">
				<yx-list v-for="d in group" :key="d.id" hover-class="bg-common"
				:title="d.title" :isCell="d.isCell" :icon="d.icon">
				 <!-- 做成属性传入更好，插槽无法独立展示数据(需要组件内部做判断) -->
				 <template #suffix>
					 {{d.suffix && d.suffix.content}}
				 </template>
				</yx-list>
				<yx-divider></yx-divider>
			</view>
		</yx-flexible-wrapper>
		
	</yx-common-wrapper>
</template>

<script>
	import YxCard from '@/components/yx-card.vue'
	import YxDivider from '@/components/yx-divider.vue'
	import YxList from '@/components/yx-list.vue'
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import YxToolBar from '@/components/yx-tool-bar.vue'
	export default {
		components:{YxCard,YxDivider,YxList,YxCommonWrapper,YxFlexibleWrapper,YxToolBar},
		data() {
			return {
				data:[
						[
							{
								id:2,
								title:'支付',
								icon:'icon-iconfontzhizuobiaozhunbduan36',
								isCell:true
							},
						],
						[
							{
								id:0,
								title:'收藏',
								icon:'icon-iconfontzhizuobiaozhunbduan36',
								isCell:true
							},
							{
								id:12,
								title:'相册',
								icon:'icon-xiaochengxu',
								isCell:true
							},
						
							{
								id:1,
								title:'表情',
								icon:'icon-iconfontzhizuobiaozhunbduan36',
								isCell:true,
								suffix:{
									content:'内容'
								}
							},
						],
						[
							{
								id:2,
								title:'设置',
								icon:'icon-iconfontzhizuobiaozhunbduan36',
								isCell:true
							},
						],
					]
				
			}
		},
		methods: {
			toUserInfo(){
				uni.navigateTo({
					url:'/pages/tabbar/user/UserInfo/UserInfo'
				})
			}
		}
	}
</script>

<style>

</style>
