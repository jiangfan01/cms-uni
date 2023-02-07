<template>
	<view class="comment">
		<view class="title" v-if="comments.length === 0">
			暂无评论 快去发表
			<button class="go-home" @click="handleHome"> 回到首页 </button>
		</view>
		<view class="title" v-else>
			我的评论 {{pagination.total}}
		</view>

		<view class="content">
			<!-- 评论内容 -->
			<view class="item" v-for="item in comments" :key="item.id">
				<view class="avatar">
					<image :src="item.user.avatar" mode=""></image>
				</view>
				<view class="info">
					<view class="name">{{item.user.username}}</view>
					<view class="address">
						<view class="ip">暂无ip</view>
						<view class="date">{{item.createdAt | format}}</view>
					</view>
					<view class="history_comment">
						{{item.article ?  item.article.title : ""}}
					</view>
					<navigator class="article" url="../../articles/index/index" open-type="redirect">
						<view class="origial">{{item.content}}</view>
						<image src="../../../static/images/arrow-right.png" mode=""></image>
					</navigator>
				</view>
				<view class="handle">
					<view class="like">
						<image src="../../../static/images/praise.png" mode=""></image>
						<text>{{item.agreesCount}}</text>
					</view>
					<view class="delete" @click="handleDelete(item.id)">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get,
		destroy
	} from '../../../common/request'
	import moment from 'moment';
	export default {
		data() {
			return {
				comments: [],
				pagination: {}
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init() {
				const token = uni.getStorageSync("token")
				if (!token) {
					uni.showModal({
						title: '提示',
						content: '暂未登录',
						confirmText: "去登录",
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: "/pages/users/index/index"
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return
				}
				await get("/comments").then(res => {
					this.comments = res.data.comments
          console.log(222,res.data.comments)
					this.pagination = res.data.pagination
					if (res.code !== 20000) {
						uni.showToast({
							title: res.message,
							duration: 2000
						});
					}
				})
			},

			// 删除评论
			handleDelete(id) {
				const that = this
				uni.showModal({
					title: '提示',
					content: '确认删除该条评论？',
					success: function(res) {
						if (res.confirm) {
							destroy(`/comments/${id}`).then(res => {
								uni.showToast({
									title: res.message,
									duration: 2000
								});
								that.init()
							})
							return
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			handleHome() {
				uni.switchTab({
					url:"/pages/home/index/index"
				})
			}
		},
		filters: {
			format(value) {
				moment.locale('zh-cn');
				return moment(value).startOf('day').fromNow()
			}
		},
	}
</script>

<style>
	.title {
		text-align: center;
		padding: 20rpx;
	}

	.comment .title .go-home {
		margin-top: 50%;
		width: 50%;
	}

	.item {
		padding: 40rpx;
		display: flex;
		font-size: 20rpx;
		color: #b4b4b4;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.avatar image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.article image {
		width: 20rpx;
		height: 22rpx;
	}

	.handle image {
		width: 32rpx;
		height: 30rpx;
	}

	.info {
		width: 520rpx;
	}

	.name {
		color: #2e2d2d;
		margin-bottom: 10rpx;
	}

	.address {
		display: flex;
		margin-bottom: 10rpx;
	}

	.address .ip {
		margin-right: 30rpx;
	}

	.history_comment {
		color: #2e2d2d;
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 14rpx;
	}

	.article {
		background-color: #f5f5f5;
		padding: 14rpx 114rpx 14rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.article .origial {
		width: 340rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.handle {
		margin-top: 10rpx;
	}

	.handle .like {
		display: flex;
	}

	.like image {
		margin-right: 10rpx;
	}

	.delete {
		text-align: center;
		margin-top: 20rpx;
	}
</style>
