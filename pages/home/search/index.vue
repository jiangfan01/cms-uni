<template>
  <view class="like">
    <view class="page_title" v-if="articles.length === 0">
      无搜索结果
      <button class="go-home" @click="handleHome"> 回到首页 </button>
    </view>
    <view class="page_title" v-else>
      搜索结果 {{pagination.total}}
    </view>
    <view class="items">
      <view class="item" v-for="item in articles" :key="item.id" @click="go_article(item.article.id)">
        <view class="info">
          <view class="title">
            {{item.title }}
          </view>
          <view class="body">
            <view class="left">
              <view class="name">{{item.subTitle }}</view>
              <view class="line" />
              <view class="updata">{{item.createdAt  | dayFormat }}</view>
            </view>
            <view class="right">
              <image src="/static/images/comments.png" mode="" />
              <view class="comment">{{item.commentsCount }}</view>
            </view>
          </view>
        </view>
        <image class="thumb" :src="item.image " mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
import {
  get
} from '../../../common/request'
import moment from 'moment';
export default {
  data() {
    return {
      articles: [],
      pagination: {}
    }
  },
  onLoad(options) {
    const keyword = options.keyword
    this.init(keyword)
  },
  methods: {
    init(keyword) {
      get(`/articles/search?keyword=${keyword}`).then(res => {

        if (res.code !== 20000) {
          uni.showToast({
            title: res.message,
            duration: 2000
          });
          return
        }
        this.articles = res.data.articles
        this.pagination = res.data.pagination
        console.log(666,this.articles)
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
