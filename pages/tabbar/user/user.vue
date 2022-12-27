<template>
	<view class="page">
		<view style="width: 100%;height:150rpx;background-color: white;">
			<text class="iconfont icon-help position-fixed" style="right:20rpx;top:30rpx"></text>
		</view>
		<yx-card img="/static/logo.png" title="楚云" desc="测试数据">
			<template #right>
				<view class="mt-3">
						<text class="iconfont icon-saoyisao  font-lg"></text>
						<text class="iconfont  icon-right font-lg"></text>
				</view>
			</template>
		</yx-card>
		<yx-divider></yx-divider>
		<block v-for="group in data">
			<yx-list v-for="d in group" :key="d.id" hover-class="bg-dark"
			:title="d.title" :isCell="d.isCell" :icon="d.icon">
			 <!-- 做成属性传入更好，插槽无法独立展示数据(需要组件内部做判断) -->
			 <template #suffix>
				 {{d.suffix && d.suffix.content}}
			 </template>
			</yx-list>
			<yx-divider></yx-divider>
		</block>
	</view>
</template>

<script>
	import YxCard from '@/components/yx-card.vue'
	import YxDivider from '@/components/yx-divider.vue'
	import YxList from '@/components/yx-list.vue'
	export default {
		components:{YxCard,YxDivider,YxList},
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
			
		}
	}
</script>

<style>

</style>
