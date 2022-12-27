<template>
	<view>
		<yx-tool-bar title="通讯录"></yx-tool-bar>
		<block v-for="item in base_com" :key="item.id">
			<yx-list  :img="item.img" :title="item.title"></yx-list>  
		</block>
		<view class="font-md p-2 bg-common">好友列表</view>
		<block v-for="item in friend_list" :key="item.id">
			<yx-list  :img="item.img" :title="item.title"></yx-list>  
		</block>
	</view>
</template>

<script>
	import YxToolBar from '@/components/yx-tool-bar.vue'
	import YxList from '@/components/yx-list.vue'
	export default {
		components:{YxToolBar,YxList},
		data() {
			return {
				base_com:[
					{
							id:1,
							img:'/static/contact/1.png',
							title:'群聊'
					},
					{
							id:2,
							img:'/static/contact/2.png',
							title:'标签'
					},
					{
							id:3,
							img:'/static/contact/3.png',
							title:'新增朋友'
					},
				],
				friend_list:[
					
						{
								id:1,
								img:'/static/contact/1.png',
								title:'阿诚'
						},
						{
								id:2,
								img:'/static/contact/1.png',
								title:'龙与虎'
						},
						{
								id:3,
								img:'/static/contact/1.png',
								title:'绪论'
						},
						{
								id:4,
								img:'/static/contact/1.png',
								title:'杨哥'
						},
						{
								id:5,
								img:'/static/contact/1.png',
								title:'夏日重现'
						},
						{
								id:6,
								img:'/static/contact/1.png',
								title:'潮'
						},
						{
								id:7,
								img:'/static/contact/1.png',
								title:'落'
						},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
