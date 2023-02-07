// request.js
const baseUrl = 'https://api.cms.clwy.cn'  
// const baseUrl = 'http://localhost:8082/chemApp'  
  //const baseUrl = '/chemApp'  
 //const baseUrl = '' 

 
const request = (options = {}) => {
	
	const header = {}
	
	const token = uni.getStorageSync("token")
	if(token){ 
		 header["token"] = token
	}

    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + options.url || '',
            method:options.type || 'GET' ,
            data: options.data || {},
            header,
        }).then((response) => {
                uni.hideLoading();
            let [error, res] = response;        
            resolve(res.data);
        }).catch(error => {
            let [err, res] = error;
            reject(err)
        })
    });
}
const get=(url,data,options={})=>{
    options.type='get';
    options.data = data;
    options.url = url;
    return request(options)
}
const post = (url, data, options = {}) => {
    options.type = 'post';
    options.data = data;
    options.url = url;
    return request(options)
}
const put = (url, data, options = {}) => {
    options.type = 'put';
    options.data = data;
    options.url = url;
    return request(options)
}
const destroy = (url, data, options = {}) => {
    options.type = 'delete';
    options.data = data;
    options.url = url;
    return request(options)
}

export default request;
export {
    get,
    post,
    put,
	destroy,
    baseUrl
}