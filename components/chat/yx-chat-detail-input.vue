<template>
	
	<view class="fixed-bottom   bg-white-four-deep flex justify-between align-center p-1" 
	:style="`min-height:60rpx;bottom:${inputHeight}rpx`" 
	ref="inputRef"  id="chat-input">
		<view id="record-sign" class="icon-keyboard iconfont mr-1 font-lg" :class="false ? 'icon-record' : 'icon-keyboard'"></view>
		<view id="input" class="flex-1 p-1">
			
			<textarea v-model="inputContent"  auto-height class="flex-1 bg-white-one-deep p-1 rounded"
			@linechange="textareaLineChangeHandle" @focus="handleFocus" @input="textareaInputChange" @keyboardheightchange="keyboardHeightChangeHandle"
			:style="`min-height: ${minHeight}rpx;max-height:${maxHeight}rpx;width: 95%;overflow:auto`" :maxlength="-1"
			 placeholder-style="color:#F76260" :adjust-position="false" />
		</view>
		<view id="more-operate" class="mr-2">
			<text class="iconfont icon-smile font-lg mr-1 vertical-middle" @click="activeEmot"></text>
			<text v-if="!isText" class="iconfont icon-add font-lg  p-1 vertical-middle" @click="activeUtilSwiper"></text>
			<text v-if="isText" class="iconfont font-sm main-bg-color p-1 text-white" @click="sendMessage">发送</text>
		</view>
	</view>
</template>

<script>
	// import {plus} from 'vue-native-plus'
	export default {
		name:"yx-chat-detail-input",
		emits:['syn','addMessage','activeUtil','hide'],
		props:{
			// isOpenSwipeUtil:{
			// 	type:Boolean,
			// 	default: false
			// },
			// isOpenEmo:{
			// 	type:Boolean,
			// 	default: false
			// },
		},
		mounted(){
			this.getInputHeight()
			this.autoFocus = true
			// setTimeout(()=>{
			// 	if(this.autoFocus) this.autoFocus = false
			// },1000)
			 // plus.keyboard.getHeight((height) => {
			 //    console.log('@plus得到键盘高度',height)
			 //  })
		},
		data() {
			return {
				// 聊天内容框最终移动高度，他 = 键盘高度(键盘事件) + 滑动块高度(系统键盘滑动块originVal) + 适配适配高度(stepVal)
				chatInputHeight:0,
				// 文本域所处在的行数
				curLine:1,
				inputContent:'',
				// 文本域最低和最大高度限定
				textareaParams:{
					minHeight:40,
					maxHeight:150
				},
				// 动态键盘高度
				keyboardHeight:0,
				// 激活时的键盘高度
				activeKeyboardHeight:549,
				// 键盘模态框上的系统滑动块给高度
				originVal : 105,
				// 追加的适配高度
				stepVal: 55,
				inputChangeHeight:0,
				isText:false,
				isOpenSwipeUtil:false,
				isOpenEmo:false,
				isFocus:false
			};
		},
		methods:{
			
			//得到当前键盘高度
			// 根据不同获取高度的策略设置不同的高度 ，如果是keyboard则按此计算，如果为util则为activeKeyBoard计算
			getInputHeight(event='keyboard'){
				switch (event){
					case 'keyboard':
						if(this.curLine == 1){
							this.chatInputHeight = this.originVal
						}else{
							this.chatInputHeight = this.increamentVal + this.originVal	
						}
						// + 80
						// 加上键盘弹起的高度
						if(this.keyboardHeight>0) {
							this.chatInputHeight  +=this.keyboardHeight +90
						}
						break;
					case 'util':
						this.chatInputHeight = this.activeKeyboardHeight + this.originVal+this.stepVal
					break
					default:
						console.log('错误的事件')
						break;
				}
				// 滑动块同步高度
				this.$emit('syn')
			},
			// 激活底部输入框
			activeUtilSwiper(){
				this.isOpenSwipeUtil = true
				this.$emit('activeUtil','utils')
				this.getInputHeight('util')
			},
			// 激活底部输入框
			activeEmot(){
				this.isOpenEmo = true
				this.$emit('activeUtil','emo')
				this.getInputHeight('util')
			},
			// 每次行改变时调用
			textareaLineChangeHandle(e){
				console.log('lineChange',e)
				this.curLine = e.detail.lineCount
				this.inputChangeHeight = e.detail.height
				this.getInputHeight()
			},
			handleFocus(){
				this.isOpenEmo = false
				this.isOpenSwipeUtil = false
				this.$emit('hide')
			},
			//每次改变输入时调用
			textareaInputChange(e){
				// if(this.inputContent.length > 0) {
				// 	this.isText = true
				// }else{
				// 	this.isText = false
				// }
			},
			sendMessage(){
				if(!this.inputContent) return
				console.log('@content---',this.inputContent)
				this.$emit('addMessage',this.inputContent)
				this.inputContent = ''
			},
			keyboardHeightChangeHandle(e){
				console.log('@keyboard',e)
				const height = e.detail.height
			
				if(!this.keyboardHeight && height){
					// 缓存keyboard的高度
					this.keyboardHeight = height + 200
				}
				
				const isPullState = height > 0
				if(isPullState){
					this.isFocus = true
					this.chatInputHeight += this.keyboardHeight
				}else {
					this.chatInputHeight -= this.keyboardHeight
					this.keyboardHeight = 0
					this.isFocus = false
					
					this.isOpenEmo = false
					this.isOpenSwipeUtil = false
					this.$emit('hide')
				}
				
				// 由于无法传入row这个属性，导致scroll-view存在塌陷问题，因此需要收集row
				this.getInputHeight()
			}
		},
		watch:{
			inputContent:{
				handler(){
					console.log('监听到长度变化',this.inputContent.length)
					this.isText = this.inputContent.length > 0
				},
				deep:true,
				immediate:true
			}
		},
		computed:{
			minHeight(){
				return this.textareaParams.minHeight
			},
			maxHeight(){
				return this.textareaParams.maxHeight
			},
			// 控制input盒子高度
			inputHeight(){
				// return this.keyboardHeight  === 0 ? 0 : this.keyboardHeight + 80
				return this.isFocus 
						|| this.isOpenEmo 
						|| this.isOpenSwipeUtil ?
						 this.activeKeyboardHeight + 50 : 0
			},
			increamentVal(){
				let res = (this.inputChangeHeight > this.maxHeight - this.stepVal ? 
															this.maxHeight - this.minHeight : 
															this.inputChangeHeight - this.minHeight + this.stepVal) 
				return res
			}
		}
	}
</script>

<style>

</style>