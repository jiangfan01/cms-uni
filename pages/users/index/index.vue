<template>
	<view class="user">
		<!-- 顶部 -->
		<view class="top">
			<view class="user_info">
				<view class="sigin" v-if="token ===  '' " @click="go_login">登录</view>
				<view class="user_avatar" v-else>
					<image :src="avatar"></image>
					<button class="chooseAvatar" @click="updateImg">选择头像</button>
				</view>
			</view>
		</view>

		<!-- 卡片 -->
		<view class="card">
			<view class="item" @click="handlePublish">
				<image src="../../../static/images/post.png" mode=""></image>
				<view class="text">发布新闻</view>
			</view>
			<view class="item" @click="handleComment">
				<image src="../../../static/images/comment.png" mode=""></image>
				<view class="text">我的评论</view>
			</view>
			<view class="item" @click="handleCollect">
				<image src="../../../static/images/like.png" mode=""></image>
				<view class="text">我的收藏</view>
			</view>
		</view>

		<!-- 服务 -->
		<view class="serve">
			<view class="item" @click="handleSeen">
				<view class="text">浏览历史</view>
				<image src="../../../static/images/arrow-right.png" mode=""></image>
			</view>
      <view class="item">
        <view class="text" @click="handleArticles">我的发布</view>
        <image src="../../../static/images/arrow-right.png" mode=""></image>
      </view>
			<view class="item">
				<view class="text" @click="handleConnect">联系客服</view>
				<image src="../../../static/images/arrow-right.png" mode=""></image>
			</view>
      <view class="item" @click="handleExit">
        <view class="text">退出登录</view>
        <image src="../../../static/images/arrow-right.png" mode=""></image>
      </view>
		</view>
	</view>
</template>

<script>
import {get, put} from '../../../common/request'

export default {
		data() {
			return {
				token: "",
				has_avatar: false,
				uploadToken: "",
				avatar:""
			}
		},
		onShow() {
			const hasUserInfo = uni.getStorageSync("hasUserInfo")
			if(hasUserInfo){
				this.init()
			}
			this.fetchSgin()
		},
		methods: {
			go_login() {
				uni.navigateTo({
					url: "/pages/auth/login/index"
				})
			},
			// 小程序
			init() {
				const token = uni.getStorageSync("token")
				const userInfo = uni.getStorageSync("userInfo")
				this.token = token
				this.avatar = userInfo.avatar
			},
			// 上传图片
			updateImg() {
				const uploadToken = get("/uploads", {}).then(res => {
					this.uploadToken = res.data.uploadToken
				})
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: 'http://upload.qiniup.com/', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								token: this.uploadToken
							},
							success: (uploadFileRes) => {
								const data = JSON.parse(uploadFileRes.data)
								const user_avatar = `http://oss.shop.clwy.cn/${data.key}`
								put('/users/me',{avatar:user_avatar}).then(res => {
									uni.showToast({
										title: res.message,
										duration: 3000
									});
									this.avatar = res.data.user.avatar
									this.has_avatar = true
									uni.setStorageSync("userInfo",res.data.user)
								})
							}
						});
					}
				});
			},
			// H5
			fetchSgin(){
				const userInfo = uni.getStorageSync("userInfo")
				this.avatar = userInfo.avatar
			},
			// 评论页面，如果没有登录就不跳转
			handleComment(){
				const token = uni.getStorageSync("token")
				if(!token){
					uni.showToast({
						title: '未登录无法查看',
						icon:"error",
						duration: 2000
					});
					return
				}
				uni.navigateTo({
					url:"/pages/users/comment/index"
				})
			},
			handleCollect(){
				const token = uni.getStorageSync("token")
				if(!token){
					uni.showToast({
						title: '未登录无法查看',
						icon:"error",
						duration: 2000
					});
					return
				}
				uni.navigateTo({
					url:"/pages/users/like/index"
				})
			},
			handleSeen(){
				const token = uni.getStorageSync("token")
				if(!token){
					uni.showToast({
						title: '未登录无法查看',
						icon:"error",
						duration: 2000
					});
					return
				}
				uni.navigateTo({
					url:"/pages/users/seen/index"
				})
			},
      clearUserInfo(){
        const userInfo = uni.setStorageSync("userInfo", "")
        const clearToken = uni.setStorageSync("token","")
      },

      handlePublish(){
        const token = uni.getStorageSync("token")
        if(!token){
          uni.showToast({
            title: '未登录无法查看',
            icon:"error",
            duration: 2000
          });
          return
        }
        uni.navigateTo({
          url:"/pages/users/publish/index"
        })
      },
      handleArticles(){
        const token = uni.getStorageSync("token")
        if(!token){
          uni.showToast({
            title: '未登录无法查看',
            icon:"error",
            duration: 2000
          });
          return
        }
        uni.navigateTo({
          url:"/pages/articles/list/index"
        })
      },
      //退出登录
      handleExit(){
        const token = uni.getStorageSync("token")
        const clearToken = uni.setStorageSync("token","")
        const that = this
        if (!token){
          uni.showToast({
            title: '还没登录就想退？',
            duration: 2000,
            icon:"error"
          });
          return
        }
        uni.showModal({
          title: '提示',
          content: '确定退出？',
          success: function (res) {
            if (res.confirm) {
              that.clearUserInfo()
              uni.switchTab({
                url: '/pages/home/index/index'
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });

      },
      // 联系客服
      handleConnect(){
        uni.showModal({
          title: '电话',
          content: '17771513712',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
		},
	}
</script>

<style>
	.top {
		height: 510rpx;
		background: url(../../../static/images/bk.png);
		background-size: cover;
	}

	.user_info {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding-top: 150rpx;
	}

	.user_avatar {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.user_info image {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
	}

	.user_info .name {
		color: white;
		font-size: 35rpx;
		text-align: center;
	}

	.user_info .chooseAvatar {
		color: black;
		margin-top: 10px;
	}

	.user_info .sigin {
		color: white;
		width: 25%;
		display: flex;
		justify-content: center;
		font-size: 35rpx;
		padding: 10px 20px;
		background: rgba(40, 29, 100, .5);
		box-shadow: 1px 1px 15px 6px rgba(0, 0, 0, .5);
	}

	//卡片
	.card {
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		text-align: center;
		margin: -110rpx 34rpx 40rpx;
		padding: 70rpx 86rpx 76rpx 72rpx;
		border: 2rpx solid #f6f6f6;
		border-radius: 20rpx;
		font-size: 20rpx;
		color: #494949;
		box-shadow: 0 8rpx 12rpx #f2f2f2;
	}

	.card image {
		width: 100rpx;
		height: 100rpx;
	}

	//服务
	.serve image {
		width: 24rpx;
		height: 30rpx;
	}

	.serve .item {
		color: #666666;
		font-size: 22rpx;
		justify-content: space-between;
		display: flex;
		align-items: center;
		margin: 0 34rpx 26rpx;
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #f8f8f8;
	}
</style>
