<template>
	<view class="login" style="	background: url(../../../static/images/login_bk.png);
		background-size: contain;
		background-repeat: no-repeat;
		height: 1200rpx;">
		<view class="logo">
			Hello!
		</view>


		<!-- H5 -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="info">
			<form @submit="formSubmit" >
				<view class="account">
					<input name="username" v-model="username" type="text" placeholder="输入账号" placeholder-style="color:#a8b7bd">
					<input name="password" v-model="password" type="password" placeholder="输入密码" placeholder-style="color:#a8b7bd">
				</view>
				<view class="help">
					<text @click="handleClick" v-if="!signup">立即注册</text>
					<text @click="handleClick" v-else>立即登录</text>
					<text>忘记密码?</text>
				</view>
				<button form-type="submit" class="button">
					{{signup ? "注册" : "登录"}}
				</button>
			</form>
		</view>
		<!-- #endif -->


		<!-- 小程序平台 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="info">
			<view class="wechat" @click="login()">
				<text>微信登录</text>
				<image src="../../../static/images/wechat.png" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		get,
		post
	} from '../../../common/request'

	export default {
		data(){
			return{
				username:"",
				password:"",
				signup:false
			}
		},
		methods: {
			// 小程序登录
			login() {
				uni.login({
					success: function(e) {
						const code = e.code
						uni.showModal({
							title: '提示',
							content: '申请登录',
							success: function(res) {
								if (res.confirm) {
									post("/auth/wechat_login", {
										code
									}).then(async res => {
										uni.setStorageSync('token', res.data.token)
										const resp = await get("/users/me")
										uni.setStorageSync('userInfo', resp.data.user)
										uni.setStorageSync("hasUserInfo", true)
										uni.showToast({
											title: '登录成功',
											duration: 2000,
										});
										uni.redirectTo({
											url: "/pages/users/index/index"
										})
									})
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				})
			},
			//账号密码登录
			formSubmit(e){
				const data = e.detail.value
				if(this.signup){
					post("/auth/register",{username:data.username,password:data.password}).then(async res => {
						uni.setStorageSync("token",res.data.token)
						this.signup = false
						uni.showToast({
							title: res.massage,
							duration: 2000,
						});
						this.username = ""
						this.password = ""
					})
				}else{
					post("/auth/login",{username:data.username,password:data.password}).then(async res => {
						uni.setStorageSync("token",res.data.token)
						const resp = await get("/users/me")
						uni.setStorageSync("hasUserInfo", true)
						uni.setStorageSync("userInfo", resp.data.user)
						uni.switchTab({
							url: "/pages/users/index/index"
						})
					})
				}


			},
			handleClick(){
				this.signup = !this.signup
				this.username = ""
				this.password = ""
			},

		}
	}
</script>

<style>
	.login {
		background: url(../../../static/images/login_bk.png);
		background-size: contain;
		background-repeat: no-repeat;
		height: 1200rpx;
	}

	.logo {
		color: #2143af;
		font-size: 60rpx;
		font-weight: bold;
		text-align: center;
		padding-top: 220rpx;
	}

	.info {
		margin: 80rpx 90rpx;
	}

	.account input {
		border-bottom: 2rpx solid #cfcfcf;
		font-size: 28rpx;
		padding: 20rpx 10rpx;
		margin-bottom: 10rpx;
	}

	.help {
		display: flex;
		justify-content: space-between;
		color: #a3b0e2;
		font-size: 20rpx;
		margin-top: 20rpx;
	}

	.button {
		letter-spacing: 4rpx;
		margin-top: 40rpx;
		background-color: #a3b0e2;
		text-align: center;
		padding: 18rpx 0;
		color: white;
		font-weight: bold;
		font-size: 36rpx;
		border-radius: 60rpx;
	}

	.wechat image {
		width: 64rpx;
		height: 64rpx;
		margin-left: 40rpx;
	}

	.wechat {
		height: 100rpx;
		display: flex;
		align-items: center;
		font-size: 20rpx;
		color: #a3b0e2;
		margin-top: 40rpx;
	}
</style>
