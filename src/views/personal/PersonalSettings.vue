<template>
    <Navbar :title="'我的设置'" :canback="true" @navbarBack="navbarBack"></Navbar>
    <div class="personal-settings-container">
        <div style="width: 100%; height: 50px; flex-shrink: 0"></div>
        <div class="list">
            <!-- <div (click)="opinion()">
            <p>意见反馈</p>
            <p></p>
            <img class="arrow" [src]="spa('common/icon_next.png')" />
        </div> -->
            <div>
                <p>联系客服</p>
                <a :href="contactPhone ? 'tel:' + contactPhone : ''">{{ contactPhone || '' }}</a>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div class="unable">
                <p>当前版本</p>
                <p>{{ appVersionName || '1.0.0' }}</p>
            </div>

            <div @click="userAgreementClick()">
                <p>用户服务协议</p>
                <p></p>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
            <div @click="privacyPolicyClick()">
                <p>隐私政策</p>
                <p></p>
                <img class="arrow" :src="getAssetsFile('common/icon_next.png')" />
            </div>
        </div>

        <button v-if="isCurrentLogin" class="confirm btn btn-lg btn-circle btn-gradient btn-gradient-shadow" @click="loginOut()">
            退出登录
        </button>
    </div>
    <WebViewDialog ref="webview"></WebViewDialog>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { Toast } from 'vant'
import Navbar from '../../components/Navbar.vue'
import WebViewDialog from '../../components/WebViewDialog.vue'
import getAssetsFile from '../../utils/pub-use'
import config from '../../config'
import { logout } from '../../api/user'
const { proxy } = getCurrentInstance()

const appVersionName = ref('')
const contactPhone = ref(config.contactPhone)
const isCurrentLogin = ref(false)
let webviewDialog
onMounted(() => {
    isCurrentLogin.value = proxy.$storage.get('currentAccount') != null

    console.log(proxy.$refs)
    webviewDialog = proxy.$refs.webview
})
const navbarBack = () => {
    history.back()
}

const userAgreementClick = () => {
    let userAgreement = 'https://cos.gsdl.top/release/resource/gsdl_user_agreement.htm'
    webviewDialog.show(`${userAgreement}?t=${new Date().getTime()}`, '用户服务协议')
}
const privacyPolicyClick = () => {
    let privacyPolicy = 'https://cos.gsdl.top/release/resource/gsdl_privacy_policy.htm'
    webviewDialog.show(`${privacyPolicy}?t=${new Date().getTime()}`, '赣商动力隐私政策')
}
const loginOut = () => {
    showLoading('正在注销')
    logout()
        .then((result) => {
            if (!result) {
                Toast('注销失败')
                hideLoading()
                return
            }
            Toast('已退出登录')
            confirmLoginOut()
            setTimeout(() => {
                navbarBack()
                hideLoading()
            }, 500)
        })
        .catch((err) => {
            Toast(error || '退出登录失败')
            hideLoading()
        })
}
const confirmLoginOut = () => {
    //清除登录信息
    proxy.$storage.remove('token')
    proxy.$storage.remove('currentAccount')
    //刷新首页应用
    proxy.$storage.set('needRefreshHome', true)
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
</script>
<style lang="scss" scoped>
.personal-settings-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 26px;
    box-sizing: border-box;
    background: white;

    .list {
        background-color: white;
        margin: 12px 0 0;
        display: flex;
        flex-direction: column;

        div {
            border-bottom: 1px solid rgba(220, 220, 220, 0.4);
            height: 60px;
            line-height: 60px;
            background-color: transparent;
            display: flex;
            flex-direction: row;
            align-items: center;

            &::after {
                border: none;
            }
            // &:last-child {
            //     border-bottom: 0;
            // }
            &.unable:active {
                background-color: transparent;
            }
            p:nth-child(1) {
                font-size: 16px;
                flex-grow: 1;
                text-align: left;
            }

            p:nth-child(2),
            a {
                font-size: 16px;
                flex-grow: 1;
                color: #bdbdbd;
                text-align: right;
                margin-right: 8px;
            }

            a {
                text-decoration: none;
            }

            img {
                flex-shrink: 0;
                width: 14px;
                height: 14px;
            }
        }
    }
    .confirm {
        flex-shrink: 0;
        margin-top: 24px;
        border-radius: 4px;

        position: relative;
        line-height: normal;
        border: none;
        outline: 0;
        color: #fff;
        background: 0 0;
        box-shadow: none;
        text-align: center;
        -webkit-appearance: none;
        white-space: nowrap;
        box-sizing: border-box;

        &.btn-lg {
            font-size: 16px;
            height: 45px;
            line-height: 45px;
        }

        &.btn-circle {
            border-radius: 100px;
        }

        &.btn:disabled {
            opacity: 0.4;
        }

        /* 不适用于底部按钮 */
        &.btn-gradient-shadow {
            // box-shadow: 0px 8px 16px rgba(236, 71, 86, 0.3);
            box-shadow: 0px 8px 16px rgba(109, 202, 109, 0.2);
        }

        &.btn-gradient {
            background: linear-gradient(90deg, #3fbf3f, #6dca6d);
        }

        &.btn-gradient:active {
            background: linear-gradient(90deg, #3dc43d, #6fd46f);
        }
    }
}
</style>
