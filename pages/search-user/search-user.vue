<template>
	<YxCommonWrapper>
		<view class="p-1 flex justify-between align-center" style="height:60rpx">
			<input type="text" :value="searchVal"   @input="(e)=>searchVal = e.detail.value" placeholder="账号/手机号" 
			class="rounded bg-white flex-1 p-1" focus>
			<view class="main-text-color p-1">搜索</view>
		</view>
		<view class="py-2 px-3 bg-white " :class="searchVal ? 'opacity-1' :'opacity-0' ">
			<YxList img="/static/images/mail/friend.png" :title="`搜索：${searchVal}`" :havingBottomBorder="false"></YxList>
		</view>
	</YxCommonWrapper>
</template>

<script>
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxList from '@/components/yx-list.vue'
	export default {
		components:{YxCommonWrapper,YxList},
		data() {
			return {
				searchVal:''
			}
		},
		methods: {
			fn(e){
				console.log('in',e)
			}
		}
	}
</script>

<style>

</style>
