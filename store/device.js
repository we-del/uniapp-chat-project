import {defineStore} from 'pinia';
import {ref,computed} from 'vue';
export const useDeviceStore = defineStore('device',()=>{
	function setDeivce(env){
			device.value = env;
		}
	const device = ref('');
	const statusBarHeight = ref(0);
	// px -> rpx 为2倍的差别
	const fixedTop = computed(()=>statusBarHeight.value*2);
	return {
		setDeivce,device,statusBarHeight,fixedTop
	};
});