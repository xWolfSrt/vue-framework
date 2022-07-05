<template>
    <Navbar :title="'个人资料'" :canback="true" @navbarBack="navbarBack"></Navbar>
    <div class="personal-datails-container">
        <div style="width: 100%; height: 50px; flex-shrink: 0"></div>
        <div class="list" v-if="data.account">
            <div class="item">
                <p>头像</p>
                <van-uploader preview-size="45" :max-count="1" :after-read="afterRead">
                    <img class="photo" :src="data.account.photo || getAssetsFile('common/profile_photo.png')" />
                </van-uploader>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="item" @click="nickClick()">
                <p>名称</p>
                <p>{{ data.account.name || '未设置' }}</p>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="item" @click="sexClick()">
                <p>性别</p>
                <p>{{ data.account.sex || '未设置' }}</p>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="item unable">
                <p>手机号码</p>
                <p>{{ data.account.mobile || '未设置' }}</p>
            </div>
            <div class="item" @click="qrcodeClick()">
                <p>我的二维码</p>
                <img class="qrcode" :src="getAssetsFile('mine/icon_qcode.png')" />
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, toRaw } from 'vue'
import axios from 'axios'
import { Toast } from 'vant'
import Navbar from '../../components/Navbar.vue'
import getAssetsFile from '../../utils/pub-use'
import { complete } from '../../api/user'
import pictureService from '../../utils/picture-service'
import '../../assets/js/cos-auth.min.js'
const { proxy } = getCurrentInstance()
const data = reactive({
    account: undefined,
})
let isPickVideo = false

onMounted(() => {
    if (!proxy.$storage.get('currentAccount')) {
        history.back()
        return
    }
    data.account = proxy.$storage.get('currentAccount')

    console.log(data.account)
})
const navbarBack = () => {
    history.back()
}
const showPicker = () => {}
const nickClick = () => {
    proxy.$router.push(['/personal/nick'])
}
const sexClick = () => {
    proxy.$router.push(['/personal/sex'])
}
const qrcodeClick = () => {
    proxy.$router.push(['/personal/qrcode'])
}

const modifyPhoto = (picture) => {
    let photo = proxy.$storage.get('currentAccount').photoOriginal
    let pictures = (photo && JSON.parse(photo)) || []
    let header = pictureService.getPicture(photo) //获取头像
    if (!header) {
        //如果不存在。则添加，否则修改
        pictures.push({ Category: null, Index: 0, Items: [picture] })
    } else {
        pictures.forEach((item) => {
            if (!item.Category || item.Category == null) {
                item.Items = [picture]
            }
        })
    }
    complete(null, null, null, JSON.stringify(pictures))
        .then((result) => {
            if (!result) {
                submitError()
                return
            }
            data.account.photo = pictureService.compressPicture(picture, { width: 120 })
            data.account.photoOriginal = JSON.stringify(pictures)
            proxy.$storage.set('currentAccount', toRaw(data.account))
            submitSuccess()
        })
        .catch((err) => {
            submitError(err)
        })
}
const submitSuccess = () => {
    Toast('修改成功')
    hideLoading()
}
const submitError = (msg) => {
    Toast(msg || '修改失败')
    hideLoading()
}

const showLoading = (content) => {
    Toast.loading({
        duration: 0,
        message: content || '加载中...',
        forbidClick: true,
    })
}
const hideLoading = () => {
    Toast.clear()
}
const afterRead = (file) => {
    // 此时可以自行将文件上传至服务器
    console.log(file)

    let captcha = data.account.captcha
    let directory = 'release/upload/platform_member_user'
    let options = {
        server: 'cowx-gsdl-server',
        directory: `${directory}/${captcha}`,
    }
    let fileName = file.file.name
    let _options = {
        server: options.server,
        path: `${options.directory}/${fileName}`,
        fileName: fileName,
    }

    let formData = new FormData()
    formData.append('file', file.file)

    showLoading('头像修改中')
    cosFileAuth(_options, {
        success: (url, url2, name, headers) => {
            var SecurityToken = headers['x-cos-security-token']
            var auth = headers['Authorization']
            var xhr = new XMLHttpRequest()
            xhr.open('PUT', url, true)
            xhr.setRequestHeader('Authorization', auth)
            SecurityToken && xhr.setRequestHeader('x-cos-security-token', SecurityToken)
            xhr.upload.onprogress = function (e) {
                console.log('上传进度 ' + Math.round((e.loaded / e.total) * 10000) / 100 + '%')
            }
            xhr.onload = function () {
                if (/^2\d\d$/.test('' + xhr.status)) {
                    var ETag = xhr.getResponseHeader('etag')
                    console.log(url2)
                    modifyPhoto(url2)
                    // callback(null, {url: url, ETag: ETag});
                } else {
                    // callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
                    submitError()
                }
            }
            xhr.onerror = function () {
                // callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
                submitError()
            }
            xhr.send(file.file)

            // axios
            //     .put(url, formData, {
            //         headers: headers,
            //         transformRequest: [
            //             function (data, headers) {
            //                 // 对 data 进行任意转换处理
            //                 console.log(data)
            //                 console.log(headers)
            //                 headers['Content-Type'] = ''
            //                 headers['Accept'] = '*/*'
            //                 return data
            //             },
            //         ],
            //     })
            //     .then((result) => {
            //         console.log('cosFileAuth result', result)

            //         if (result && result.status === 200) {
            //             // vm.callback.progress.call(vm.scope, 100)
            //             // vm.callback.success.call(vm.scope, url2, name)
            //             console.log(url2)
            //             console.log(name)
            //         } else {
            //             // vm.callback.progress.call(vm.scope, 0)
            //             // vm.callback.fail.call(vm.scope, `选择${vm.isPickVideo ? '视频' : '图片'}失败`)
            //         }
            //     })
            //     .catch((err) => {
            //         console.log('cosFileAuth err', err)
            //     })

            // vm.uploader.setOptions({
            //     url: url,
            //     method: 'PUT',
            //     headers: headers,
            //     disableMultipart: true, //关键属性，否则上传完的图片无法读取，禁止切分，默认是false
            //     // autoUpload: true,
            //     removeAfterUpload: true,
            //     itemAlias: 'file',
            //     allowedFileType: ['image'],
            // })
            // fileItem.onSuccess = function (response: string, status: number, headers: ParsedResponseHeaders) {
            //     console.log('ng2FileUpload onSuccess response', response)
            //     console.log('ng2FileUpload onSuccess status', status)
            //     console.log('ng2FileUpload onSuccess headers', headers)
            //     // 上传文件成功
            //     if (status === 200) {
            //         console.log(response) // 上传文件后获取服务器返回的数据

            //         vm.callback.progress.call(vm.scope, 100)
            //         vm.callback.success.call(vm.scope, url2, name)
            //     } else {
            //         vm.callback.progress.call(vm.scope, 0)
            //         vm.callback.fail.call(vm.scope, `选择${vm.isPickVideo ? '视频' : '图片'}失败`)
            //     }
            // }
            // fileItem.onProgress = function (progress: number) {
            //     console.log('ng2FileUpload onProgress progress', progress)
            //     //上传成功回调后，再置为100%
            //     if (progress >= 99) progress = 99
            //     vm.callback.progress.call(vm.scope, progress)
            // }
            // fileItem.onError = function (response: string, status: number, headers: ParsedResponseHeaders) {
            //     console.log('ng2FileUpload onError response', response)
            //     console.log('ng2FileUpload onError status', status)
            //     console.log('ng2FileUpload onError headers', headers)
            //     vm.callback.progress.call(vm.scope, 0)
            //     vm.callback.fail.call(vm.scope, `选择${vm.isPickVideo ? '视频' : '图片'}失败`)
            // }
            // console.log(`选择${isPickVideo ? '视频' : '图片'}失败`)
        },
        fail: (msg) => {
            // vm.callback.fail.call(vm.scope, msg)
            submitError()
        },
    })
}
const cosFileAuth = (_options, callback = { success: (url, url2, name, headers) => {}, fail: (msg) => {} }) => {
    // let directory = `${this.options.directory || this.globalService.getGuid}`
    // // let fileType: string = fileUrl.substring(fileUrl.lastIndexOf('.') + 1, fileUrl.length)
    // //获得文件扩展名,有时后缀会带有?1234566
    // let patternFileExtension = /\.([0-9a-zA-Z]+)(?:[\?#]|$)/i
    // let fileExtension = fileUrl.match(patternFileExtension)
    // let fileType = (fileExtension && fileExtension.length > 1 && fileExtension[1]) || 'jpg'

    // let fileName = `${this.options.name || this.globalService.getGuid()}.${fileType}`
    // let _options = {
    //     server: this.options.server,
    //     path: `${directory}/${fileName}`,
    // }
    console.log(_options)
    getAuthorization(
        _options,
        (authData) => {
            // let headers = [
            //     {
            //         name: 'Authorization',
            //         value: authData.authorization,
            //     },
            //     { name: 'x-cos-security-token', value: authData.xCosSecurityToken },
            //     { name: 'Content-Type', value: 'multipart/form-data' },
            // ]
            let headers = {
                Authorization: authData.authorization,
                'x-cos-security-token': authData.xCosSecurityToken,
            }
            let url = authData.prefix + camSafeUrlEncode(_options.path).replace(/%2F/g, '/')
            let url2 = authData.domain ? authData.domain + '/' + camSafeUrlEncode(_options.path).replace(/%2F/g, '/') : url
            callback.success(url, url2, _options.fileName, headers)
        },
        (error) => {
            callback.fail(`选择${isPickVideo ? '视频' : '图片'}失败`)
        }
    )
}

// 签名
const getAuthorization = (options, callback, errback) => {
    getTmpCredential(
        options.server,
        (res) => {
            // let prefix = `https://${environment.cos.domain}/`
            let prefix = `https://${res.bucket}.cos.${res.region}.myqcloud.com/`
            let authorization = window.CosAuth({
                SecretId: res.credentials.tmpSecretId,
                SecretKey: res.credentials.tmpSecretKey,
                Method: 'PUT',
                Pathname: '/' + options.path,
            })
            let authData = {
                xCosSecurityToken: res.credentials.token, // token
                authorization: authorization, // 签名
                prefix: prefix, // 客户端不保存上传路径内的桶名称和区域名称，需要通过回调获得
                domain: res.domain,
            }
            console.log('获取签名成功')
            console.log(authData)
            callback(authData)
        },
        (err) => {
            console.log('获取签名失败')
            console.log(err)
            errback(err)
        }
    )
}

// 获取临时密钥
const getTmpCredential = (server, callback, errback) => {
    let url = `https://release.gsdl.top/gateway/api/tencent/cos/getCredential?server=${server}`
    axios
        .get(url, {
            timeout: 1000,
        })
        .then((res) => {
            console.log('getTmpCredential res', res)
            if (res.data.success && res.data.result) {
                console.log('获取临时密钥成功')
                console.log(res.data.result)
                callback(res.data.result)
            } else {
                console.log('获取临时密钥失败')
                console.log(res)
                errback('获取临时密钥出错')
            }
        })
        .catch((err) => {
            console.log('getTmpCredential err', err)
            console.log('获取临时密钥失败')
            console.log(err)
            errback(err)
        })
}

// url转换
const camSafeUrlEncode = (str) => {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
}
</script>
<style lang="scss" scoped>
.personal-datails-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .list {
        background-color: white;
        margin: 12px 0;
        display: flex;
        flex-direction: column;

        .item {
            border-bottom: 1px solid rgba(220, 220, 220, 0.4);
            height: 60px;
            padding-right: 16px;
            margin-left: 16px;
            border-radius: 0;
            font-size: unset;
            background-color: transparent;
            display: flex;
            flex-direction: row;
            align-items: center;

            &::after {
                border: none;
            }

            &:active {
                background-color: #f9f9f9;
            }
            &:last-child {
                border-bottom: 0;
            }
            &.unable:active {
                background-color: transparent;
            }

            p:nth-of-type(1) {
                font-size: 16px;
                flex-grow: 1;
                text-align: left;
            }

            p:nth-of-type(2) {
                font-size: 16px;
                flex-grow: 1;
                color: #bdbdbd;
                text-align: right;
                margin-right: 8px;
            }

            .photo {
                flex-shrink: 0;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                margin-right: 8px;
                object-fit: cover;
            }

            .qrcode {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }

            .arrow {
                flex-shrink: 0;
                width: 14px;
                height: 14px;
            }
        }
    }
}
</style>
