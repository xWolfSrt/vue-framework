<template>
    <Navbar :title="'个人资料'" :canback="true" @navbarBack="navbarBack"></Navbar>
    <div class="personal-datails-container">
        <div style="width: 100%; height: 50px; flex-shrink: 0"></div>
        <div class="list" v-if="data.account">
            <div @click="showPicker()">
                <p>头像</p>
                <img class="photo" :src="data.account.photo || getAssetsFile('common/profile_photo.png')" />
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div @click="nickClick()">
                <p>名称</p>
                <p>{{ data.account.name || '未设置' }}</p>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div @click="sexClick()">
                <p>性别</p>
                <p>{{ data.account.sex || '未设置' }}</p>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="unable">
                <p>手机号码</p>
                <p>{{ data.account.mobile || '未设置' }}</p>
            </div>
            <div @click="qrcodeClick()">
                <p>我的二维码</p>
                <img class="qrcode" :src="getAssetsFile('mine/icon_qcode.png')" />
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'
import getAssetsFile from '../../utils/pub-use'
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

        div {
            border-bottom: 1px solid rgba(220, 220, 220, 0.4);
            height: 60px;
            line-height: 60px;
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
