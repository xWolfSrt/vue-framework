<template>
    <div class="container">
        <div class="title-text">
            <img src="../assets/images/icon_logo_2.png" />
        </div>
        <div class="input-content">
            <label class="phone form-group" :class="mobileFocus ? 'focus' : ''" for="phone">
                <input
                    v-model="phone"
                    id="phone"
                    type="tel"
                    oninput="if(value.length>11)value=value.slice(0,11)"
                    placeholder="请输入手机号码"
                    v-on:focus="focusInput('mobile', true)"
                    v-on:blur="focusInput('mobile', false)"
                />
            </label>
            <label class="captcha form-group" :class="captchaFocus ? 'focus' : ''" for="captcha">
                <input
                    v-model="captcha"
                    id="captcha"
                    type="tel"
                    oninput="if(value.length>4)value=value.slice(0,4)"
                    placeholder="请输入验证码"
                    v-on:focus="focusInput('captcha', true)"
                    v-on:blur="focusInput('captcha', false)"
                />
                <div></div>

                <div class="captcha-btn" @click.prevent="getCaptcha()">
                    <span v-show="!captchaConfig.counting">获取验证码</span>
                    <div v-show="captchaConfig.counting">
                        重发(<van-count-down
                            ref="countDown"
                            millisecond
                            :time="60000"
                            :auto-start="false"
                            format="ss"
                            @finish="onCountDownFinish"
                        />s)
                    </div>
                </div>
            </label>
        </div>
        <div class="tips">
            <span>未注册的手机号码验证后自动注册</span>
            <!-- <span (click)="switchMode()">{{ isAccountMode ? '手机号码登录' : '账号密码登录' }}</span> -->
        </div>
        <button class="next btn btn-lg btn-gradient" @click="login()">登录 / 注册</button>
        <div class="agreement-block"></div>
        <div class="agreement">
            <!-- <img (click)="agreementClick()" [src]="isAgree ? spa('common/icon_check_on.png') : spa('common/icon_check_off.png')" /> -->
            <p>
                <span @click="agreementClick()">登录注册表示同意</span>
                <span @click="userAgreementClick()">用户服务协议</span>
                <span>、</span>
                <span @click="privacyPolicyClick()">隐私政策</span>
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { Toast } from 'vant'
import { sendCaptcha, validateCaptcha, registerOrLogin, getAccountSummary, convertAccount } from '../api/user'

const { proxy } = getCurrentInstance()

let hideBack = false
let is401 = false
let toHome = false
defineProps({})
onMounted(() => {
    console.log(proxy)
    console.log(proxy.$router.currentRoute)
    console.log(proxy.$router.currentRoute.value.query)
    try {
        let params = proxy.$router.currentRoute.value.query
        if (params.needBack == 'false') hideBack = true
        if (params.is401 == 'true') is401 = true
        if (params.toHome == 'true') toHome = true
    } catch (error) {
        console.log(error)
    }
})
const phone = ref('')
const captcha = ref('')
const captchaConfig = reactive({
    sending: false,
    counting: false,
    disabled: false,
})

const mobileFocus = ref(false)
const captchaFocus = ref(false)
const countDown = ref(null)

function focusInput(type, focus) {
    if (type == 'mobile') mobileFocus.value = focus
    else captchaFocus.value = focus
    console.log('focusInput')
}

function getCaptcha() {
    if (captchaConfig.sending || captchaConfig.counting) return
    if (!phone.value) {
        Toast('手机号码不能为空')
        return
    }

    if (!/^1\d{10}$/.test(phone.value)) {
        Toast('请输入11位的手机号码')
        return
    }
    showLoading('正在发送...')
    captchaConfig.sending = true

    sendCaptcha(phone.value)
        .then((result) => {
            console.log(result)
            switch (result.status) {
                case 200:
                    sendCaptchaSuccess()
                    break
                default:
                    captchaConfig.sending = false
                    registerError('验证码发送失败')
                    break
            }
        })
        .catch((err) => {
            console.log(err)
            captchaConfig.sending = false
            registerError()
        })
}
function sendCaptchaSuccess() {
    hideLoading()
    Toast('验证码已发送')
    captchaConfig.sending = false
    countDownStart()
}
function countDownStart() {
    captchaConfig.counting = true
    countDown.value.reset()
    countDown.value.start()
}
function onCountDownFinish() {
    captchaConfig.counting = false
    countDown.value.pause()
}
function login() {
    if (!phone.value) {
        Toast('手机号码不能为空')
        return
    }
    if (!/^1\d{10}$/.test(phone.value)) {
        Toast('请输入11位的手机号码')
        return
    }
    if (!captcha.value) {
        Toast('请输入验证码')
        return
    }
    if (!/^1\d{10}$/.test(phone.value)) {
        Toast('请输入11位的手机号码')
        return
    }
    showLoading('正在登录')
    validateCaptcha(phone.value, captcha.value)
        .then((result) => {
            console.log(result)

            if (result) {
                console.log('验证成功', result)
                phoneRegisterOrLogin()
            } else {
                hideLoading()
                Toast('验证码不正确或已过期')
            }
        })
        .catch(({ msg, code }) => {
            console.log(msg)
            registerError(msg)
        })
}
function phoneRegisterOrLogin() {
    registerOrLogin(phone.value, captcha.value)
        .then((result) => {
            console.log(result)
            // let token = result
            // proxy.$storage.set('token', token)
            proxy.$storage.set('lastLoginPhone', phone.value)
            getAccount()
        })
        .catch((err) => {
            console.log(err)
            registerError()
        })
}
function getAccount() {
    getAccountSummary()
        .then((result) => {
            if (result) {
                let account = convertAccount(result)
                proxy.$storage.set('currentAccount', account)
                registerSuccess()
            } else {
                registerError()
            }
        })
        .catch((err) => {
            console.log(err)
            registerError()
        })
}
function registerSuccess() {
    hideLoading()
    Toast('登录成功')

    setTimeout(() => {
        proxy.$storage.set('needRefreshHome', true)
        if (is401 || !toHome) {
            proxy.$router.back()
        } else {
            proxy.$router.replace('/home')
        }
    }, 300)
}
function registerError(msg) {
    setTimeout(() => {
        hideLoading()
        Toast(msg || '登录失败')
    }, 300)
}
function showLoading(content) {
    Toast.loading({
        duration: 0,
        message: content || '加载中...',
        forbidClick: true,
    })
}
function hideLoading() {
    Toast.clear()
}
</script>
<style lang="scss" scoped>
.container {
    background: white;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title-text {
        flex-shrink: 0;
        margin: 64px 0 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        > img:nth-of-type(1) {
            width: 158px;
            height: auto;
        }
    }

    .input-content {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .form-group {
            flex-shrink: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid #e8e8e8;
            width: 82%;
            max-width: 480px;
            position: relative;
        }
        .form-group.focus {
            border-bottom: 1px solid #22ccf2;
        }
        .form-group > img {
            width: 14px;
            height: auto;
            margin: 0 16px;
        }

        .form-group > input {
            flex: 1;
            font-size: 16px;
            font-weight: 400;
            color: #383838;
            border: none;
        }

        input {
            height: 54px;
            outline: none;
            background: transparent;
            border: none;
            outline: medium;
        }

        *:focus {
            outline: none;
            background-color: transparent;
        }

        ::selection {
            background: transparent;
        }

        ::-moz-selection {
            background: transparent;
        }

        ::-webkit-input-placeholder {
            /* WebKit, Blink, Edge */
            color: #dfdfdf;
            font-size: 16px;
        }
        :-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            color: #dfdfdf;
            font-size: 16px;
        }
        ::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            color: #dfdfdf;
            font-size: 16px;
        }
        :-ms-input-placeholder {
            /* Internet Explorer 10-11 */
            color: #dfdfdf;
            font-size: 16px;
        }
        .captcha {
            margin-top: 14px;

            > div:nth-of-type(1) {
                flex-shrink: 0;
                width: 1px;
                height: 16px;
                background: #e2e2e2;
                margin-right: 6px;
            }

            .captcha-btn {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 54px;
                width: 100px;

                span {
                    font-size: 14px;
                    line-height: 54px;
                    color: #ff6d1d;
                }

                div {
                    color: #cfcfcf;
                    display: inline-block;
                }
            }
        }
        .password {
            margin-top: 14px;
        }
    }

    > p:nth-of-type(1) {
        flex-shrink: 0;
        font-size: 16px;
        color: #4464ff;
        margin: 16px 0 30px 0;
        text-align: center;
    }

    .tips {
        width: 82%;
        max-width: 480px;
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 8px;

        span:nth-of-type(1) {
            flex-shrink: 0;
            font-size: 12px;
            color: #979797;
        }

        span:nth-of-type(2) {
            padding: 8px 0;
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: #5075ff;
        }
    }
    .next {
        flex-shrink: 0;
        width: 82%;
        max-width: 480px;
        margin-top: 36px;
        border-radius: 48px;

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

        &::after {
            border: none;
        }

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
        &.btn-gradient-shadow-bottom {
            // box-shadow: 0px -5px 16px rgba(251, 66, 101, 0.3);
            box-shadow: 0px -5px 16px rgba(109, 202, 109, 0.2);
        }

        &.btn-gradient {
            background: linear-gradient(90deg, #3fbf3f, #6dca6d);
        }

        &.btn-gradient:active {
            background: linear-gradient(90deg, #3dc43d, #6fd46f);
        }
    }

    .agreement-block {
        flex: 1;
        width: 100%;
        background: white;
    }
    .agreement {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        // align-items: center;
        box-sizing: border-box;
        padding: 0 9% 24px;
        background: white;

        img {
            width: 16px;
            height: 16px;
            padding: 10px 8px;
            margin-right: 6px;
        }
        p {
            padding-top: 6px;
        }
        span:nth-of-type(1) {
            font-size: 12px;
            color: #262626;
            margin-right: 2px;
        }
        span:nth-of-type(2) {
            font-size: 12px;
            color: #4683ff;
        }
        span:nth-of-type(3) {
            font-size: 12px;
            color: #262626;
            margin: 0 2px;
        }
        span:nth-of-type(4) {
            font-size: 12px;
            color: #4683ff;
        }
    }

    .agreement-huawei {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        // align-items: center;
        box-sizing: border-box;
        padding: 0 7% 0.24rem;
        background: white;

        img {
            width: 0.16rem;
            height: 0.16rem;
            padding: 0.1rem 0.08rem;
            margin-right: 0.06rem;
        }
        p {
            padding-top: 0.06rem;
        }
        span:nth-of-type(1) {
            font-size: 0.12rem;
            color: #262626;
            margin-right: 0.02rem;
        }
        span:nth-of-type(2) {
            font-size: 0.12rem;
            color: #4683ff;
        }
        span:nth-of-type(3) {
            font-size: 0.12rem;
            color: #262626;
            margin: 0 0.02rem;
        }
        span:nth-of-type(4) {
            font-size: 0.12rem;
            color: #4683ff;
        }
    }
    // .agreement {
    //     flex-shrink: 0;
    //     display: flex;
    //     flex-direction: row;
    //     align-items: center;
    //     justify-content: center;
    //     margin-top: 0.18rem;
    // }

    // .agreement > span {
    //     font-size: 0.13rem;
    // }

    // .agreement > span:nth-of-type(1) {
    //     color: #979797;
    // }

    // .agreement > span:nth-of-type(2) {
    //     margin-left: 0.06rem;
    //     color: #2d81ff;
    // }
}
</style>
