<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import '@/common/free.css';
	@import '@/common/common.css';
	@import '@/common/free-icon.css';
	.uni-app--showtopwindow uni-page-head {
		display: none;
	}
	/*每个页面公共css */
</style>
