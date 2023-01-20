<template>

	<view class="fixed-bottom transition-ease-fast-plus  bg-white-four-deep flex justify-between align-center p-1"
		:style="`min-height:60rpx;bottom:${inputHeight}rpx`" ref="inputRef" id="chat-input">
		<view id="record-sign" class="icon-keyboard iconfont mr-1 font-lg" @click="toggleMode"
			:class="inputMode !== 'keyboard' ? 'icon-record' : 'icon-keyboard'"></view>
		<view id="input" class="flex-1 p-1">
			<textarea v-if="inputMode=='keyboard'" v-model="inputContent" :focus="getFocusOnKeyboard" auto-height
				class="flex-1 bg-white-one-deep p-1 rounded" @linechange="textareaLineChangeHandle" @focus="handleFocus"
				@input="textareaInputChange" @keyboardheightchange="keyboardHeightChangeHandle"
				:style="`min-height: ${minHeight}rpx;max-height:${maxHeight}rpx;width: 95%;overflow:auto`"
				:maxlength="-1" placeholder-style="color:#F76260" :adjust-position="false" />
			<view v-if="inputMode=='audio'" class="grid   grid-center-by-el font-md p-1 mr-1 rounded"
				:class="isRecording ? 'bg-white-three-deep':'bg-white '" @touchstart="startRecord"
				@touchmove="moveRecord" @touchend="endRecord">按住 说话</view>
		</view>
		<view id="more-operate" class="mr-2">
			<text class="iconfont icon-smile font-lg mr-1 vertical-middle" @click="activeEmot"></text>
			<text v-if="!isText " class="iconfont icon-add font-lg  p-1 vertical-middle"
				@click="activeUtilSwiper"></text>
			<text v-if="isText " class="iconfont font-sm main-bg-color p-1 text-white" @click="sendMessage">发送</text>
		</view>
	</view>
	<!-- 开启录音时的遮罩层 -->
	<!-- grid grid-center-by-grid-and-ele -->
	<view v-if="isRecording" id="record-mask"
		class=" grid  grid-center-by-grid-and-ele lucency-5 bg-gray-shallow fill-screen">
		<view class="rounded p-2 zTop bg-white-five-deep grid grid-center-by-el"
			style="opacity: 1;width: 340rpx;height:300rpx;">
			<image style="width: 150rpx;height: 260rpx;"
				:src="isUndoRecording ? `/static/audio/recording.gif`:`/static/audio/play.gif`" mode="aspectFill">
			</image>
			<view>{{isUndoRecording ? `松开取消录音` : `录音中` }}</view>
		</view>
	</view>
</template>

<script>
	// import {plus} from 'vue-native-plus'
	import {gotoAppPermissionSetting} from '@/js_sdk/phone-permisson/phone-permission.js'
	export default {
		name: "yx-chat-detail-input",
		emits: ['syn', 'addMessage', 'activeUtil', 'hide'],
		props: {
			// isOpenSwipeUtil:{
			// 	type:Boolean,
			// 	default: false
			// },
			// isOpenEmo:{
			// 	type:Boolean,
			// 	default: false
			// },
		},
		mounted() {
			this.getInputHeight()
			this.autoFocus = true
		},
		data() {
			return {
				// 聊天内容框最终移动高度，他 = 键盘高度(键盘事件) + 滑动块高度(系统键盘滑动块originVal) + 适配适配高度(stepVal)
				chatInputHeight: 0,
				// 文本域所处在的行数
				curLine: 1,
				// 输入值记录
				inputContent: '',
				// 输入值缓存，解决显示bug(暂不完成，为了程序连贯性)
				inputContentCache: '',
				// 文本域最低和最大高度限定
				textareaParams: {
					minHeight: 40,
					maxHeight: 150
				},
				// 动态键盘高度
				keyboardHeight: 0,
				// 激活时的键盘高度
				activeKeyboardHeight: 549,
				// 键盘模态框上的系统滑动块给高度
				originVal: 105,
				// 追加的适配高度
				stepVal: 55,
				// 记录当前input框的高度
				inputChangeHeight: 0,
				// 输入的是否为文字，用于控制显示工具栏还是发送
				isText: false,
				// 是否开启了工具栏
				isOpenSwipeUtil: false,
				// 是否打开了表情
				isOpenEmo: false,
				// 输入框是否为聚焦状态1
				isFocus: false,
				// 输入模式，值 为 keyboard | audio ,默认为keyboard
				inputMode: 'keyboard',
				// 键盘得到焦点
				getFocusOnKeyboard: false,
				// 录音管理器
				// #ifdef APP-PLUS
				recordManager: plus.audio.getRecorder(),
				// #endif
				// 录音使用，判断是否已经越界，取消录音
				touchPosition: {},
				// 判断是否在录音模式
				isRecording: false,
				// 判断是否取消录音
				isUndoRecording: false,
				// 判断是否为有效录音(初始状态为有效，当小于判断值时为无效)
				isValidRecord:true,
				//判断点击的是否为工具栏
				isClickUtil: false,
				// 语音时长记录
				recordingTime: 0,
				// 是否有录音权限
				havingRecordAuth: false,
				audioPath: '',
				// 音频管理器
				// #ifdef APP-PLUS
				audioManager: plus.audio.createPlayer({})
				// #endif
			};
		},
		methods: {
			// 询问获取对应权限
			requestPermission(){
			  let vm = this
			  // eslint-disable-next-line
				let platform = plus.os.name
			  if (platform === 'Android') {
				  console.log('请求权限')
				// 动态申请权限
				// eslint-disable-next-line
				  plus.android.requestPermissions(['android.permission.RECORD_AUDIO'], function (e) {
				  console.log('权限对象',e)
				  // 权限判断
				 if (e.deniedAlways.length > 0 || e.deniedPresent.length > 0) { // 权限被永久拒绝
					uni.showModal({
						title:'关于录音权限',
						content:'录音权限获取失败，如果您不对此软件开启此权限将无法正常使用录音功能',
						confirmText:'去授权',
						cancelText:'拒绝',
						success(e){
							if(e.confirm){
								console.log('同意开启权限，即将跳转')
								gotoAppPermissionSetting()
								this.havingRecordAuth = true
							}else if(e.cancel){
								console.log('不同意开启权限')
							}
						},
						fail(){
						}
					})
				 }
				if (e.granted.length > 0) { // 权限被允许
					this.havingRecordAuth = true
				}
				}, function (e) {
					uni.showToast({
						title:'请求录音权限失败，请到设置权限里找到应用手动开启权限，否则将不能使用此功能。',
						icon:'error'     
					})
				})
			  } else if (platform === 'iOS') {
				vm.recorderPlus.record({}, function () {
				}, function (e) {
				  if (e.code === 2) {
					  uni.showModal({
					  	title:'关于录音权限',
					  	content:'录音权限获取失败，如果您不对此软件开启此权限将无法正常使用录音功能',
					  	confirmText:'去授权',
					  	cancelText:'拒绝',
					  	success(e){
					  		if(e.confirm){
					  			console.log('同意开启权限，即将跳转')
					  			gotoAppPermissionSetting()
					  			this.havingRecordAuth = true
					  		}else if(e.cancel){
					  			console.log('不同意开启权限')
					  		}
					  	},
					  	fail(){
					  	}
					  })
					// vm.$dialog.alert({
					//   message: '录音权限未允许，请到设置手动开启权限，否则将不能使用此功能。'
					// })
				  }
				  console.log(JSON.stringify(e))
				})
				vm.recorderPlus.stop()
			  } else {
				this.startRecord()
			  }
			},
			// 查看是否有录音权限
			getRecordAuth(){
				let permission = plus.navigator.checkPermission('RECORD')
					console.log('当前的权限为',permission)
				      console.log(permission)
				      switch (permission) {
				        case 'authorized':   // 允许
						case 'unknown':    // 未知
				          this.havingRecordAuth = true
						  // return true
				          break
				        case 'denied':    // 拒绝
				        case 'undetermined':    // 询问
				          this.requestPermission()
				          break
				        // case 'unknown':    // 未知
				        //    return true
				        default:
				          console.log('设备不支持录音')
				          break
				      }
			},
			// 录音时调用
			startRecord(e) {
				// 判断是否有录音权限(待完成)
				this.getRecordAuth() 
				// 查看是否会等待权限回调完成，如果没有等待使用promise达到同步（不需要完成同步第一次执行touch操作用于完成权限注入，第二次点击即可拥有对应权限）
				if(!this.havingRecordAuth){
					return 
				}
				// 文件名必须以  _doc/开头，否则无法判断路径准确性，其是一个相对路径
				const recordObj = {
					filename: '_doc/audio/',
					format: 'mp3'
				}
				const self = this
				
				// 开始录音
				this.recordManager.record(recordObj, (e) => {
					self.audioPath = e
					// 无法正确的播放，音频地址只能瞬时记录？
					self.audioManager.setStyles({src:e})
					
					
					// 使用宏任务降低执行优先级用于充分得到正确秒数,否则无法获取正确值
					setTimeout(()=>{
						// 判断是否为有效的录音,如果是则进行存储，否则不存储，然后进行初始化操作哦
						if(self.isValidRecord){
							// 进行存储
							const audio_time = Math.ceil(self.audioManager.getDuration())
							self.$emit('addMessage',self.audioPath,'audio',audio_time)
						}
						// 恢复录制状态
						self.isValidRecord = true
					},60)
					
				}, (err) => {
					console.log('录音错误', err)
				})
				// 记录录音点击位置
				this.touchPosition = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
				}
				// 记录语音状态
				this.isRecording = true
				// 记录开始录音时间
				this.recordingTime = e.timeStamp
			},
			moveRecord(e) {
				if(!this.havingRecordAuth){
					return 
				}
				const y = e.touches[0].clientY
				this.isUndoRecording = Math.abs(this.touchPosition.y - y) >= 60
			},
			// 松开时录音时调用
			endRecord(e) {
				if(!this.havingRecordAuth){
					return 
				}
				// 只对y的坐标进行一个判断
				const y = e.changedTouches[0].clientY
				const endTime = e.timeStamp
				const limitTime = 1000
				if (Math.abs(this.touchPosition.y - y) >= 60 ||
					endTime - this.recordingTime < limitTime) {
					// 取消录音，执行对应操作
					// 不是有效的录音，即不进行存储
					this.isValidRecord = false
					if (Math.abs(this.touchPosition.y - y) >= 60) {

						uni.showToast({
							title: '取消录音成功',
							duration: 500,
							icon: 'none'
						})
					}
					if (endTime - this.recordingTime < limitTime) {
						uni.showToast({
							title: '语音时间太短，取消录音',
							duration: 500,
							icon: 'none'
						})
					}
				}
				// 录音结束
				this.recordManager.stop()
				// 恢复录音初始状态
				this.isRecording = false
				this.recordingTime = 0
				this.isUndoRecording = false
			},
			// 切换输入模式
			toggleMode() {
				if (this.inputMode === 'keyboard') {
					// this.inputContentCache = this.inputContent
					this.inputContent = ''
					// 关闭emo和util的bottom展示框
					this.handleFocus()


					// 当为键盘模式时，因呼出键盘
					this.getInputHeight('audio')
					// 在切换为音频时，原输入内容因保存
					this.inputMode = 'audio'

					this.getFocusOnKeyboard = false
				} else {
					// this.inputContent= this.inputContentCache 
					this.inputMode = 'keyboard'
					this.getFocusOnKeyboard = true
				}
			},
			//得到当前键盘高度
			// 根据不同获取高度的策略设置不同的高度 ，如果是keyboard则按此计算，如果为util则为activeKeyBoard计算
			getInputHeight(event = 'keyboard') {
				switch (event) {
					case 'keyboard':
						if (this.curLine == 1) {
							this.chatInputHeight = this.originVal
						} else {
							this.chatInputHeight = this.increamentVal + this.originVal
						}
						// + 80
						// 加上键盘弹起的高度
						if (this.keyboardHeight > 0) {
							this.chatInputHeight += this.keyboardHeight + 90
						}
						break;
					case 'util':
						this.chatInputHeight = this.activeKeyboardHeight + this.originVal + this.stepVal
						break

						// 处理多行输入，导致内容高度增高，在切换到录音模式时，高度异常问题
					case 'audio':
						this.chatInputHeight = this.originVal
						break
					default:
						console.log('错误的事件')
						break;
				}
				// 滑动块同步高度
				this.$emit('syn')
			},
			// 点击功能栏 + 号，激活底部输入框
			activeUtilSwiper() {
				this.isOpenSwipeUtil = true
				this.inputMode = 'keyboard'
				this.isClickUtil = true
				// this.isText = true
				this.$emit('activeUtil', 'utils')
				this.getInputHeight('util')
				// setTimeout(()=>this.isText=false,10)
			},
			//  点击功能栏 😊 号，激活底部输入框
			activeEmot() {
				this.isOpenEmo = true
				this.inputMode = 'keyboard'

				this.isClickUtil = true
				// this.isText = true
				this.$emit('activeUtil', 'emo')
				this.getInputHeight('util')

				// setTimeout(()=>this.isText=false,10)

			},
			// 每次行改变时调用
			textareaLineChangeHandle(e) {
				// 在录音模式下点击表情等弹出键盘时，会触发行高模式，导致无法正确得到高度
				// 增加判断是否点击的是工具即可
				if (this.isClickUtil) return
				this.curLine = e.detail.lineCount
				this.inputChangeHeight = e.detail.height
				this.getInputHeight()
			},
			handleFocus() {
				this.isOpenEmo = false
				this.isOpenSwipeUtil = false
				this.$emit('hide')
			},
			//每次改变输入时调用
			textareaInputChange(e) {
				// if(this.inputContent.length > 0) {
				// 	this.isText = true
				// }else{
				// 	this.isText = false
				// }

			},
			sendMessage() {
				if (!this.inputContent) return
				this.$emit('addMessage', this.inputContent, 'text')
				this.inputContent = ''
			},
			keyboardHeightChangeHandle(e) {
				const height = e.detail.height

				if (!this.keyboardHeight && height) {
					// 缓存keyboard的高度
					this.keyboardHeight = height + 200
				}

				const isPullState = height > 0
				if (isPullState) {
					this.isFocus = true
					this.chatInputHeight += this.keyboardHeight
				} else {
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
		watch: {
			inputContent: {
				handler() {
					this.isText = this.inputContent.length > 0
					if (this.isText) {
						this.isClickUtil = false
					} else {
						this.curLine = 1 // 说明此时仅有1行
					}
				}
			}
		},
		computed: {
			minHeight() {
				return this.textareaParams.minHeight
			},
			maxHeight() {
				return this.textareaParams.maxHeight
			},
			// 控制input盒子高度
			inputHeight() {
				// return this.keyboardHeight  === 0 ? 0 : this.keyboardHeight + 80
				return this.isFocus ||
					this.isOpenEmo ||
					this.isOpenSwipeUtil ?
					this.activeKeyboardHeight + 50 : 0
			},
			increamentVal() {
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
