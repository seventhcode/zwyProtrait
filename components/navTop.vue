<template>
	<view class="navBox" :style='"height:calc(94rpx + "+statusBarHeight+"px)"'>
		<view class="navTop">
			<view :style='"height:"+statusBarHeight+"px"'></view>
			<view class="navTitle">
				<view class="backBox" @click="isBack">
					<image src="https://res.qiguoread.com/staticResources/fellow_townsman/image/icon_nav_back.png" class="icon-back"></image>
				</view>
				{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"navTop",
		props: {
			title: {
				type: String,
				default: ''
			}
		
		},
		data() {
			return {
				 statusBarHeight: uni.getSystemInfoSync()['statusBarHeight'],
			};
		},
		methods:{
			isBack(){
				uni.navigateBack({
				    delta: 1,
				    fail: res => {
				        uni.switchTab({
				            url: '/pages/index/index'
				        });
				    }
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style>
	.navBox{
		position: relative;
	}
	.icon-back{
		width: 18rpx;
		    height: 32rpx;
		    margin-top: -5rpx;
		    display: inline-block;
		    vertical-align: middle;
	}
	.backBox{
		position: absolute;
		    left: 0;
		    top: 0;
		    width: 100rpx;
		    height: 94rpx;
		    line-height: 94rpx;
		    padding-left: 30rpx;
		    text-align: left;
	}
	.navTitle{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000;
		font-size: 36rpx;
		font-weight: bold;
		width:100vw;
		height:94rpx;
	}
	.navTop{
		  position: fixed;
		  top: 0;
		  left: 0;
		  z-index: 996;
		  width: 100vw;
		  background-color: white;
	}

</style>
