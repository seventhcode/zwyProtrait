<template>
	<view class="zwyListBox" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
	  <refresh ref="refresh" :needVibrate="true" @isRefresh="isRefresh"></refresh>
	  <view style="width:100vw;height:100vh;">
	    <scroll-view  style="height: 100%;" :scroll-y="true" @scrolltolower="lower1" scroll-with-animation :scroll-into-view="toView">
	      <slot name="before"></slot>
	      <slot></slot>
	      <view class="loadMoreBox" v-if="listLength > 8">
		  <loadMore @loadMore="lower1">
	        <view class="loadMore">{{noMore == 1 ? '到底啦，别再拉了～' : (noMore == 0 ?'加载更多':'加载中')}}</view>
		  </loadMore>
	      </view>
	      <slot name="after"></slot>
	      </scroll-view>
	  </view>
	</view>
</template>

<script>
	import loadMore from './loadMore.vue';
	const util = require('../util/util.js');
	import refresh from './refresh.vue';
	export default {
		components:{refresh,loadMore},
		name:"zwyList",
		data() {
			return {
				
			};
		},
		props: {
			listLength: {
				type: Number,
				default: 0
			},
			noMore: {
				type: Number,
				default: -1
			}
		
		},
		methods:{
			    // 加载更多 util.throttle为防抖函数
			  lower1: util.throttle(function(e) {
				  console.log('this.noMore',this.noMore);
			    if(this.noMore == 0) this.$emit('loadMore')
			  }, 360),
			  endAfter(){
			    this.$refs.refresh.endAfter();
			  },
			  rightEnd(){
				this.$refs.refresh.rightEnd();
			  },
			      // 刷新touch监听
			  refreshStart(e) {
			    this.$refs.refresh.refreshStart(e);
			  },
			  refreshMove(e) {
			    this.$refs.refresh.refreshMove(e);
			  },
			  refreshEnd(e) {
			    this.$refs.refresh.refreshEnd(e);
			  },
			  isRefresh() {
			    this.$emit('refresh');
			  }
		}
	}
</script>

<style>
.zwyListBox {
  width: 100vw;
  font-size: 28rpx;
  min-height: 100vh;
  overflow: hidden;
  color: #6B8082;
  position: relative;
  background-color: #FFFFFF;
}

.loadMore{
  background-color: #FFFFFF;
  padding: 0 23rpx;
  position: relative;
  z-index: 11;
}
.loadMoreBox::before{
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 90vw;
  height: 2rpx;
  background-color: #D9D9D9;
  margin: auto;
}
.loadMoreBox{
  position: relative;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
  font-size: 22rpx;
  color: #C3C3C3;
}
</style>
