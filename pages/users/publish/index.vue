<template>
  <view class="box">
    <uni-forms :modelValue="formData" :rules="rules" ref="rules">
      <uni-forms-item label="选择分类" name="categoryId">
        <uni-data-select
            v-model="formData.categoryId"
            :localdata="categories"
            @change="change"
            placeholder="选择分类"
            v-if="categories.length > 0"
        ></uni-data-select>
      </uni-forms-item>
      <uni-forms-item label="标题" name="title">
        <uni-easyinput type="text" v-model="formData.title" placeholder="请输入标题"/>
      </uni-forms-item>
      <uni-forms-item label="内容" name="content">
        <uni-easyinput type="text" v-model="formData.content" placeholder="请输入内容"/>
      </uni-forms-item>
      <uni-forms-item label="子标题" name="subTitle">
        <uni-easyinput type="text" v-model="formData.subTitle" placeholder="请输入子标题"/>
      </uni-forms-item>
      <uni-forms-item label="描述" name="description">
        <uni-easyinput type="text" v-model="formData.description" placeholder="请输入描述信息"/>
      </uni-forms-item>
      <uni-forms-item label="选择图片" name="image">
        <uni-file-picker
            v-model="formData.image"
            file-mediatype="image"
            mode="grid"
            file-extname="png,jpg"
            :limit="1"
            @success="success"
            @select="select"
            @fail="fail"
        />
      </uni-forms-item>
    </uni-forms>
    <button @click="submitForm('rules')">{{ isEdit ? '更新' : '发布' }}</button>
  </view>
</template>
<script>
import {get, post,put} from "../../../common/request";
import {v4 as uuidv4} from 'uuid'

export default {
  data() {
    return {
      formData: {
        title: "",
        content: "",
        categoryId: "",
        subTitle: "",
        description: "",
        image: [],
        range: {},
      },
      isEdit: false,
      categories: [],
      article:{},
      uploadToken: "",
      rules: {
        categoryId: {
          rules: [{
            required: true,
            errorMessage: '请选择一个分类',
          },
          ]
        },
        title: {
          rules: [{
            required: true,
            errorMessage: '请填写标题',
          }]
        },
        content: {
          rules: [{
            required: true,
            errorMessage: '请填写内容',
          }]
        },
        subTitle: {
          rules: [{
            required: true,
            errorMessage: '请填写子标题',
          }]
        },
        description: {
          rules: [{
            required: true,
            errorMessage: '请填描述信息',
          }]
        },
        image: {
          rules: [{
            required: true,
            errorMessage: '请选择一个图片',
          }]
        },
      }
    }
  },
  onLoad(options) {
    const isEdit = options.query
    const id = options.id
    if (isEdit){
      this.init(id)
    }
    this.fetchCategories()
  },
  methods: {
   async fetchCategories(){
     await get("/categories").then(res => {
       this.categories = res.data.categories.map(item => {
         return {
           value: item.id,
           text: item.name
         }
       })
     })
    },
    async init(id) {
      await get(`/articles/${id}`).then(res => {
        this.formData = res.data.article
        this.isEdit = true
        this.formData.image = [{
          "name": res.data.article.image,
          "extname": "jpg,png",
          "url": res.data.article.image
        }]
      })
    },
    //分类发生变化
    change() {
    },
    //提交表单
    submitForm(ref) {
      this.$refs[ref].validate().then(async res => {
        if (!this.isEdit) {
          await post("/articles", {
            title: res.title,
            content: res.content,
            categoryId: res.categoryId,
            subTitle: res.subTitle,
            description: res.description,
            image: res.image[0].url
          }).then(res => {
            uni.showModal({
              title: '提示',
              content: res.message,
              showCancel:false,
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
          })
        }else {
          await put(`/articles/${this.formData.id}`,{
            title: res.title,
            content: res.content,
            categoryId: res.categoryId,
            subTitle: res.subTitle,
            description: res.description,
            image: res.image[0].url
          }).then(res => {
            uni.showModal({
              title: '提示',
              content: res.message,
              showCancel:false,
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
          })
        }

      }).catch(err => {
        console.log('表单错误信息：', err);
      })
    },
    //上传
    async select(e) {
      await get("/uploads").then(res => {
        console.log(res)
        this.uploadToken = res.data.uploadToken
        const file = e.tempFilePaths[0]
        const ext = e.tempFiles[0].extname
        const key = `${uuidv4()}.${ext}`
        uni.uploadFile({
          url: 'http://upload.qiniup.com/', //仅为示例，非真实的接口地址
          filePath: file,
          name: 'file',
          formData: {
            token: this.uploadToken,
            key: key
          },
          success: (uploadFileRes) => {
            const data = JSON.parse(uploadFileRes.data)
            this.formData.image = [{
              "name": key,
              "extname": ext,
              "url": `http://oss.shop.clwy.cn/${data.key}`
            }]
          },
          fail: (res) => {
          }
        });
      })

    },
    //上传成功
    async success() {

    },
    //  上传失败
    fail() {
    }
  }
}
</script>

<style>
html {
  padding: 0;
  margin: 0;
}

.box {
  margin: 30rpx 30rpx;
}
</style>
