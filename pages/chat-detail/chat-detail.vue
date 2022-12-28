<template>
	<view class="page">
		 <!-- 导航栏 -->
		<yx-nav-bar :title="this.name"/>
		<!-- 滑动内容 -->
		<scroll-view scroll-y="true" @scroll="scroll" :scroll-top="scrollHeight"
		class="position-fixed transition-ease-fast" :style="`top:95rpx;bottom:${scrollViewHeight}rpx`">
			<yx-chat-item-detail v-for="message in userChatMessage" :key="message.id" :chatMessage="message" @touchstart="(e)=>handleTouch(message,e)"
				 @touchend="(e)=>handleLeave(message,e)"></yx-chat-item-detail>
		</scroll-view>
		<!-- 输入框 -->
		<yx-chat-detail-input @addMessage="addMessage" ref="inputBar" @hide="handlePopHide" @syn="synMoveDistance" @activeUtil="changeInputState"></yx-chat-detail-input>
		<yx-popup :show="popShow" :popPosittion="popPosition" :popHeight="popupHeight" 
		:utilArr="utilArr" :emoArr="emoArr" :bottomMode="bottomMode" :bottomClickTransition="bottomClickTransition"
		:isDark="popIsDark" :popItem="popData" :isBottom="isBottom" :popupContentOfUtilInBottom="popupBottomData"
		@hide="handlePopHide" @action="actionHandle" >
			<!-- 由于android移动端无法兼容两个滑动块共用一个组件，因此要分开写 -->
			<template #util>
				<view v-if="bottomMode=='utils'">
					<swiper style="height:500rpx;width:100%;" circular :indicator-dots="true" :duration="100">
						<swiper-item style="height:100%;" :class="bottomClickTransition ? 'opacity-0':'opacity-1'" v-for="itemArr in utilArr">
							<view class="flex  justify-between zTop flex-wrap ">
								<view @click="utilEventHandle(item.event)" v-for="item in itemArr" :key="item.id" style="flex:0 0 25%;height:200rpx;" 
								class="justify-center flex flex-column  align-center mt-1">
									<image :src="item.img_src" mode="aspectFit" style="height: 70%;width: 70%;"></image>
									<text>{{item.text}}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</template>
			
			<template #emo>
				<view v-if="bottomMode=='emo'">
					<scroll-view :scroll-y="true" class="transition-ease-fast" style="height: 550rpx;">
						<view style="height:100%;" :class="bottomClickTransition ? 'opacity-0':'opacity-1'" >
							<view class="grid  justify-between zTop grid-3">
								<view @click="addMessage(emoItem.img_src,'image')" v-for="emoItem in emoArr" :key="emoItem.id" style="flex:0 0 25%;height:200rpx;"
								class="justify-center flex flex-column  align-center mt-1">
									<image :src="emoItem.img_src" mode="aspectFit" style="height: 50%;width: 50%;"></image>
									<text>{{emoItem.text}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</template>
		</yx-popup>
		
	</view>
</template>

<script>
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxChatItemDetail from '@/components/chat/yx-chat-item-detail.vue'
	import YxChatDetailInput from '@/components/chat/yx-chat-detail-input.vue'
	import YxPopup from '@/components/yx-popup.vue'
	import chatMesssage from '@/static/testData/chatMessage.js'
	import chatUtils from '@/static/testData/chatUtils.js'
	import chatEmo from '@/static/testData/chatEmo.js'
	export default {
		components:{
			YxNavBar,YxChatItemDetail,YxChatDetailInput,YxPopup
		},
		provide(){
			return {
				// 判断是否点击的是消息框
				isValidSetTouch:this.isValidSetTouch
			}
		},
		onLoad(query){
			this.name=query.name
			console.log('@显示得为',query)
		},
		mounted(){
			// data,methods,computed的初始化在模板解析之前，
			//因此在他们内部无法得到refs收集的子组件(类)信息，需要在mounted中才能访问
			console.log('@scrollView-mounted', this.$refs.inputBar.chatInputHeight)
			console.log('@键盘激活的高度', this.$refs.inputBar.activeKeyboardHeight)
			console.log('@wwwww',this.popupContentOfUtilInBottom)
		},
		data() {
			return {
				// 聊天对象
				name:'',
				// 记录聊天信息是否已经完成格式化转换(转换换行和空格)
				isCompleteConvert:false,
				// 滑动消息块到底部
				scrollHeight:1,
				// 滑动块需要变动的距离
				scrollViewHeight:0,
				// 所有用于信息
				userMessage:chatMesssage,
				// 触发popup得用户信息
				curUserMessage:{},
				// popup框得对话内容
				popData:[],
				// pop框得位置
				popPosition:{},
				// pop框得是否为黑色
				popIsDark:false,
				// pop框是否展示
				popShow:false,
				// 当前点击得是否为消息框
				isValidTouch:false,
				// 点击得消息对象
				touchTarget:'',
				// 记录touchTime时间， 使用结束点击时间减去当前触摸时间即可判断执行什么操作
				
				touchStartTime:0,
				// popup是否处于底部，如果为底部则说明是功能框，需要指定高度
				isBottom:false,
				// 在底部的情况下popup的高度
				popupHeight:0,
				// 在底部的情况下popup的展示内容，为 util | emo
				bottomMode: '',
				utilArr:chatUtils,
				emoArr:chatEmo,
				// 点击切换表情和功能框时的过渡
				bottomClickTransition:false,
				// 在popup在底部时，展示的内容
				popupBottomData:chatUtils
			}
		},
		methods: {
			// 从相册选择图片发送
			utilEventHandle(event){
				const self = this
				switch (event){
					case 'uploadImage':
						uni.chooseImage({
							count:4, // 最多选择图片个数
							success(e){
								console.log('图片路径',e)
								e.tempFilePaths.forEach(path=>{
									// 底层掉用的函数，因此this的指向不能满足我们的预期，需要进行缓存
									self.addMessage(path,'image')
								})
							}
						})
						break;
					default:
					console.log('utils event err')
						break;
				}
			},
			// 打开输入框栏的功能框
			changeInputState(event){
				
				switch(event){
					case 'utils':
					console.log('utils操作')
					this.popupBottomData = chatUtils
					break
					case 'emo':
					console.log('emo操作')
					this.popupBottomData = chatEmo
					break
					default:
					console.log('没有命中事件')
				}				
				this.bottomClickTransition = true
				this.bottomMode = event
				this.isBottom = true
				this.popShow = true
				console.log('@键盘激活的高度', this.$refs.inputBar.activeKeyboardHeight)
				this.popupHeight = this.$refs.inputBar.activeKeyboardHeight
				this.popPosition={x:0,y:0}
				
				setTimeout(()=>{
					this.bottomClickTransition=false
					console.log('切换显示sssss')
				},100)
			},
			
			// 输入框添加消息信息
			addMessage(message,type){
				const m = {
					id:Date.now(),
					// user_id标识是那个用户发送得信息，0为本人，其他为其他人
					user_id:0,
					// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
					// type:'text',
					type,
					// 标识消息发送时间  number | null 用于标识是否出现时间文本
					// message_time:1671783711881,
					message_time:Date.now(),
					// 信息是否被撤销
					isUndone: false,
					// 信息是否被删除
					isDel:false,
					// 用于存储用户数据
					// data: '我是数据',
					// convertln将所有\n转换为<p></p>然后返回
					data: type === 'text' ? this.convertln(message) : message,
					user_image:'/static/logo.png',
					showTime: true
				}
				// switch(type){
				// 	case 'text':
				// 	m.type = 'text'
				// 		break
				// 	case 'image':
				// 	m.type = 'text'
				// 		console.log('处理发送图片')
				// 		break
				// 	case 'audio':
					
				// 	m.type = 'text'
				// 		console.log('处理发送音频')
				// 		break
				// 	case 'video':
					
				// 	m.type = 'text'
				// 		console.log('处理发送视频')
				// 		break
				// 	default:
				// 		console.log('发送消息失败，没有对应事件处理')
				// }
				// 判断此次消息发送时间距离上次时间的间隔(抽象一个方法来完成判断)
				const lastIndex = this.userMessage.length -1
				const preTime = this.userMessage[lastIndex].message_time
				const timeLimit = 1000 * 60 * 10
				m.showTime =  m.message_time - preTime > timeLimit
				
				// 滑动到底部
				this.scrollBottom()

				// 添加信息
				this.userMessage.push(m)
			},
			
			// 滚动到底部
			scrollBottom(){
				setTimeout(()=>{
					
					this.scrollHeight+=100
				},1)
				setTimeout(()=>{
					
					this.scrollHeight-=100
				},2)
				
			},
			// 转换输入(由于输入的\n实际渲染时会被识别为空格，因此我们可以手动来\n转换为p标签，然后进行v-html渲染)
			convertln(target){
				let res = ''
				const patternln = /\n/g
				const patternls = /\s/g
				// 转换换行
				res = target.replace(patternln,'<p></p>')
				// 转换空格
				res = res.replace(patternls,'&nbsp;')
				console.log('加工字符串',target)
				return res
			},
			// 初次挂载时，页面滑动到底部
			scroll(e){
				// 滑动到页面底部
				this.scrollHeight = e.detail.scrollHeight
			},
			actionHandle(event){
				switch (event){
					// 撤回
					case 'undo':
					this.curUserMessage.isUndone = true
						break;
					case 'del':
					this.curUserMessage.isDel = true
						break;
					default:
						console.log('没有此事件')
						break;
				}
			},
			// 是一个有效得触摸(点击到了聊天框上)
			// target为点击得消息对象
			isValidSetTouch(target){
				// console.log('点击设置touch',target)
				this.touchTarget = target
				this.isValidTouch = true
			},
			// 触摸聊天框时调用
			handleTouch(user,e){
				if(this.isValidTouch){
					this.touchStartTime = e.timeStamp
					// console.log('收集时间')
				}
				let x = e.touches[0].clientX
				let y = e.touches[0].clientY 
				
				const device = uni.getSystemInfoSync()
				const maxX = device.screenWidth
				const maxY = device.screenHeight
				x = x +130 > maxX ? maxX-130 : x
				y = y +300 > maxY ? maxY-300 : y
				y = y - 50 < 0 ? 50 : y
				this.popPosition={x,y}
				
			},
			handleLeave(message,e){
				// user.is_touch = false
				// console.log('我离开了,当前popShow状态',this.popShow)
				
				const endTime = e.timeStamp
				if(this.touchStartTime && endTime - this.touchStartTime>400){
					// 功能框展示模式
					this.isBottom = false
					// console.log('选择得message',message)
					// 有效的touch呼出popup
					// console.log('展示pop')
					this.curUserMessage = message
					// 设置撤回时间(3分钟以内)
					const undoLimitTime = 1000*60*3
					// 小于撤回时间，且当前得消息是自己得
					const allowUndo = (Date.now() - this.touchTarget.message_time < undoLimitTime) 
					&& (this.touchTarget.user_id === 0);
					// console.log('允许撤回吗？',allowUndo)
					// 设置内容
					this.popData = [
					{
						id:1,
						content:'复制',
						
					},
					{
						id:2,
						content:'发送给朋友'						
					},
					{
						id:3,
						content: allowUndo  ? '撤回': ''	,
						event:'undo'
					},
					{
						id:4,
						content:'删除',
						event:'del'								
					},
					{
						id:5,
						content:'收藏'						
					},
				]
					this.popShow = true
					
					// 重置触摸状态
					this.touchStartTime = 0
					this.isValidTouch = false
				}else{
					this.popShow= false
				}
				
			},
			handlePopHide(){
				this.popShow = false
				if(this.isBottom){
					// 重置页面布局
					this.$refs.inputBar.isOpenSwipeUtil = false
					this.$refs.inputBar.isOpenEmo = false
					// 此时说明没有输入任何文本数据，则直接获取高度即可(没有任何文本默认归回原位)
					this.$refs.inputBar.getInputHeight()
					// this.$refs.inputBar.chatInputHeight = this.$refs.inputBar.originVal
				}
			},
			// 同步移动距离
			synMoveDistance(){
					this.scrollViewHeight = this.$refs.inputBar.chatInputHeight
					this.scrollBottom()
					console.log('完成变化同步',this.scrollViewHeight)
			}
		},
		computed:{
			// 对象userMessage进行时间加工处理 ，如果两条消息发出得时间大于10分钟则显示时间
			userChatMessage(){
				// 给第0个索引上的元素进行转换
				if(!this.isCompleteConvert){
					this.userMessage[0].data = this.convertln(this.userMessage[0].data)
					for(let i = 1; i<this.userMessage.length;i++){
							const curTime = this.userMessage[i].message_time
							const preTime = this.userMessage[i-1].message_time
							const timeLimit = 1000 * 60 * 10
							this.userMessage[i].showTime = curTime - preTime > timeLimit
							this.userMessage[i].data = this.convertln(this.userMessage[i].data)
					}
				    // 标记完成转换
					this.isCompleteConvert = true
				}
				
				return this.userMessage
			}
		}
	}
</script>

<style>

</style>
