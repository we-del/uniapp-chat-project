<template>
	<view class="flex justify-between p-2"
	hover-class="bg-common" @click="handleClick">
		<image class="rounded size-1 pr-2" :src="user.image_src" mode="aspectFill"></image>
		<yx-badge :messageCount="user.message_count"></yx-badge>
		<view id="user-content" class="flex flex-1 flex-column justify-between">
			<view id="user-name" class="text-ellipsis text-primary">{{user.user_name}}</view>
			<view id="content " class="text-ellipsis font-sm text-common mb-1">{{user.user_message}}</view>
		</view>
		<view id="message-time" class="font-sm text-common">{{time}}</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import YxBadge from '@/components/yx-badge.vue'
	export default {
		name:"chat-item",
		components:{YxBadge},
		props:{
			// 外部传入user对象，我们结构出其的内容进行渲染
			/*
			  {
				  id:number
				  image_src: string
				  messagge_count:string
				  user_name:string
				  user_message:string
				  message_time:number
				  is_touch:false
			  }
			*/
			user:[Object]
		},
		data() {
			return {
				
			};
		},
		methods:{
			handleClick(e){
				// console.log(e)
			}
		},
		computed:{
			time(){
				return dayjs(this.user.message_time).format('HH:mm')
			}
		}
	}
</script>

<style>

</style>