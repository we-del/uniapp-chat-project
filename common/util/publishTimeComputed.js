import dayjs from 'dayjs';

export function publishTimeConvert(time){
	let now = dayjs();
	let year = dayjs(now).diff(time,'year');
	let month = dayjs(now).diff(time,'month');
	let week = dayjs(now).diff(time,'week');
	let hour = dayjs(now).diff(time,'hour');
	let minute = dayjs(now).diff(time,'minute');
	let second = dayjs(now).diff(time,'second');
	
	if(year){
		return year+'年前';
	}else if(month){
		return month+'月前';
	}else if(week){
		return week+'星期前';
	}else if(hour){
		return hour+'小时前';
	}else if(minute){
		return minute+'分钟前';
	}else if(second){
		return second+'秒前';
	}
	
	return '传入的时间不正确';
}

// 对比目标时间到当前时间的天数差
export function timeToDay(time){
	let now = dayjs();
	let day = dayjs(now).diff(time,'day');
	return day
}

// 更具消息时间来返回对应字段
export function timeToConvert(time){
	let now = dayjs();
	let year = dayjs(now).diff(time,'year');
	let day = dayjs(now).diff(time,'day');
	if(year >=1) return dayjs(time).format('YY年MM月');
	else if(day == 1) return '昨天'
	else if(day == 2)return '前天'
	else if(day>2) return dayjs(time).format('MM-DD')
	else return dayjs(time).format('HH:mm') 
}