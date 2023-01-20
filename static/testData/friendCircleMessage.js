
export default [
	// 每一个对象就是一条消息
	{
		id:Math.random()*2000, // 随机id，用于即使测试
		user_img:'/static/logo.png', // 用户图片
		user_name:'光顾', // 用户名称
		content:'很舒服啊', // 发布内容
		image_list:['/static/images/bg.jpg','/static/images/friendCircleBg.png'], // 发布的图片，可以为空
		// publish_time: Date.now()-(Math.floor(Math.random()*99999)*1000*60), // 消息发布使用
		publish_time: Date.now()-(Math.floor(Math.random()*10000)), // 消息发布使用
		like_list:['001','1'], // 存储每个回复用户的id，通过id查找对应的name值
		reply_list:[
			{
			id:'1',
			name:'喜欢',
			having_reply_obj:'',
			reply_content:'出去玩啊'
			},
			{
			id:2,
			name:'星晴',
			having_reply_obj:'1',
			reply_content:'可以啊，我找你'
			},
		
		]
		
	},
	{
		id:Math.random()*2000, // 随机id，用于即使测试
		user_img:'/static/logo1.png', // 用户图片
		user_name:'欢迎', // 用户名称
		content:'期待你的加入', // 发布内容
		image_list:['/static/images/bg.jpg'], // 发布的图片，可以为空
		publish_time: Date.now()-(Math.floor(Math.random()*99999)*1000*60), // 消息发布使用
		like_list:['001'], // 存储每个回复用户的id，通过id查找对应的name值
		reply_list:[]
		
	},
	{
		id:Math.random()*2000, // 随机id，用于即使测试
		user_img:'/static/logo.png', // 用户图片
		user_name:'今天，昨天，明天', // 用户名称
		content:'希望未来可以更好', // 发布内容
		image_list:['/static/images/friendCircleBg.png'], // 发布的图片，可以为空
		publish_time: Date.now()-(Math.floor(Math.random()*99999)*1000), // 消息发布使用
		like_list:['001','1'], // 存储每个回复用户的id，通过id查找对应的name值
		reply_list:[
			{
			id:'1',
			name:'喜欢',
			having_reply_obj:'',
			reply_content:'好啊，我可以'
			}
		
		]
		
	},
	{
		id:Math.random()*2000, // 随机id，用于即使测试
		user_img:'/static/logo1.png', // 用户图片
		user_name:'期初', // 用户名称
		content:'这是我的第一条朋友圈，请多关照', // 发布内容
		image_list:[], // 发布的图片，可以为空
		publish_time: Date.now()-(Math.floor(Math.random()*99999)*100000*60), // 消息发布使用
		like_list:[], // 存储每个回复用户的id，通过id查找对应的name值
		reply_list:[]
		
	},
	{
		id:Math.random()*2000, // 随机id，用于即使测试
		user_img:'/static/logo.png', // 用户图片
		user_name:'VvZ', // 用户名称
		content:'怎么没人找我玩，我好无聊', // 发布内容
		image_list:[], // 发布的图片，可以为空
		publish_time: Date.now()-(Math.floor(Math.random()*99999)*1000*60), // 消息发布使用
		like_list:[], // 存储每个回复用户的id，通过id查找对应的name值
		reply_list:[
			{
			id:'1',
			name:'星晴',
			having_reply_obj:'',
			reply_content:'我去找你，你等我'
			}
		
		]
		
	},
];