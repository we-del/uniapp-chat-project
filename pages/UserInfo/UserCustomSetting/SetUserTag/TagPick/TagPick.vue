<template>
	<yx-common-wrapper class="position-relative">
		<yx-nav-bar :existMore="false"  :titleCenter="true" title="从全部标签中添加">
			<template #suffix>
				<button size="mini" class="text-white main-bg-color" @click="goBack">完成</button>
			</template>
		</yx-nav-bar>
		<view class="bg-white pt-5 ">
			<text class="font-small text-common pl-2">从以下标签进行选择</text>
			<view class="text-common p-3 flex font-small flex-wrap  align-center">
				<view v-for="tag in userTag" :key="tag.id" @click="createTagBox(tag)" :class="tag.isSelected ? 'bg-white main-bg-color text-white ': 'bg-white' " class="p-1 px-2 mr-2 mt-2 rounded-circle">
					{{tag.title}}
				</view>
				<view class="flex font-sm mt-2" >
					选择标签
				</view>
			</view>			
		</view>
		<view class="p-2 text-white" style="color:#9ca3af">
			<view class="flex justify-between font-sm">
				<view>全部标签</view>
				<view>编辑 > </view>
			</view>
			<view class="mt-1 flex flex-wrap " id="tag-region-choose" style="font-size: 22rpx;">
				<view v-for="tag in tagList" :key="tag.id" @click="createTagBox(tag)" :class="tag.oftenExist ? 'border ': (tag.isSelected ? 'bg-white main-bg-color text-white ': 'bg-white') " class="p-1 px-2 mr-2 mt-2 rounded-circle">
					{{tag.title}}
				</view>
			</view>
		</view>
		<view id="create-tag-region" class="flex align-center flex-row position-absolute zTop bg-white p-2 rounded " :class="creatingTag ? 'display-block':'display-none'" style="left:50rpx;top:450rpx;width:300rpx">
			<textarea :maxlength="10" auto-height class="font-small" :value="tagVal" @input="inputCheck"></textarea>
			<button @click="hideInputBox('create')"  class="text-white main-bg-color mt-1 font-small" style="height:50rpx;line-height: 50rpx;">确定</button>
		</view>
		<view id="mask" class="fill-screen bg-danger lucency-hide position-absolute" @click="hideInputBox" :class="creatingTag ? 'display-block':'display-none'" style="left:0;top:0;"></view>
		
	</yx-common-wrapper>
</template>

<script>
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxNavBar from '@/components/yx-nav-bar.vue'
	export default {
		components:{
			YxNavBar,YxCommonWrapper
		},
		mounted(){
			this.tagList.push(
			{id:Math.random()*1000,title:'+ 新建标签',oftenExist:true},
			{id:Math.random()*1000,title:'俄式',isSelected:false},
			{id:Math.random()*1000,title:'+ 大哥',isSelected:false},
			)
			
		},
		data() {
			return {
				tagList:[],
				tagVal:'',
				creatingTag:false,
				userTag:[]
				
			}
		},
		methods: {
			createTag(val){
				return {id:Math.random()*1000,title:val}
			},
			createTagBox(tag){
				console.log(tag)
				if(tag.oftenExist) {	
					this.creatingTag = true
				}else{
					tag.isSelected = !tag.isSelected
					if(tag.isSelected){
						this.userTag.unshift(tag)
					}else{
						const i = this.userTag.findIndex(obj=>obj.id === tag.id)
						this.userTag.splice(i,1)
					}
				}
			},
			inputCheck(e){
				
				this.tagVal=e.detail.value
				console.log(this.tagVal.length)
				if(this.tagVal.length>=10) {
					uni.showToast({
						title:'最多只能输入10个字',
						icon:'none',
						duration:500
					})
				}
			},
			hideInputBox(type){
				switch (type){
					case 'create':
					if(this.tagVal.length){
						this.tagList.push(this.createTag(this.tagVal))
						this.tagVal = ''
					}
						break;
					default:
						break;
				}
				this.creatingTag = false
			},
			goBack(){
				console.log('返回')
				uni.navigateBack()
			}
		},
		computed:{
		}
	}
</script>

<style>

</style>
