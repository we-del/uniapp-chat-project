<template>
	<view>
		<!-- <EmojiPicker :native="true" @select="onSelectEmoji" hide-group-icons hide-group-names/> -->
		<EmojiPicker native="true" @select="onSelectEmoji" hide-search disable-skin-tones disable-sticky-group-names />
	</view>
</template>

<script>
	import EmojiPicker from 'vue3-emoji-picker'
	import 'vue3-emoji-picker/css'
	export default {
		name:"yx-emo",
		components:{EmojiPicker},
		data() {
			return {
				
			};
		},
		methods:{
			onSelectEmoji(emoji) {
			  console.log(emoji)
			  /*
			    // result
			    { 
			        i: "😚", 
			        n: ["kissing face"], 
			        r: "1f61a", // with skin tone
			        t: "neutral", // skin tone
			        u: "1f61a" // without tone
			    }
			    */
			}
		}
	}
</script>

<style>

</style>