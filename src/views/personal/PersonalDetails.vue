<template>
    <Navbar :title="'个人资料'" :canback="true" @navbarBack="navbarBack"></Navbar>
    <div class="personal-datails-container">
        <div style="width: 100%; height: 50px; flex-shrink: 0"></div>
        <div class="list" v-if="data.account">
            <div class="item">
                <span>头像</span>
                <van-uploader preview-size="45" :max-count="1" :after-read="afterRead" accept="image/png, image/jpeg">
                    <img class="photo" :src="data.account.photo || getAssetsFile('common/profile_photo.png')" />
                </van-uploader>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="item" @click="nickClick">
                <span>名称</span>
                <span>{{ data.account.name || '未设置' }}</span>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="item" @click="sexClick">
                <span>性别</span>
                <span>{{ data.account.sex || '未设置' }}</span>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="item unable">
                <span>手机号码</span>
                <span>{{ data.account.mobile || '未设置' }}</span>
            </div>
            <div class="item" @click="qrcodeClick">
                <span>我的二维码</span>
                <img class="qrcode" :src="getAssetsFile('mine/icon_qcode.png')" />
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, toRaw } from 'vue'
import { Toast } from 'vant'
import Navbar from '../../components/Navbar.vue'
import getAssetsFile from '../../utils/pub-use'
import userService from '../../api/user'
import pictureService from '../../utils/picture-service'
import fileUpload from '../../utils/file/file-upload'
const { proxy } = getCurrentInstance()
const data = reactive({
    account: undefined,
})

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
    userService
        .complete(null, null, null, JSON.stringify(pictures))
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
    showLoading('头像修改中')
    fileUpload
        .cosUpload(file.file, options)
        .then((url) => {
            modifyPhoto(url)
        })
        .catch((err) => {
            console.log(err)
            submitError()
        })
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

            span:nth-of-type(1) {
                font-size: 16px;
                flex-grow: 1;
                text-align: left;
            }

            span:nth-of-type(2) {
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
