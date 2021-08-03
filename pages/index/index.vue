<template>
	<view class="container999" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
		<!-- 刷新组件需搭配scroll-view使用，并在pages.json中添加 "disableScroll":true-->
		<refresh ref="refresh" :needVibrate="true" @isRefresh="isRefresh"></refresh>
		<view class="nav">
			<view style="background: #fff;width: 100vw;"><view class="statu-space" :style="{ height: statusBarHeight + 'px' }"></view></view>
			<view class="navTopBox">
				头像大全
			</view>
			<!-- 导航栏 agents导航栏标题 -->
			<navTab v-if="tabTitle.length > 0" ref="navTab" style="margin-top: 20rpx;margin-bottom: 20rpx;" @toTop="toTop" :tabTitle="tabTitle" @changeTab="changeTab"></navTab>
		</view>
		<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
		<swiper style="min-height: 100vh;" :current="currentTab" @change="swiperTab">
			<swiper-item v-for="(listItem, listIndex) in list" :key="listIndex">
				<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="lower1" scroll-with-animation :scroll-into-view="toView">
					<view :id="'top' + listIndex" class="marginBox" style="height: 194rpx;">边距盒子</view>
					<view class="statu-space" :style="{ height: statusBarHeight + 'px' }"></view>
					<view class="content">
						<view class="rankLine" @click="toDetail(item)" hover-class="lineHover" v-if="listItem.length > 0" :key="index" v-for="(item, index) in listItem">
							<view class="lineTitle">{{item.title}}</view>
							<view class="lineImgBox">
								<image v-for="(imgItem,imgIndex) in item.imgUrl" :key="imgIndex" :class="'lineImg'+imgIndex" :src="imgItem"></image>
							</view>
						</view>
					</view>
					<view class="noCard" v-if="listItem.length === 0 && !hasLoad[listIndex]">待探索区域~</view>
					<view class="noCard" v-if="listItem.length === 0 && hasLoad[listIndex]">暂无信息</view>
					<view class="loadMoreBox" v-if="list[listIndex].length > 3">
						<loadMore @loadMore="lower1">
							<view class="loadMore">{{ noMore[listIndex] == 1 ? '到底啦，别再拉了～' : noMore[listIndex] == 0 ? '加载更多' : '加载中' }}</view>
						</loadMore>
					</view>
					<view style="width: 100%;height: calc(env(safe-area-inset-bottom) + 50px);opacity:0;">底部占位盒子</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<tabBottom></tabBottom>
	</view>
</template>

<script>
const util = require('../../util/util.js');
import refresh from '../../components/refresh.vue';
import navTab from '../../components/navTab.vue';
import tabBottom from '../../components/tabBottom.vue';
import loadMore from '../../components/loadMore.vue';
export default {
	components: { refresh, navTab, loadMore,tabBottom },
	data() {
		return {
			topIndex: 0,
			statusBarHeight: uni.getSystemInfoSync()['statusBarHeight'], // 顶部高度状态栏
			toView: '', //回到顶部id
			tabTitle: [], //导航栏格式 --导航栏组件
			currentTab: 0, //sweiper所在页
			pages: [], //第几个swiper的第几页
			list: [], //数据格式
			noMore: [],
			hasLoad:[]
		};
	},
	async onLoad(e) {
		this.getTitle().then(res => {
			this.initData();
			// this.$refs.navTab.longClick(3); //跳转某个tab
			this.getList();
		});
	},
	onShareTimeline() {
		return {
			title: '可可爱爱,奇奇怪怪~'
		};
	},
	onShareAppMessage(res) {
		return {
			title: '可可爱爱,奇奇怪怪~'
		};
	},
	onShow() {},
	onHide() {},
	methods: {
		  toDetail(item){
			  console.log('item',item);
			  uni.navigateTo({
			  	url:`../indexDetail/indexDetail?url=${item.url}`
			  })
		  },
		  randAllList(list){
			let tempList = JSON.parse(JSON.stringify(list));
		    var len = tempList.length;
		    for(var i=0;i<len;i++) {
		        var index = Math.floor(Math.random()*(len-i));
		        var tempItem = tempList[index];
		        tempList[index] = tempList[len-i-1];
		        tempList[len-i-1] = tempItem;
		    }
		    return tempList;
		  },
		async getAllList(index){
			let postData = {
				type:this.tabTitle[index]
			}
			this.$refs.refresh.rightEnd();
			// 本地开发
			let listRes = require('./protraitList.js').filter(item=>{
				return item['type'] === postData['type']
			});
			await new Promise(function(resolve) {
				setTimeout(resolve, 800)
			});
			this.allList[index] = this.randAllList(listRes);
			// 云函数开发
			
			// let listRes = await uniCloud.callFunction({
			// 		name: 'getList',
			// 		data: postData
			// 	})
			// console.log(`获取${this.tabTitle[index]}成功`,listRes.result)	
			// this.allList[index] = this.randAllList(listRes.result);
		},
		getTitle() {
			return new Promise((resolve, reject) => {
				this.tabTitle = ['头像','男头','女头','动漫头像','情头']
				resolve();
			});
		},
		initData() {
			let tempObj = {
				pages: 1,
				list: [],
				noMore: 0,
				allList:[],
				hasLoad:false
			};
			for (let key in tempObj) {
				this[key] = new Array(this.tabTitle.length).fill(tempObj[key]);
			}
		},
		toTop: util.throttle(function(e) {
			this.toView = '';
			setTimeout(() => {
				this.toView = 'top' + this.currentTab;
			}, 10);
		}, 500),
		changeTab(index) {
			this.currentTab = index;
			console.log('index', index);
		},
		// swiper 滑动
		swiperTab: function(e) {
			var index = e.detail.current; //获取索引
			this.$refs.navTab.longClick(index);
			if (this.list[index].length === 0) this.getList();
		},
		// 加载更多 util.throttle为防抖函数
		lower1: util.throttle(function(e) {
			this.getList('loadMore');
		}, 360),
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
		async getList(type = 'refresh') {
			let nowIndex = this.currentTab;
			if (type == 'refresh') {
				this.pages[nowIndex] = 1;
				this.noMore[nowIndex] = 0;
				this.allList[nowIndex] = [];
			}
			if (this.noMore[nowIndex] === 1 || this.noMore[nowIndex] === 2) return;
			if(this.allList[nowIndex].length === 0) await this.getAllList(nowIndex);
			this.noMore[nowIndex] = 2;
			this.$forceUpdate();
			let nowPageNum = this.pages[nowIndex];
			
			if(nowPageNum * 15 > this.allList[nowIndex].length) this.noMore[nowIndex] = 1;
			else this.noMore[nowIndex] = 0;
			this.list[nowIndex] = this.allList[nowIndex].slice(0,nowPageNum * 15);
			this.hasLoad[nowIndex] = true;
			this.pages[nowIndex]++;
			this.$forceUpdate(); //二维数组，开启强制渲染
			this.$refs.refresh.endAfter(); //刷新结束调用
		},
		isRefresh() {
			this.getList();
		}
	}
};
</script>

<style lang="scss">
	.rankLine {
		width: 90vw;
		margin: auto;
		padding: 20rpx;
		transition: 0.3s;
		color: #333;
		border-bottom: 1px solid #f2f3f4;
	}
	.lineImgBox{
		width: 100%;
		margin-top: 20rpx;
		display: flex;
		justify-content:space-between;
		align-items: center;
	}
	.lineImg0{
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}
	.lineImg2{
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	.lineImg0,.lineImg1,.lineImg2{
		overflow: hidden;
		width: 32%;
		height: 200rpx;
	}
	
.bottomHover {
	opacity: 0.8;
}
.topHover {
	opacity: 0.5;
}
.marginBox {
	width: 100%;
	opacity: 0;
}
.navTopChoose {
	font-size: 34rpx !important;
	font-weight: bold;
	color: black !important;
}
.navTopItem {
	transition: 0.3s;
	font-size: 30rpx;
	padding: 0 20rpx;
	color: #909499;
}
.navTopBox {
	font-size: 34rpx;
	font-weight: bold;
	border-bottom: 1px solid #f2f3f4;
	width: 92vw;
	margin: auto;
	line-height: 94rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 94rpx;
}
.loadMore {
	background-color: #ffffff;
	padding: 0 23rpx;
	position: relative;
	z-index: 11;
}
.loadMoreBox::before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 90vw;
	height: 2rpx;
	background-color: #d9d9d9;
	margin: auto;
}
.loadMoreBox {
	position: relative;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	font-size: 22rpx;
	color: #c3c3c3;
}
.rankItem {
	width: 20vw;
	text-align: center;
	font-size: 22rpx;
}
.lineHover {
	background-color: #f2f3f4 !important;
}

.container999 {
	width: 100vw;
	font-size: 28rpx;
	min-height: 100vh;
	overflow: hidden;
	color: #6b8082;
	position: relative;
	background-color: #ffffff;
}
.content {
	width: 100%;
}

.card {
	width: 90%;
	height: 368rpx;
	background-color: white;
	margin: 0 auto 42rpx auto;
	background: #ffffff;
	box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	position: relative;
}

.noCard {
	width: 90vw;
	height: 200rpx;
	margin: auto;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999;
}

.nav {
	position: fixed;
	left: 0;
	top: 0;
	color: #000000;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	font-size: 24rpx;
	background-color: #ffffff;
	z-index: 996;
}
</style>
