<template>
  <view class="like">
    <view class="page_title" v-if="articles.length === 0">
      暂无发布
      <button class="go-home" @click="handleHome"> 回到首页 </button>
    </view>
    <view class="page_title" v-else>
      我的发布 {{pagination.total}}
    </view>
    <view class="items">
      <view class="item" v-for="item in articles" :key="item.id" >
        <view class="info" @click="go_article(item.id)">
          <view class="title">
            {{item.title}}
          </view>
          <view class="body">
            <view class="left">
              <view class="name">{{item.subTitle}}</view>
              <view class="line" />
              <view class="updata">{{item.createdAt | dayFormat }}</view>
            </view>
            <view class="right">
              <image src="/static/images/comments.png" mode="" />
              <view class="comment">{{item.commentsCount}}</view>
            </view>
          </view>
        </view>
        <image class="thumb" :src="item.image" mode=""></image>
        <view class="operate">
          <view class="edit" @click="handleEdit(item.id,isEdit)">
            编辑
          </view>
          <view class="delete" @click="handleDelete(item.id)">
           删除
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import {
  destroy,
  get
} from '../../../common/request'
import moment from 'moment';
export default {
  data() {
    return {
      articles: [],
      pagination: {},
      isEdit:true
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    async init() {
      await get("/articles").then(res => {
        console.log(12333,res)
        this.articles = res.data.articles
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
    },
    handleEdit(id,data){
      uni.navigateTo({
        url: `/pages/users/publish/index?id=${id}&query=${data}`
      });
      console.log(111)

    },
     handleDelete(id){
      const that = this
      uni.showModal({
        title: '提示',
        content: '确认删除？',
        success: function (res) {
          if (res.confirm) {
             destroy(`/articles/${id}`).then(res => {
               uni.showToast({
                 title: res.message,
                 duration: 2000
               });
               that.init()
             })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });

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
  justify-content: center;
  border-bottom: 2rpx solid #aeaeae;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}

.info {
  flex: 2;
}

.thumb {
   flex: 1;
  width: 220rpx;
  height: 144rpx;
  margin-left: 30rpx;
}
.operate{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.operate .edit{
  border: 1rpx solid rgba(146, 146, 146, 0.5);
  padding: 5rpx 30rpx;
  margin-bottom: 5px;
  border-radius: 7rpx;
}
.operate .delete{
  border: 1rpx solid rgba(146, 146, 146, 0.5);
  padding: 5rpx 30rpx;
  border-radius:7rpx;
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
