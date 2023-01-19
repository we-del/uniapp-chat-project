<template>
	<view class="bg-white">
		<yx-nav-bar :existMore="false">
			<template #suffix>
				<button size="mini" class="text-white main-bg-color">完成</button>
			</template>
		</yx-nav-bar>
		<YxFlexibleWrapper>
			<view class="p-2 mt-5">
				<view class="text-center px-2 font-weight-bold font-md">
					设置备注和标签
				</view>
				<view class="p-1">
					<view class="m-1">备注</view>
					<view class="p-2 rounded bg-common">
						<input type="text">
					</view>
				</view>
				<view class="p-1" @click="routerPath('/pages/UserInfo/UserCustomSetting/SetUserTag/TagPick/TagPick')">
					<view class="m-1">标签</view>
					<view class="p-2 rounded bg-common font-md justify-around flex">
						<view class="flex-1">添加标签</view>
						<view>></view>
					</view>
				</view>
				<view class="p-1">
					<view class="m-1">电话号码</view>
					<view class=" rounded bg-common font-md justify-around flex ">
						<view class="ml-2 p-1 font-lg">+</view>
						<input type="text" class="mt-1 flex-1">
					</view>
				</view>
				<view class="p-1">
					<view class="m-1">描述</view>
					<view class="p-2 rounded bg-common font-md justify-around flex">
						<input type="text" class="flex-1" placeholder="添加文字描述">
					</view>
				</view>
			</view>
		</YxFlexibleWrapper>
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	export default {
		components:{
			YxNavBar,YxFlexibleWrapper
		},
		data() {
			return {
				
			}
		},
		methods: {
			routerPath(path){
				uni.navigateTo({
					url:path
				})
			}
		}
	}
</script>

<style>

</style>
