<template>
	
	<view class="fixed-bottom transition-ease-fast-plus  bg-white-four-deep flex justify-between align-center p-1" 
	:style="`min-height:60rpx;bottom:${inputHeight}rpx`" 
	ref="inputRef"  id="chat-input">
		<view id="record-sign" class="icon-keyboard iconfont mr-1 font-lg" @click="toggleMode" :class="inputMode !== 'keyboard' ? 'icon-record' : 'icon-keyboard'"></view>
		<view id="input" class="flex-1 p-1">
			<textarea v-if="inputMode=='keyboard'" v-model="inputContent" :focus="getFocusOnKeyboard" auto-height class="flex-1 bg-white-one-deep p-1 rounded"
			@linechange="textareaLineChangeHandle" @focus="handleFocus" @input="textareaInputChange" @keyboardheightchange="keyboardHeightChangeHandle"
			:style="`min-height: ${minHeight}rpx;max-height:${maxHeight}rpx;width: 95%;overflow:auto`" :maxlength="-1"
			 placeholder-style="color:#F76260" :adjust-position="false" />
			 <view v-if="inputMode=='audio'" class="grid   grid-center-by-el font-md p-1 mr-1 rounded" 
			  :class="isRecording ? 'bg-white-three-deep':'bg-white '"
			  @touchstart="startRecord" @touchmove="moveRecord" @touchend="endRecord">按住 说话</view>
		</view>
		<view id="more-operate" class="mr-2">
			<text class="iconfont icon-smile font-lg mr-1 vertical-middle" @click="activeEmot"></text>
			<text v-if="!isText " class="iconfont icon-add font-lg  p-1 vertical-middle" @click="activeUtilSwiper"></text>
			<text v-if="isText " class="iconfont font-sm main-bg-color p-1 text-white" @click="sendMessage">发送</text>
		</view>
	</view>
	<!-- 开启录音时的遮罩层 -->
	<!-- grid grid-center-by-grid-and-ele -->
	<view v-if="isRecording" id="record-mask" class=" grid  grid-center-by-grid-and-ele lucency-5 bg-gray-shallow fill-screen" >
		<view class="rounded p-2 zTop bg-white grid grid-center-by-el" style="opacity: 1;width: 340rpx;height:300rpx;" >
			<image style="width: 150rpx;height: 260rpx;" src="/static/audio/play.gif" mode="aspectFill"></image>
			<view >录音中</view>
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
			this.recordManager = uni.getRecorderManager()
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
				// 输入值记录
				inputContent:'',
				// 输入值缓存，解决显示bug(暂不完成，为了程序连贯性)
				inputContentCache:'',
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
				// 记录当前input框的高度
				inputChangeHeight:0,
				// 输入的是否为文字，用于控制显示工具栏还是发送
				isText:false,
				// 是否开启了工具栏
				isOpenSwipeUtil:false,
				// 是否打开了表情
				isOpenEmo:false,
				// 输入框是否为聚焦状态1
				isFocus:false,
				// 输入模式，值 为 keyboard | audio ,默认为keyboard
				inputMode:'keyboard',
				// 键盘得到焦点
				getFocusOnKeyboard: false,
				// 录音管理器
				recordManager:null,
				// 录音使用，判断是否已经越界，取消录音
				touchPosition: {},
				// 判断是否在录音模式
				isRecording: false,
				//判断点击的是否为工具栏
				isClickUtil:false
			};
		},
		methods:{
			// 录音时调用
			startRecord(e){
				console.log('开始录音',e)
				this.touchPosition = {
					x:e.touches[0].clientX,
					y:e.touches[0].clientY
				}
				this.isRecording = true
			},
			moveRecord(e){
				console.log('移动',e)
				// 移动超出范围时展示取消录音图标
				const y = e.touches[0].clientY
				console.log('move')
				if(this.touchPosition.y - y >=130){
					// 取消录音
				}
			},
			// 松开时录音时调用
			endRecord(e){
				console.log('结束',e)
				// 只对y的坐标进行一个判断
				const y = e.changedTouches[0].clientY
				if(this.touchPosition.y - y >=130){
					// 取消录音
				}
				this.isRecording = false
			},
			// 切换输入模式
			toggleMode(){
				if(this.inputMode === 'keyboard'){
					// this.inputContentCache = this.inputContent
					this.inputContent = ''
					// 关闭emo和util的bottom展示框
					this.handleFocus()
					
					
					// 当为键盘模式时，因呼出键盘
					this.getInputHeight('audio')
					// 在切换为音频时，原输入内容因保存
					this.inputMode = 'audio'
					
					this.getFocusOnKeyboard = false
				}else {
					 // this.inputContent= this.inputContentCache 
					this.inputMode = 'keyboard'
					this.getFocusOnKeyboard = true
				}
			},
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
						console.log('点击了功能框完成',this.chatInputHeight)
					break
					
					// 处理多行输入，导致内容高度增高，在切换到录音模式时，高度异常问题
					case 'audio':
						this.chatInputHeight = this.originVal
						console.log('点击了功能框完成',this.chatInputHeight)
					break
						default: 
						console.log('错误的事件')
						break;
				}
				// 滑动块同步高度
				this.$emit('syn')
			},
			// 点击功能栏 + 号，激活底部输入框
			activeUtilSwiper(){
				this.isOpenSwipeUtil = true
				this.inputMode = 'keyboard'
				this.isClickUtil = true
				// this.isText = true
				this.$emit('activeUtil','utils')
				this.getInputHeight('util')
				// setTimeout(()=>this.isText=false,10)
			},
			//  点击功能栏 😊 号，激活底部输入框
			activeEmot(){
				this.isOpenEmo = true
				this.inputMode = 'keyboard'
				
				this.isClickUtil = true
				// this.isText = true
				this.$emit('activeUtil','emo')
				this.getInputHeight('util')
				
				// setTimeout(()=>this.isText=false,10)
				
			},
			// 每次行改变时调用
			textareaLineChangeHandle(e){
				// 在录音模式下点击表情等弹出键盘时，会触发行高模式，导致无法正确得到高度
				// 增加判断是否点击的是工具即可
				if(this.isClickUtil) return
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
				console.log(this.inputContent)
				this.$emit('addMessage',this.inputContent,'text')
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
					if(this.isText){
						this.isClickUtil=false
					}else{
						this.curLine = 1 // 说明此时仅有1行
					}
				}
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