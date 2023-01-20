<template>
	<view class="position-absolute fill-screen rounded bg-dark zTop" 
		:style="show ? 'display:block':'display:none'" 
		style="left:50%;top:20%;transform: translate(-50%,-50%);width: 80vw;height: 40vh">

			<slot name="custom"></slot>
	</view>
	<!-- 点击取消 -->
	<view @click="$emit('hide')" :style="show ? 'display:block':'display:none'" 
		class="fill-screen   position-absolute " style="left:0;top:0;"></view>
</template>

<script>
	export default {
		name:"yx-dialog",
		emits:['hide'],
		props:['show'],
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>