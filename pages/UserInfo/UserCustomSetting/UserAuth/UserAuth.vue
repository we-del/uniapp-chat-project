<template>
	<yx-common-wrapper>
		<yx-nav-bar title="朋友权限" :existMore="false"></yx-nav-bar>
		<view class="mt-2" v-for="list in listData">
			<view class="font-small my-1 mx-2 text-common-font">{{list.title}}</view>
			<yx-list v-for="data in list.list" :title="data.title" @click="handleObjEvent(data)" class="bg-white px-2" :key="data.id">
				<template #suffix>
					<switch v-if="data.sign === 'switch'" checked="true" @change="()=>{}" />
					<view v-if="data.sign === 'auth' && data.radio">
						<text class="main-text-color"> √ </text>
					</view>
				</template>
			</yx-list>
		</view>
	</yx-common-wrapper>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxList from '@/components/yx-list.vue'
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	export default {
		onLoad(query){
			// console.log('@id',query)
		},
		components:{
			YxNavBar,YxList,YxCommonWrapper
		},
		mounted(){
			this.listData = [
				{
					title:'设置朋友权限',
					list:[
						{
							id: Math.random()*2000,
							title:'聊天、朋友圈等',
							sign:'auth',
							radio:true,
							event:'moreAuth'
						},
						{
							id: Math.random()*2000,
							title:'仅聊天',
							sign:'auth',
							radio:false,
							event:'chat'
						}
					]
				},
				{
					title:'朋友圈和状态',
					list:[
						{
							id: Math.random()*2000,
							title:'不让他看我',
							sign:'switch',
							event:'forbidSeekMe'
						},
						{
							id: Math.random()*2000,
							title:'不看它',
							sign:'switch',
							event:'notSeekIt'
						}
					]
				},
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
			}
		},
		computed:{
			authList(){
				return this.listData[0].list
			}
		}
	}
</script>

<style>

</style>
