<template>
	<view class="home">
		<!-- 顶部 -->
		<view class="top">

			<view class="user">
				<image
					:src="avatar">
				</image>
				<view class="name" v-if="!username">暂未登录</view>
				<view class="name" v-else>
					{{username}}
				</view>
			</view>


			<view class="search">
				<input placeholder="大家都在搜" placeholder-style="color:#c0bfbf; font-size:20rpx" v-model="searchParams" />
				<view class="line" />
				<view class="button" @click="handleSearch">
					搜索
				</view>
			</view>
		</view>
		<!-- 导航 -->
		<view class="nav">
			<!-- <view class="nav_item">
				<view class="text">
					推荐
				</view>
				<view class="line"></view>
			</view> -->
			<view class="nav_item" v-for="(item,index) in categories" :key="item.id"
				@click="get_categories(item.id,index)">
				<view class="text" :class="{ select : activeIndex === index}">{{item.name}}</view>
				<view class="line" :class="{ active : activeIndex === index}" />
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="swiper">
			<uni-swiper-dot :info="info" :current="current" :mode="mode" :dotsStyles="dotStyle">
				<swiper class="swiper-box" @change="change" autoplay interval=3000 circular>
					<swiper-item v-for="item in info" :key="item.id">
						<view class="swiper-item">
							<image :src="item.image" style="width: 100%;" />
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<!-- 推荐资讯 -->
		<view class="recommend">
			<view class="item" v-for="item in articles" :key="item.id" @click="go_article(item.id)">
				<view class="info">
					<view class="title">
						{{item.title}}
					</view>
					<view class="body">
						<view class="left">
							<view class="name">{{item.user.username}}</view>
							<view class="line" />
							<view class="updata">{{item.updatedAt | format }}</view>
						</view>
						<view class="right">
							<image src="/static/images/comments.png" mode="" />
							<view class="comment">{{item.commentsCount}}</view>
						</view>
					</view>
				</view>
				<image class="thumb"
					src="https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/6acec660-4f31-11eb-a16f-5b3e54966275.jpg"
					mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
  import request,{get,post} from "../../../common/request";
	import moment from 'moment';

	export default {
		data() {
			return {
				info: [],
				articles: [],
				pagination: {},
        total:"",
        currentPage:"",
        pageSize:"",
				dotStyle: {
					backgroundColor: 'rgba(150, 183, 218, .85)',
					border: '1px rgba(150, 183, 218, .85) solid',
					color: '#fff',
					selectedBackgroundColor: 'rgba(255, 255, 255, 1)',
					selectedBorder: '1px #ffffff solid'
				},
				current: 0,
				mode: 'round',
				categories: [],
				activeIndex: 0,
				avatar:"",
				username:"",
        searchParams:""
			}
		},
		onLoad() {
			this.init()
		},
    onShow(){
        const userInfo = uni.getStorageSync("userInfo")
        if (!userInfo){
          this.avatar = ""
          this.username = ""
        }else {
          this.avatar = userInfo.avatar
          this.username = userInfo.username
        }
    },
    //下拉刷新
    onReachBottom(){
      console.log(555,this.pagination)
    },
		filters: {
			format(value) {
				moment.locale('zh-cn');
				return moment(value).startOf('day').fromNow()
			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
			async init() {
        const that = this
				// 轮播图
				await get("/ads/slides", {}).then(res => {
						this.info = res.data.ads
						if (res.code !== 20000) {
							alert(res.message)
						}
					}).catch((err) => {
						console.log(err)
					}),

					// 推荐
				await get("/articles/recommends", {}).then(res => {
						this.articles = res.data.articles
            this.pageSize = res.pagination.pageSize
            this.total = res.pagination.total
            this.currentPage = res.pagination.currentPage
						if (res.code !== 20000) {
							alert(res.message)
						}
					}).catch((err) => {
						console.log(err)
					})

				// 分类
				await get("/categories", {}).then( res => {
						const categories = res.data.categories.map(item => {
							name: item.name
						})
						res.data.categories.unshift({
							name: "推荐",
							id: 999
						})
						this.categories = res.data.categories
						if (res.code !== 20000) {
							alert(res.message)
						}
				})

			},
			// 分类模块
			get_categories(id,index) {
				this.activeIndex = index
				if(id !== 999){
					get(`/categories/${id}`, {}).then(res => {
						this.articles = res.data.articles
					})
				}else{
					get("/articles/recommends", {}).then(res => {
						this.articles = res.data.articles
						if (res.code !== 20000) {
							alert(res.message)
						}
					}).catch((err) => {
						console.log(err)
					})
				}
			},
			go_article(id){
        const token = uni.getStorageSync("token")
        post("/reads",{token:token,articleId:id}).then(res => {
          uni.navigateTo({
            url:`/pages/articles/index/index?id=${id}`
          })
        })
			},
      //搜索
      handleSearch(){
        uni.navigateTo({
          url:`/pages/home/search/index?keyword=${this.searchParams}`
        })
        this.searchParams = ""
      }
		}
	}
</script>

<style>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 40rpx;
	}

	.top image {
		width: 55rpx;
		height: 55rpx;
		border-radius: 50%;
	}

	.user {
		display: flex;
		align-items: center;
	}

	.user .name {
		color: #000000;
		font-size: 16rpx;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}

	.search {
		display: flex;
		background: #f2f2f2;
		border-radius: 40rpx;
		padding: 6rpx 24rpx;
		align-items: center;
		margin-top: 10rpx;
	}

	.search input {
		width: 360rpx;
		font-size: 16rpx;
	}

	.search .button {
		font-size: 16rpx;
		color: #5c5c5c;
		padding-left: 10rpx;
	}

	.search .line {
		width: 2rpx;
		height: 18rpx;
		background-color: #5c5c5c;
		margin-right: 4rpx;
	}

	.nav {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 40rpx;
		font-size: 24rpx;
		letter-spacing: 2rpx;
	}

	.nav_item {
		flex-direction: column;
		justify-content: center;
	}

	.nav_item .select {
		color: #ed4040;
	}

	.nav_item .text {
		margin-bottom: 4rpx;
	}

	.nav_item .line {
		width: 24rpx;
		height: 4rpx;
		margin: 0 auto;
	}

	.nav_item .active {
		background-color: #ed4040;
	}

	.swiper-box {
		height: 350rpx;
	}

	/*推荐*/
	.recommend {
		margin: 40rpx 40rpx 20rpx;
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
		width: 400rpx;
		height: 140rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
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
		width: 100%;
		color: #333333;
		font-size: 30rpx;
		/* margin-bottom: 54rpx; */
	}

	.body {
		width: 100%;
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
