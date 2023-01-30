export default {
    // 获取存储列表数据
    getStorage(key){
        let data = null;
		
        if(window){
            data = window.sessionStorage.getItem(key)
        } else {
            data = uni.getStorageSync(key)
        }
		if(typeof JSON.parse(data) === 'object'){
			data = typeof JSON.parse(data)
		}
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