<template>
	<view class="like">
		<view class="page_title" v-if="newReads.length === 0">
			暂无浏览
			<button class="go-home" @click="handleHome"> 回到首页 </button>
		</view>
		<view class="page_title" v-else>
			我的浏览 {{pagination.total}}
		</view>
		<view class="items">
			<view class="item" v-for="item in newReads" :key="item.id" @click="go_article(item.article.id)">
				<view class="info">
					<view class="title">
						{{item.article ? item.article.title : ""}}
					</view>
					<view class="body">
						<view class="left">
							<view class="name">{{item.article ? item.article.subTitle  : ""}}</view>
							<view class="line" />
							<view class="updata">{{item.article ? item.article.createdAt :"" | dayFormat }}</view>
						</view>
						<view class="right">
							<image src="/static/images/comments.png" mode="" />
							<view class="comment">{{item.article ? item.article.commentsCount :''}}</view>
						</view>
					</view>
				</view>
				<image class="thumb" :src="item.article ? item.article.image : '' " mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
import {get} from '../../../common/request'
import moment from 'moment';

export default {
		data() {
			return {
				reads: [],
        page: 1,
        pagination:{},
        newReads:[]
			}
		},
		onLoad() {
			this.init()
		},
    //下拉刷新
    onReachBottom(){
      this.page++
      this.init()
    },
  onPullDownRefresh(){
    this.page = 1
    this.newReads = []
    this.init()
    uni.stopPullDownRefresh()
  },
  methods: {
			 init() {
				 get(`/reads?currentPage=${this.page}`).then(res => {
           this.newReads = [...this.newReads, ...res.data.reads]
					 this.pagination = res.data.pagination
					if (res.code !== 20000) {
						uni.showToast({
							title: res.message,
							duration: 2000
						});
					}
				})
			},
			go_article(id) {
				uni.redirectTo({
					url: `/pages/articles/index/index?id=${id}`
				})
			},
			handleHome() {
				uni.switchTab({
					url: "/pages/home/index/index"
				})
			}
		},
		filters: {
			dayFormat(value) {
				moment.locale('zh-cn');
				return moment(value).startOf('day').fromNow()
			}
		}
	}
</script>

<style>
	.page_title {
		text-align: center;
		padding: 20rpx;
	}

	.like .page_title .go-home {
		margin-top: 50%;
		width: 50%;
	}

	.items {
		margin: 20rpx 40rpx 20rpx;
		padding-bottom: 6rpx;
		/* height: 160rpx; */
	}

	.item {
		display: flex;
		justify-content: space-between;
		border-bottom: 2rpx solid #aeaeae;
		padding-bottom: 20rpx;
		margin-bottom: 20rpx;
	}

	.info {
		width: 424rpx;
	}

	.thumb {
		/* flex: 1; */
		width: 220rpx;
		height: 144rpx;
		margin-left: 30rpx;
	}

	.body image {
		width: 32rpx;
		height: 30rpx;
	}

	.info .title {
		color: #333333;
		font-size: 30rpx;
		margin-bottom: 24rpx;
	}

	.body {
		font-size: 20rpx;
		color: #5e5e5e;
		display: flex;
		justify-content: space-between;
	}

	.body .left {
		display: flex;
		align-items: center;
	}

	.body .right {
		display: flex;
	}

	.left .line {
		width: 2rpx;
		height: 24rpx;
		background-color: #5e5e5e;
		margin: 0 10rpx;
	}

	.right {
		align-items: center;
	}

	.right .comment {
		margin-left: 10rpx;
	}
</style>
