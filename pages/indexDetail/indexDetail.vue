<template>
	<zwyList ref="zwyList" @refresh="getList('refresh')" :noMore="noMore" :listLength="listLength" @loadMore="getList">
		<navTop title="头像详情"></navTop>
		<view class="imgContent">
			<view v-for="(item,index) in list" :key="index" @click="showImg(item)" class="imgBox">
				<image lazy-load class="isImg" :src="item"></image>
			</view>
			<view v-if="list.length % 3 === 2" class="imgBox"></view>
		</view>
	</zwyList>
</template>

<script>
	import navTop from '../../components/navTop.vue';
	import zwyList from '../../components/zwyList.vue'
	export default {
		components:{navTop,zwyList},
		data() {
			return {
				option:{},
				list:[],
				noMore:-1
			}
		},
		onShareTimeline() {
			return {
				title: '可可爱爱,奇奇怪怪~'
			};
		},
		computed:{
			listLength(){
				return this.list.length
			}
		},
		onShareAppMessage(res) {
			return {
				title: '可可爱爱,奇奇怪怪~'
			};
		},
		methods: {
			showImg(item){
				    wx.previewImage({
				      urls: this.allList,
				      current:item
				    })
			},
			async getAllList(){
				
				let postData = {
					url:this.option.url
				}
				
				// 本地开发
				let listRes = require('./prortraitDetail.js').filter(item=>{
					return item['url'] === postData['url']
				});
				console.log('listRes',listRes);
				await new Promise(function(resolve) {
					setTimeout(resolve, 800)
				});
				this.allList = listRes[0].imgUrl;
				
				// let listRes = await uniCloud.callFunction({
				// 		name: 'getDetail',
				// 		data: postData
				// 	})
				// 	console.log('listRes',listRes);
				// 	this.allList = listRes.result[0].imgUrl;
			},
			async getList(type){
				if(type == 'refresh') {
					this.allList = [];
					this.pages = 1;
					this.noMore = 0;
				}
				if(this.noMore === 1 || this.noMore === 2) return;
				this.noMore = 2;
				if(this.allList.length == 0) await this.getAllList();
				
				let nowPageNum = this.pages;
				
				if(nowPageNum * 20 > this.allList.length) this.noMore = 1;
				else this.noMore = 0;
				this.list = this.allList.slice(0,nowPageNum * 20);
				this.pages++;
				this.$refs.zwyList.endAfter(); //刷新结束调用
			}
		},
		onLoad(option) {
			console.log('option',option);
			// 兼容转发url被转义问题
			if(option && option.url && option.url.indexOf('%2Fp%2F') != -1) option.url = option.url.replace('%2Fp%2F','/p/');
			this.option = option;
			this.$refs.zwyList.rightEnd();
			this.getList('refresh');
		}
	}
</script>

<style>
	.imgBox{
		width: 200rpx;
		height: 200rpx;
		margin-top: 30rpx;
	}
	.imgContent{
		width: 90vw;
		margin: auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
.isImg{
	width: 200rpx;
	height: 200rpx;
}
</style>
