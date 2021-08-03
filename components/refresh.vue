<template>
	<view class="refreshBox" :style="isTranform">
		<view class="refresh" :style="isZoom" :class="isEnd == 2 ? 'animationSmall' : ''">
			<view class="refreshWord" v-if="isEnd == 0">松开刷新</view>
			<view class="refreshCirle animation" v-if="isEnd == 1"></view>
			<image class="iconYes" src="../static/icon-yes.png" v-if="isEnd == 2"></image>
		</view>
	</view>
</template>

<script>
	let endTimer = '';
const util = require('../util/util.js');
export default {
	name: 'refresh',
	props: {
		needVibrate: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isTranf: 0,
			touchStart: '',
			touchMove: '',
			isEnd: 0,
			statusBarHeight: uni.getSystemInfoSync()['statusBarHeight']
		};
	},

	methods: {
		vibrate: util.throttle(function(e) {
			uni.vibrateShort({
				type: 'light'
			});
		}, 1000),
		refreshStart(e) {
			if (this.isEnd == 0) {
				this.touchStart = e.changedTouches[0].pageY;
			}
		},
		refreshMove(e) {
			if (this.isEnd == 0) {
				var touchStart = this.touchStart,
					oldMove = this.touchMove,
					newMove = e.changedTouches[0].pageY;
				if (touchStart <= newMove) {
					var isTranf = touchStart > newMove ? 0 : newMove - touchStart;
					if (isTranf > 120 && this.isTranf <= 120 && this.needVibrate) this.vibrate();
					this.isTranf = isTranf;
					this.touchMove = e.changedTouches[0].pageY;
				}
			} else {
				this.isTranf = 0;
				this.isEnd = 0;
				this.touchStart = 9999;
			}
		},
		refreshEnd(e) {
			var that = this;
			if (this.isEnd == 0) {
				if (this.isTranf >= 90) {
					this.isTranf = 125 + this.statusBarHeight;
					this.isEnd = 1;
					this.$emit('isRefresh');
				} else {
					this.isTranf = 0;
				}
			}
		},
		endAfter() {
			this.isEnd = 2;
			endTimer = setTimeout(() => {
				this.isTranf = 0;
				this.isEnd = 0;
			}, 600);
		},
		rightEnd() {
			clearTimeout(endTimer);
			endTimer = '';
			this.isEnd = 1;
			this.isTranf = 125 + this.statusBarHeight;
		}
	},
	computed: {
		isTranform() {
			let fastest = 150 + this.statusBarHeight;
			var isTranf = this.isTranf > fastest ? fastest : this.isTranf;
			var isTemp = `transform: translateY(${isTranf - 100}px);`;
			return isTemp;
		},
		isZoom() {
			var isTranf = this.isTranf > 125 ? 125 : this.isTranf;
			var isTemp = `transform: scale(${isTranf / 125});`;
			return isTemp;
		}
	}
};
</script>

<style lang="scss">
.refreshBox {
	margin: 0 auto;
	width: 100%;
	height: 100rpx;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	max-height: 300rpx;
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	transform: translateY(-100rpx);
}

.animationSmall {
	animation: small 1.1s both;
}

@keyframes small {
	0% {
		transform: scale(1);
	}
	20% {
		transform: scale(1.4);
	}
	100% {
		transform: scale(0);
	}
}
.refreshWord {
	width: 150rpx;
	height: 26rpx;
	font-size: 24rpx;
	line-height: 26rpx;
	text-align: center;
	border-radius: 26rpx;
}

.refresh {
	min-width: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50rpx;
	background: #ffffff;
	box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, 0.1);
	border-radius: 50rpx;
}

.refreshCirle {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	display: inline-block;
	position: relative;
	border: 6rpx solid black;
	border-bottom-color: transparent;
	border-top-color: transparent;
}

.animation {
	animation: rotate 1.1s infinite;
	animation-timing-function: cubic-bezier(0.3, 1.65, 0.7, -0.65);
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.true {
	color: black;
}

.iconYes {
	width: 34rpx;
	height: 34rpx;
}
</style>
