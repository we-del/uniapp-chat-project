<template>
	<view>
		<view v-for="list in listData" class="mb-2 bg-white">
			<yx-list v-for="data in list" :title="data.title" :isCell="data.isCell" :key="data.id">
				<template #suffix v-if="data.suffix || data.sign">
					<view v-if="data.suffix">{{data.suffix}}</view>
					<text v-if="data.sign === 'qrCode'" class="iconfont icon-qrcode" ></text>
					<view v-if="data.sign === 'switch'">
						<switch @change="(e)=>switchToggle(e,data)" />
					</view>
				</template>
			</yx-list>
		</view>
	</view>
	
</template>

<script>
		import YxList from '@/components/yx-list.vue'
	export default {
		name:"yx-list-compo",
		props:{
			listData:[Object]
		},
		mounted(){
			setTimeout(()=>{
				
					console.log('list_----',this.listData)
			},100
			)
		},
		components:{YxList},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>