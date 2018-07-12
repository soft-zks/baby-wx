//时间格式化
function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D;
}

//上传文件  
function uploadFile(id,url, filePath, name, formData, cb) {
  console.log(id);
  wx.uploadFile({
    url:"https://localhost/user/updatePicture?userId="+id,
   //url: "http://192.168.1.118:9000/user/updatePicture?userId=" + id,
    filePath: filePath,
    name: name,
    header: {
      'content-type': 'multipart/form-data'
    }, // 设置请求的 header  
    formData: formData, // HTTP 请求中其他额外的 form data  
    success: function (res) {
      if (res.statusCode == 200 && !res.data.result_code) {
        return typeof cb == "function" && cb(res.data)
      } else {
        return typeof cb == "function" && cb(false)
      }
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}  

module.exports = {
  timestampToTime: timestampToTime,
  uploadFile: uploadFile
}