<template>
	<view class="navTabBox">
		<view class="longTab">
			<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" scroll-with-animation
			 :scroll-left="tabLeft[tabClick - 2]"
			 >
				<view hover-class="longHover" class="longItem" :class="index===tabClick?'click':''" v-for="(item,index) in tabTitle" :key="index" :id="'id'+index" @click="longClick(index)">{{item}}</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'navTab',
		props: {
			tabTitle: {
				type: Array,
				default: []
			}

		},
		data() {
			return {
				tabClick: 0, //导航栏被点击
				tabLeft:[]
			};
		},
		mounted() {
			this.initNav();
		},
		methods: {
			    initNav(){
			      if(this.tabTitle.length == 0) return;
					  const query = this.createSelectorQuery(this);
						query
							.selectAll('.longItem')
							.boundingClientRect(res=> {
								console.log('res',res);
			          let tabLeft = [];
			          for(let i = 0 ; i<res.length ; i++){
			              tabLeft.push(res[i]['left']);
			          }
						this.tabLeft = tabLeft;
							})
							.exec();
			    },
			// 导航栏点击
			longClick(index){
				if(this.tabClick == index) {
					this.$emit('toTop')
				}
				this.tabClick = index //设置导航点击了哪一个
				this.$emit('changeTab', index);//设置swiper的第几页
			}
		}
	}
</script>

<style lang="scss">
	.longHover{
		opacity: .8;
		transition: .3s;
	}
	.navTabBox {
		width: 100vw;
		color: rgba(255, 255, 255, 0.50);
		.click {
			color: #ffffff !important;
			background-color: #FF6E17 !important;
		}
		.longTab {
			width: 92vw;
			margin: auto;
			.longItem{
				min-width: 10vw;
				padding: 0 20rpx;
				background-color: #dddde1;
				color: #666666;
				height: 62rpx; 
				margin-right: 12rpx;
				font-size: 22rpx;
				display: inline-block;
				line-height: 62rpx;
				text-align: center;
			}
			.underlineBox {
				height: 3px;
				width: 20%;
				display: flex;
				align-content: center;
				justify-content: center;
				transition: .5s;
				.underline {
					width: 84rpx;
					height: 4px;
					background-color: white;
				}
			}
		}
	}
</style>
