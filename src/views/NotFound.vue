<template>
    <div class="container">
        <img src="../assets/images/common/icon_data_empty.png" />
        <span>找不到页面了~</span>
        <div>
            <button class="confirm btn btn-lg btn-gradient btn-gradient-shadow" @click="back">返回上一页</button>
            <button class="confirm btn btn-lg btn-gradient-red btn-gradient-red-shadow" @click="confirm">回到首页</button>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const back = () => {
    proxy.$router.back()
}
const confirm = () => {
    proxy.$router.replace('/')
}
</script>
<style lang="scss" scoped>
.container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;

    img {
        width: 315px;
        height: 216px;
    }

    span {
        color: #616b7a;
        font-size: 15px;
        line-height: 24px;
        text-align: center;
        margin-top: 16px;
    }

    div {
        display: flex;
        align-items: center;
        margin-top: 32px;
        margin-bottom: 80px;
        width: 100%;

        button {
            flex: 1;
            text-align: center;
            color: white;
            border-radius: 4px;
            font-size: 15px;
            margin: 0 12px;

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

            &:nth-of-type(1) {
                margin-left: 24px;
            }
            &:nth-of-type(2) {
                margin-right: 24px;
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
            &.btn-gradient-red-shadow {
                box-shadow: 0px 8px 16px rgba(251, 66, 101, 0.2);
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

            &.btn-gradient-red {
                background: linear-gradient(90deg, rgba(251, 66, 101, 1) 0%, rgba(255, 120, 67, 1) 100%);
            }

            &.btn-gradient-red:active {
                background: linear-gradient(90deg, rgba(245, 55, 91, 1) 0%, rgba(248, 110, 55, 1) 100%);
            }
        }
    }
}
</style>
