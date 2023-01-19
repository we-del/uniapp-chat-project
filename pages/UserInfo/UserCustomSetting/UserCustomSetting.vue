<template>
	<view class="fill-screen bg-common">
		<yx-nav-bar title="资料设置" class="mb-4" :existMore="false"></yx-nav-bar>
		<yx-flexible-wrapper>
			<view v-for="(list,i) in listData" class="mb-2 bg-white" :key="i">
				<yx-list v-for="data in list" @click="handleObjEvent(data)" :title="data.title" :isCell="data.isCell" :key="data.id">
					<template #suffix v-if="data.suffix || data.sign">
						<view v-if="data.sign === 'switch'">
							<switch @change="(e)=>switchToggle(e,data)" />
						</view>
					</template>
				</yx-list>
			</view>
			<view class="text-center font-md   bg-white p-2 text-danger" >删除</view>
		</yx-flexible-wrapper>
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	export default {
		onLoad(query){
			// console.log('@id',query)
		},
		components:{
			YxNavBar,YxList,YxFlexibleWrapper
		},
		mounted(){
			this.listData = [
				[
					{
						id: Math.random()*2000,
						title:'设置备注和标签',
						isCell:true,
						event:'tag'
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
						title:'把它推荐给朋友',
						isCell:true,
						event:'recommend'
					},
					{
						id: Math.random()*2000,
						title:'设为星标朋友',
						sign:'switch'
					}
				],
				[
					{
						id: Math.random()*2000,
						title:'加入黑名单',
						sign:'switch'
					},
					{
						id: Math.random()*2000,
						title:'投诉',
						isCell:true
					}
				],
			]
		},
		data() {
			return {
				targetId:'',
				listData:[]
			}
		},
		methods: {
			
			handleObjEvent(data){
				console.log('data',data)
				switch (data.event){
					case 'tag':
						this.routerGo('/pages/UserInfo/UserCustomSetting/SetUserTag/SetUserTag')
						break;
					case 'auth':
						this.routerGo('/pages/UserInfo/UserCustomSetting/UserAuth/UserAuth')
						break;
					case 'recommend':
						this.routerGo('/pages/UserInfo/UserCustomSetting/ShareFriend/ShareFriend')
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
			}
		}
	}
</script>

<style>

</style>
