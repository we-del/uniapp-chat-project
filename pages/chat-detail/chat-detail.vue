<template>
	<!-- 得到最新的点击时间，避免出现点击消息，松开，又长按触发的错误计数行为 -->
	<!-- <view class="page" @touchstart="touchStartTime=Date.now()"> -->
	<yx-common-wrapper>
		
		 <!-- 导航栏 ,需要对点击的聊天框做判断，判断为用户还是群组，他们去往的路由不同-->
		<yx-nav-bar :title="this.name" :requireOccupy="false" :isChat="true" :routerPath="`/pages/chat-detail/chat-about-group-setting/chat-about-group-setting?${this.name}`"/>
		<!-- 滑动内容 -->
		<scroll-view scroll-y="true" @scroll="scroll" :scroll-top="scrollHeight"
		class="position-fixed " :style="`top:${95+fixedTop}rpx;bottom:${scrollViewHeight}rpx`">
			<yx-chat-item-detail v-for="message in userChatMessage" :key="message.id" @click="isChat = true;isBottom=false" :chatMessage="message"></yx-chat-item-detail>
		<!-- 	<yx-chat-item-detail v-for="message in userChatMessage" :key="message.id" :chatMessage="message"
				 @touchend="(e)=>handleLeave(message,e)"></yx-chat-item-detail> -->
		</scroll-view>
		<!-- 输入框 -->
		<yx-chat-detail-input @addMessage="addMessage" ref="inputBar" @hide="handlePopHide" @syn="synMoveDistance" @activeUtil="changeInputState"></yx-chat-detail-input>
		<yx-popup :show="popShow" :popPosittion="popPosition" :popHeight="popupHeight"  :isChat="isChat"
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
		
	</yx-common-wrapper>
</template>

<script>
	import YxCommonWrapper from '@/components/yx-common-wrapper.vue'
	import YxNavBar from '@/components/yx-nav-bar.vue'
	import YxChatItemDetail from '@/components/chat/yx-chat-item-detail.vue'
	import YxChatDetailInput from '@/components/chat/yx-chat-detail-input.vue'
	import YxPopup from '@/components/yx-popup.vue'
	import chatMesssage from '@/static/testData/chatMessage.js'
	import chatUtils from '@/static/testData/chatUtils.js'
	import chatEmo from '@/static/testData/chatEmo.js'
	import {mapState} from 'pinia'
	import {useDeviceStore} from '@/store/device.js'
	export default {
		components:{
			YxNavBar,YxChatItemDetail,YxChatDetailInput,YxPopup,YxCommonWrapper
		},
		provide(){
			return {
				// 判断是否点击的是消息框 , 单一职责原则，数据在哪里，就在哪里进行操控，可以将方法传给组件实例，使其完成修改调用
				touchMessageOfChat:this.handleTouch,
				touchLeaveMessageOfChat:this.handleLeave,
				validPreviewOfImage:this.previewImage
			}
		},
		onLoad(query){
			this.name=query.name
		},
		mounted(){
			// data,methods,computed的初始化在模板解析之前，
			//因此在他们内部无法得到refs收集的子组件(类)信息，需要在mounted中才能访问
			// console.log('@scrollView-mounted', this.$refs.inputBar.chatInputHeight)
			// console.log('@键盘激活的高度', this.$refs.inputBar.activeKeyboardHeight)
			// console.log('@wwwww',this.popupContentOfUtilInBottom)
			this.scrollBottom()
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
				// 点击得消息对象
				touchTarget:'',
				// 记录touchTime时间， 使用结束点击时间减去当前触摸时间即可判断执行什么操作
				
				touchStartTime:0,
				// popup是否处于底部，如果为底部则说明是功能框，需要指定高度
				isBottom:false,
				// popup为chat模式
				isChat:false,
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
			// 预览图片
			previewImage(path){
				uni.previewImage({
					// 可以优化，得到当前点击的在加载聊天时的所有图片的索引，即可预览正确的图片
					// 否则如果有多个重复路径的图片会无法找到正确的图，不过后期所有图片指定唯一路径后可以处理
					current:path,
					indicator:'number',
					// 长按图片时产生的操作
					urls:this.imageArr,
					longPressActions:{
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('执行长按操作',data)
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				})
			},
			
			// 从相册选择图片发送
			utilEventHandle(event){
				const self = this
				switch (event){
					case 'upload':
						plus.gallery.pick(({files})=>{
							files.forEach(path=>{
								
								// 需要对选中的资源进行进一布处理，判断是视频还是图片，通过后缀判断
								const imageType = ['BMP', 'DIB', 'PCP', 'DIF', 'WMF', 'GIF', 'JPG', 'TIF', 'EPS', 'PSD', 'CDR', 'IFF', 'TGA', 'PCD', 'MPT', 'PNG']
								const videoType = ['AVI', 'mov', 'rmvb', 'rm', 'FLV', 'mp4', '3GP']
								
								// 定位到 n.mp4 中的.的后一位索引即 m
								const sep = path.lastIndexOf('.') + 1 
								const fileSuffix = path.substring(sep,path.length)
								// 判断是否为视频
								if(imageType.map(m=>m.toLowerCase()).includes(fileSuffix) ||imageType.map(m=>m.toUpperCase()).includes(fileSuffix) ){
									
									self.addMessage(path,'image')
								}
								// 判断是否为音频
								if(videoType.map(m=>m.toLowerCase()).includes(fileSuffix) ||videoType.map(m=>m.toUpperCase()).includes(fileSuffix) ){
									plus.io.getVideoInfo({
										filePath:path,
										success(e){
											console.log('io-e',e)
										}
										
									});
									self.addMessage(path,'video')
								}
							})
						},(err)=>{
							console.log(err)
						},{
							multiple:true,
							permissionAlert:true,
							filter:'none'
						});
						break;
					case 'camera':
						// const self = this;
						const camera = plus.camera.getCamera();
						camera.captureImage((path)=>{
							// 照片虚拟路径，将虚拟路径存储到手机存储中
							plus.gallery.save(path,(path)=>{
								console.log('@success',path)
							})
						}, (err)=>{
							console.log(err)
						});
						// uni.chooseVideo({
						// 	sourceType: ['camera', 'album'],
						// 	success: function (res) {
						// 		self.addMessage(res.tempFilePath,'video')
						// 	}
						// });
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
					this.popupBottomData = chatUtils
					break
					case 'emo':
					this.popupBottomData = chatEmo
					break
					default:
					console.log('没有命中事件')
				}				
				this.isChat = false
				this.bottomClickTransition = true
				this.bottomMode = event
				this.isBottom = true
				this.popShow = true
				this.popupHeight = this.$refs.inputBar.activeKeyboardHeight
				this.popPosition={x:0,y:0}
				
				// 切换时的过渡显示
				setTimeout(()=>{
					this.bottomClickTransition=false
				},50)
			},
			
			// 输入框添加消息信息
			addMessage(message,type,record_time){
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
				
				// 说明是音频数据，需要时间字段
				if(record_time) {
					m.record_time = record_time
				}
				// 判断此次消息发送时间距离上次时间的间隔(抽象一个方法来完成判断)
				const lastIndex = this.userMessage.length -1
				const preTime = this.userMessage[lastIndex].message_time
				const timeLimit = 1000 * 60 * 10
				m.showTime =  m.message_time - preTime > timeLimit
				

				// 添加信息
				this.userMessage.push(m)
				
				// 滑动到底部
				this.scrollBottom()
			},
			
			// 滚动到底部（有一个滑动行为即可）
			scrollBottom(){
				// 解决滚动异常bug，两次滚动需要有时间差，以此完成二次滚动来解决滚动不到底部问题
				this.scrollHeight-=100
				setTimeout(()=>this.scrollHeight+=100,5)
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
				return res
			},
			// 初次挂载时，页面滑动到底部(存在滑动行为即可调用)
			scroll(e){
				// 滑动到页面底部
				setTimeout(()=> this.scrollHeight = e.detail.scrollHeight,10)
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
			// 触摸聊天框时调用
			handleTouch(target,e){ 
				this.touchStartTime = e.timeStamp
				this.touchTarget = target
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
			// 在聊天盒子内即可调用，可能出现怪异行为，即点击聊天信息记录开启时间，点击聊天盒子触发popup,尝试解决：将离开时间绑定到聊天框中
			handleLeave(message,e){
				
				const endTime = e.timeStamp
				if(this.touchStartTime && endTime - this.touchStartTime>400){
					// 功能框展示模式
					this.isBottom = false
					// 有效的touch呼出popup
					this.curUserMessage = message
					// 设置撤回时间(3分钟以内)
					const undoLimitTime = 1000*60*3
					// 小于撤回时间，且当前得消息是自己得
					const allowUndo = (Date.now() - this.touchTarget.message_time < undoLimitTime) 
					&& (this.touchTarget.user_id === 0);
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
			// 同步移动距离(添加过渡后，第一次同步滚动会有一小段距离无法完成同步，不添加则无此问题)
			synMoveDistance(){
					this.scrollViewHeight = this.$refs.inputBar.chatInputHeight
					console.log('当前移动的高度',this.scrollViewHeight)
					this.scrollBottom()
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
			},
			imageArr(){
				const imageUrlStore = []
				
				this.userMessage.forEach(o=>{
					if(o.type === 'image'){
						imageUrlStore.push(o.data)
					}
				})
				return imageUrlStore
			},
			...mapState(useDeviceStore,['fixedTop']),
		}
	}
</script>

<style>

</style>
