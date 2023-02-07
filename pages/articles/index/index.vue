<template>
	<view class="article">
		<view class="title">
			{{article.title}}
		</view>
		<view class="content">
			<view class="top">
				<view class="left">
					<image :src="article.user.avatar" mode=""></image>
					<view class="name">{{article.user.username}}</view>
					<view class="date">{{article.createdAt | format}}</view>
				</view>
				<view class="right"  v-if="!liked">
					<image src="../../../static/images/plus.png" mode="" @click="handleCollect"></image>
					<text>收藏</text>
				</view>
				<view class="right"  v-else>
					<image src="../../../static/images/yes.png" mode="" @click="handleCollect" ></image>
					<text>取消收藏</text>
				</view>
			</view>
			<view class="info">
				<image
					:src="article.image"
					mode=""></image>
				<view class="text">
					{{article.content}}
				</view>
			</view>

			<!-- 评论区 -->
			<view class="comments">
				<view class="item" v-for="item in comments" :key="item.id">
					<view class="item_left">
						<view class="user">
							<image
								:src=item.user.avatar
								mode=""></image>
							<view class="name">{{item.user.username}}</view>
						</view>
						<view class="comment_info">
							{{item.content}}
						</view>
						<view class="post_address">
							<view class="post_ip">查询不到</view>
							<view class="line"></view>
							<view class="time">{{item.createdAt | dayFormat}}</view>
						</view>
					</view>
					<view class="item_right" @click="handleAgrees(item.id)">
						<image src="../../../static/images/praise.png" mode=""></image>
						<text>{{item.agreesCount}}</text>
					</view>
				</view>
			</view>

			<!-- 发表评论 -->
			<view class="post_comment" >
				<textarea name="" id="" cols="30" rows="10" placeholder="发表评论" v-model="content"></textarea>
				<view class="button" @click="handlePublished">提交评论</view>
			</view>
		</view>
	</view>
</template>

<script>
	import  request, {
		get, post
	} from '@/common/request.js'
	import moment from 'moment';
	export default {
		data() {
			return {
				article: {
					user: {}
				},
        content:"",
				comments:[],
				pagination:{},
				liked:false,

			}
		},
		filters: {
			format(value) {
				moment.locale('zh-cn');
				return moment(value).format('L');
			},
			dayFormat(value) {
				moment.locale('zh-cn');
				return moment(value).startOf('day').fromNow()
			}
		},
		onLoad(options) {
			const id = options.id
			this.init(id)
      this.fetchComments(id)
		},
		methods: {
			async init(id) {
				// 单条文章
				await get(`/articles/${id}`, {}).then(res => {
					this.article = res.data.article
					if (res.code !== 20000) {
						alert(res.message)
					}
				}).catch((err) => {
					console.log(err)
				})

				// 已收藏的文章
				await get(`/articles/${this.article.id}/liked `).then(res => {
					this.liked = res.data.liked
				})
			},
      // 查询当前评论
      async fetchComments(id){
        get(`/articles/${id}/comments`).then(res => {
          this.comments = res.data.comments
        })
      },
      //收藏
			handleCollect(){
				const token = uni.getStorageSync("token")
				if(!token){
					uni.showModal({
						title: '提示',
						content: '暂未登录',
						confirmText:"去登录",
						success: function (res) {
							if (res.confirm) {
								uni.switchTab({
									url:"/pages/users/index/index"
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return
				}
				this.liked = !this.liked
				post("/likes",{token:token,articleId:this.article.id}).then(res => {
					uni.showToast({
						title: res.message,
						duration: 2000
					});
				})
			},
      //发表评论
      handlePublished(){
        const token = uni.getStorageSync("token")
        const that = this
        if(!token){
          uni.showModal({
            title: '提示',
            content: '暂未登录',
            confirmText:"去登录",
            success: function (res) {
              if (res.confirm) {
                uni.switchTab({
                  url:"/pages/users/index/index"
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
          return
        }

        post("/comments",{articleId:this.article.id,content:this.content}).then(res => {
          uni.showToast({
            title: res.message,
            duration: 2000
          });
          that.fetchComments(this.article.id)
          this.content = ""
        })
      },
      handleAgrees(id){
        const token = uni.getStorageSync("token")
        const that = this
        if(!token){
          uni.showModal({
            title: '提示',
            content: '暂未登录',
            confirmText:"去登录",
            success: function (res) {
              if (res.confirm) {
                uni.switchTab({
                  url:"/pages/users/index/index"
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
          return
        }
        post("/agrees",{commentId:id}).then(res => {
          uni.showToast({
            title: res.message,
            duration: 2000
          });
          that.fetchComments(this.article.id)
        })

      }
		}
	}
</script>

<style>
	.article {
		padding: 20rpx 40rpx 40rpx;
		margin-top: 40rpx;
	}

	.title {
		font-size: 40rpx;
		margin-bottom: 50rpx;
	}

	.left image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}

	.right image {
		width: 20rpx;
		height: 20rpx;
	}

	.top {
		display: flex;
		padding: 10rpx;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
	}

	.left .name {
		margin-left: 16rpx;
		margin-right: 26rpx;
	}

	.left .date {
		color: #b3b3b3;
		font-size: 24rpx;
	}

	.right {
		border: 2rpx solid #b3b3b3;
		font-size: 24rpx;
		border-radius: 22rpx;
		padding: 2rpx 22rpx;
	}

	.info image {
		width: 100%;
		height: 350rpx;
		border-radius: 6rpx;
		font-size: 22rpx;
		margin-bottom: 30rpx;
	}

	.text p {
		margin-bottom: 20rpx;
	}

	.user image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}

	.item_right image {
		width: 34rpx;
		height: 34rpx;
	}

	.comments {
		margin-top: 80rpx;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #dfdfdf;
		padding-bottom: 30rpx;
		padding-top: 30rpx;
	}

	.item_left .user {
		display: flex;
		align-items: center;
	}

	.item_left .user .name {
		font-size: 32rpx;
		font-weight: bold;
		margin-left: 16rpx;
	}

	.item_left .comment_info {
		font-size: 28rpx;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
	}

	.item_left .post_address {
		display: flex;
		color: #8f8f8f;
		font-size: 22rpx;
		align-items: center;
	}

	.post_address .line {
		width: 2rpx;
		height: 20rpx;
		background-color: #8f8f8f;
		margin: 0 10rpx;
	}

	.item_right {
		margin-top: 80rpx;
		height: 60rpx;
		color: #8f8f8f;
		display: flex;
		align-items: flex-end;
		font-size: 22rpx;
	}

	.item_right image {
		margin-right: 10rpx;
	}

	.item_right text {
		display: block;
		line-height: 26rpx;
	}

	/* 提交评论 */
	.post_comment {
		margin-top: 200rpx;
	}

	.post_comment textarea {
		background-color: #f3f3f3;
		width: 100%;
		height: 250rpx;
		border-radius: 40rpx;
		box-sizing: border-box;
		padding: 30rpx 36rpx;
		font-size: 24rpx;
		margin-bottom: 30rpx;
	}

	.post_comment .button {
		/* margin-bottom: 40rpx; */
		background-color: #cc161a;
		border-radius: 18rpx;
		margin: 0 60rpx;
		color: white;
		padding: 14rpx 0;
		text-align: center;
	}
</style>
