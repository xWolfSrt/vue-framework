<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
onMounted(() => {
    proxy.$http
        .get('/api/cart1', {})
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
})
defineProps({
    msg: String,
})

const count = ref(0)
const phone = ref('')
const captcha = ref('')
const loadingCaptcha = ref(false)
const loadingLogin = ref(false)
</script>

<template>
    <div class="container">
        <img alt="Vue logo" src="@/assets/logo.png" />

        <van-cell-group inset>
            <van-field v-model="phone" placeholder="手机号" />
            <van-cell-group inset>
                <van-field v-model="captcha" center clearable placeholder="请输入短信验证码">
                    <template #button>
                        <van-button v-model="loadingCaptcha" size="small" type="primary" loading-text="重试">获取验证码</van-button>
                    </template>
                </van-field>
            </van-cell-group>
        </van-cell-group>

        <van-button v-model="loadingLogin" type="primary" loading-text="正在登录">登录</van-button>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;

    > img {
        margin-top: 60px;
        margin-bottom: 24px;
    }
}
</style>
