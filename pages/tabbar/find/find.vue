<template>
	<yx-common-wrapper>
		<view class="page">
			<block v-for="(group,i) in data" :key="i">
				<yx-list v-for="d in group" style="background-color: white;" :key="d.id" hover-class="main-bg-hover-color"
				:title="d.title" :isCell="d.isCell" :icon="d.icon">
				 <!-- 做成属性传入更好，插槽无法独立展示数据(需要组件内部做判断) -->
				 <template #suffix>
					 {{d.suffix && d.suffix.content}}
				 </template>
				</yx-list>
				<yx-divider></yx-divider>
			</block>
		</view>
	</yx-common-wrapper>
</template>

<script>
	import YxList from '@/components/yx-list.vue'
	import YxDivider from '@/components/yx-divider.vue'
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	export default {
		components:{YxList,YxDivider,YxCommonWrapper},
		data() {
			return {
				data:[
					[
						{
							id:0,
							title:'朋友圈',
							icon:'icon-iconfontzhizuobiaozhunbduan36',
							isCell:true,
							event:'circle'
						},
						{
							id:12,
							title:'小程序',
							icon:'icon-xiaochengxu',
							isCell:true
						},
					],
					[
						{
							id:1,
							title:'扫一扫',
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
							title:'游戏',
							icon:'icon-iconfontzhizuobiaozhunbduan36',
							isCell:true
						},
					],
					[
						{
							id:3,
							title:'购物',
							icon:'icon-iconfontzhizuobiaozhunbduan36',
							isCell:true
						},
					],
					[
						{
							id:4,
							title:'看一看',
							icon:'icon-iconfontzhizuobiaozhunbduan36',
							isCell:true
						},
					],
				]
			}
		},
		methods: {
			
		},
		
	}
</script>

<style>

</style>
