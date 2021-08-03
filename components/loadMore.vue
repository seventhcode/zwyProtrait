<template>
	<view class="imgItem">
	  <slot></slot>
	</view>
</template>

<script>
	export default {
		name:"loadMre",
		data() {
			return {
				
			};
		},
		mounted() {
			    if (!this.createIntersectionObserver) {
			      return;
			    }
			    // 监听播放中视频是否划出可视区
			    this._observer = this.createIntersectionObserver({
			      thresholds: [0.2, 0.8]
			    }).relativeToViewport();
			    this._observer.observe('.imgItem', (res) => {
			      // 信息流曝光统计
			      if (res.intersectionRatio > 0.8) {
			        console.log('加载更多');
					this.$emit('loadMore');
			      }
			    })
		}
	}
</script>

<style>

</style>
