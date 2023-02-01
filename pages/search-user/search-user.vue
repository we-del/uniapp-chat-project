<template>
	<YxCommonWrapper>
		<view class="p-1 flex justify-between align-center" style="height:60rpx">
			<input type="text" :value="searchVal"   @input="(e)=>searchVal = e.detail.value" placeholder="账号/手机号" 
			class="rounded bg-white flex-1 p-1" focus>
			<view class="main-text-color p-1" @click="searchVal = ''">取消</view>
		</view>
		<!-- display 隐藏元素 不占有位置 事件不触发， visibility 隐藏元素 占有位置，事件不触发，opacity 隐藏元素 占有位置，事件触发 -->
		<view class="py-2 px-3 bg-white " :style="searchVal ? 'display:block' :'display:none' " @click="actionSearch">
			<YxList img="/static/images/mail/friend.png" :title="`搜索：${searchVal}`" :havingBottomBorder="false"></YxList>
		</view>
	
	</YxCommonWrapper>
</template>

<script>
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxList from '@/components/yx-list.vue'
	import {searchUser} from '@/api/user.js'
	export default {
		components:{YxCommonWrapper,YxList},
		data() {
			return {
				searchVal:''
			}
		},
		methods: {
			async actionSearch(){
				const res = await searchUser(this.searchVal)
				console.log('@se',res)
				// 没有找到
				if(typeof res == 'string'){
					uni.showToast({
						title:res,
						icon:'none'
					})
					this.searchVal = ''
				}else{
					// 待完善：判断是否是朋友
					uni.navigateTo({
						url:`/pages/UserInfo/UserInfo?id=${res.id}&isFriend=${res.isFriend}`
					})
				}
			}
		}
	}
</script>

<style>

</style>
