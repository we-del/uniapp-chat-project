/**
 * @description 聊天信息，用于聊天页面，充当数据填充，具体字段如下
 */
export default [
	{
		id:'a1',
		// user_id标识是那个用户发送得信息，0为本人，其他为其他人
		user_id:0,
		// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
		type:'text',
		// type:'image',
		// 标识消息发送时间  number | null 用于标识是否出现时间文本
		// message_time:1671783711881,
		message_time:Date.now()-1000000,
		// 信息是否被撤销
		isUndone: false,
		// 信息是否被删除
		isDel:false,
		// 用于存储用户数据
		// data: '我是数据',
		data: `33
				3
				3`,
		user_image:'/static/logo.png',
		showTime: true
	},
	{
		id:'a1',
		// user_id标识是那个用户发送得信息，0为本人，其他为其他人
		user_id:0,
		// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
		// type:'text',
		type:'image',
		// 标识消息发送时间  number | null 用于标识是否出现时间文本
		// message_time:1671783711881,
		message_time:Date.now()-1000000,
		// 信息是否被撤销
		isUndone: false,
		// 信息是否被删除
		isDel:false,
		// 用于存储用户数据
		// data: '我是数据',
		data: '/static/images/bg.jpg',
		user_image:'/static/logo.png',
		showTime: true
	},
	{
		id:'a2',
		// user_id标识是那个用户发送得信息，0为本人，其他为其他人
		user_id:1,
		// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
		// type:'text',
		type:'image',
		// 标识消息发送时间  number | null 用于标识是否出现时间文本
		// message_time:1671783711881,
		message_time:Date.now()-10000,
		// 信息是否被撤销
		isUndone: false,
		// 信息是否被删除
		isDel:false,
		// 用于存储用户数据
		// data: '我是数据',
		data: '/static/images/nothing/no_pay.png',
		user_image:'/static/logo1.png',
		showTime: true
	},
	{
		id:'a3',
		// user_id标识是那个用户发送得信息，0为本人，其他为其他人
		user_id:1,
		// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
		// type:'text',
		type:'image',
		// 信息是否被撤销
		isUndone: false,
		// 信息是否被删除
		isDel:false,
		// 标识消息发送时间  number | null 用于标识是否出现时间文本
		// message_time:1671783711881,
		message_time:Date.now()-10000,
		// 用于存储用户数据
		// data: '我是数据',
		data: '/static/images/nothing/no_pay.png',
		user_image:'/static/logo1.png',
		showTime: true
	},
	{
		id:'a4',
		// user_id标识是那个用户发送得信息，0为本人，其他为其他人
		user_id:1,
		// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
		// type:'text',
		type:'image',
		// 信息是否被撤销
		isUndone: false,
		// 信息是否被删除
		isDel:false,
		// 标识消息发送时间  number | null 用于标识是否出现时间文本
		// message_time:1671783711881,
		message_time:Date.now()-10000,
		// 用于存储用户数据
		// data: '我是数据',
		data: '/static/images/nothing/no_pay.png',
		user_image:'/static/logo1.png',
		showTime: true
	},
	{
		id:'a6',
		// user_id标识是那个用户发送得信息，0为本人，其他为其他人
		user_id:0,
		// 消息类型，为text标识文本，为image标识为图片，为audio标识为录音，为video标识为视频
		// type:'text',
		type:'image',
		// 信息是否被撤销
		isUndone: false,
		// 信息是否被删除
		isDel:false,
		// 标识消息发送时间  number | null 用于标识是否出现时间文本
		// message_time:1671783711881,
		message_time:Date.now(),
		// 用于存储用户数据
		// data: '我是数据',
		data: '/static/images/nothing/no_pay.png',
		user_image:'/static/logo.png',
		showTime: true
	}
]