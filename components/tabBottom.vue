<template>
	<view class="tab-bar tab-bar1">
	  <view class="tab-bar-border"></view>
	  <view v-for="(item,index) in tabBar" :key="index" class="tab-bar-item" @click="navTo(item)">
	    <view style="position: relative;" :class="{'bottomLine':item.pagePath == currentPage}">
	      {{item.text}}</view>
	  </view>
	</view>
</template>

<script>
	export default {
		props:{

		},
		data() {
			return {
				currentPage:'',
				tabBar:[
					{
						"pagePath": "pages/index/index",
						"text": "头像大全",
						"iconPath": "../static/index_change.png",
						"selectedIconPath": "../static/index.png"
					},
					// {
					// 	"pagePath": "pages/mine/mine",
					// 	"text": "个人中心",
					// 	"iconPath": "../static/index_change.png",
					// 	"selectedIconPath": "../static/index.png"
					// }
				]
			};
		},
		created() {
			uni.hideTabBar({});
			      let pages = getCurrentPages() //获取加载的页面
			      let currentPage = pages[pages.length - 1] //获取当前页面的对象
			      let url = currentPage.route //当前页面url
				  this.currentPage = url;
				  console.log('url',url);
		},
		computed:{
			
		},
		methods:{
			navTo(item){
				if(item.pagePath !== this.currentPage){
					uni.switchTab({
						url: `/${item.pagePath}`
					})
				} else{
					this.$parent.toTop();
				}
			}
		}
	}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  box-sizing: content-box;
  height: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  /* height: 48px; */
  background: transparent;
  display: flex;
  padding-bottom: calc(env(safe-area-inset-bottom));
  padding-top: 2px;
  z-index: 45;
}
.tab-bar1{
  background:#fff;
}

.tab-bar-border {
  background-color: #D9D9D9;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-item {
	color: #7f8389af;
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  position: relative;
  flex-direction: column;
}
.redCircle{
  position: absolute;
  right: -20rpx;
  top: -10rpx;
  width: 10rpx;
  height: 10rpx;
  background-color: red;
  border-radius: 50%;
}

.tab-bar-item view {
  font-size: 30rpx;
}

.bottomLine{
  color: #FF6E17;
}
.bottomLine::before{
  position: absolute;
  content: '';
  bottom: -10px;
  width: 100%;
  height: 3px;
  background-color: #FF6E17;
}
</style>
