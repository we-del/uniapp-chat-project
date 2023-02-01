<template>
	<YxFlexibleWrapper>
		<YxNavbar title="新增朋友" titleCenter>
			<template #suffix>
				<view @click="goAddFriend">添加朋友</view>
			</template>
		</YxNavbar>
		<view v-for="i in 20" class="bg-common" style="height: 100rpx;">1</view>
	</YxFlexibleWrapper>
</template>

<script>
	import YxFlexibleWrapper from '@/components/yx-flexible-wrapperer.vue'
	import YxNavbar from '@/components/yx-nav-bar.vue'
	import {getFriendApplyList} from '@/api/friend.js'
	export default {
		components:{YxFlexibleWrapper,YxNavbar},
		async mounted(){
			console.log('@api',await getFriendApplyList())
		},
		data() {
			return {
				applyList:[]
			}
		},
		methods: {
			goAddFriend(){
				uni.navigateTo({
					url:'/pages/search-user/search-user'
				})
			}
		}
	}
</script>

<style>

</style>
