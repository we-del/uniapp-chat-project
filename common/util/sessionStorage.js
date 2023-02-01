export default {
    // 获取存储列表数据
    getStorage(key){
        let data = null;
		
        if(window){
            data = window.sessionStorage.getItem(key)
        } else {
            data = uni.getStorageSync(key)
        }
		try{
			// 如果是可以正常结构则说明是一个对象，如果不结构说明是一个字符串
			if(typeof JSON.parse(data) === 'object'){
				data =  JSON.parse(data)
			}
		}catch(e){} // 捕获异常
        return data
    },
    // 设置存储
    setStorage(key,data){
		if(typeof data === 'object') data = JSON.stringify(data)
        if(window){
            return window.sessionStorage.setItem(key,data)
        } else {
            return uni.setStorageSync(key,data)
        }
    },
    // 删除存储
    removeStorage(key){
        if(window){
            return window.sessionStorage.removeItem(key);
        } else {
            return uni.removeStorageSync(key)
        }
    },
	clearStorage(){
		if(window){
		    return window.sessionStorage.clear();
		} else {
		    return uni.clearStorageSync()
		}
	}
}