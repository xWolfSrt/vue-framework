<template>
    <div class="webview-dialog-mask" :class="{ show: isAnimShow }" v-if="isShow" @click="hide"></div>
    <div class="webview-dialog" :class="{ show: isAnimShow }" v-if="isShow">
        <div class="webview-dialog-head">
            <img class="webview-dialog-back" @click="hide" :src="getAssetsFile('icon_back.png')" />
            <span>{{ title }}</span>
            <!-- <img class="filter-close" [src]="spa('gszj/common/icon_close.png')" (click)="hideFilter" /> -->
        </div>
        <div class="webview-dialog-content" v-if="url">
            <iframe :src="url" frameborder="0" name="iframe" sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
        </div>
        <div class="webview-dialog-none" v-if="!url">
            <img :src="getAssetsFile('common/icon_data_empty.png')" />
            <span>这里没有内容</span>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, defineExpose } from 'vue'
import getAssetsFile from '../utils/pub-use'
const { proxy } = getCurrentInstance()
const isAnimShow = ref(false)
const isShow = ref(false)
const url = ref('')
const title = ref('')

const show = (_url, _title) => {
    console.log(_url)
    console.log(_title)
    url.value = _url || ''
    title.value = _title || ''
    isShow.value = true
    isAnimShow.value = true
}

const hide = () => {
    isAnimShow.value = false
    setTimeout(() => {
        isShow.value = false
    }, 300)
}

defineExpose({
    show,
    hide,
})
</script>
<style lang="scss" scoped>
.webview-dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100001;
    opacity: 0.5;
    background: #000000;
    // visibility: hidden;
    animation: webview-dialog-fade-out 0.3s ease-in;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;

    &.show {
        // visibility: visible;
        animation: webview-dialog-fade-in 0.3s ease-in;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
    }
}
.webview-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100002;

    display: flex;
    flex-direction: column;
    background: white;
    box-sizing: border-box;

    animation: webview-dialog-hide-content 0.3s linear;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;

    &.show {
        animation: webview-dialog-show-content 0.3s linear;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
    }
    .webview-dialog-head {
        flex-shrink: 0;
        width: 100%;
        height: 52px;
        background: white;
        display: flex;
        align-items: center;
        position: relative;

        .webview-dialog-back {
            width: 16px;
            height: auto;
            padding: 12px;
            position: absolute;
            left: 6px;
            top: 6px;
        }
        span {
            padding: 0 48px;
            font-size: 16px;
            color: #323233;
            font-weight: bold;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
            word-break: break-all;

            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .webview-dialog-close {
            width: 24px;
            height: 24px;
            padding: 8px;
            position: absolute;
            right: 6px;
            top: 6px;
        }
    }

    .webview-dialog-content {
        width: 100%;
        flex: 1;

        iframe {
            width: 100%;
            height: 100%;
            border: 0;
            outline: 0;
        }
    }
    .webview-dialog-none {
        position: absolute;
        top: 40%;
        left: 50%;
        z-index: 2;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

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
    }
}
@keyframes webview-dialog-fade-in {
    0% {
        opacity: 0;
        visibility: hidden;
    }

    100% {
        opacity: 0.5;
        visibility: visible;
    }
}
@keyframes webview-dialog-fade-out {
    0% {
        opacity: 0.5;
        visibility: visible;
    }

    100% {
        opacity: 0;
        visibility: hidden;
    }
}
@keyframes webview-dialog-show-content {
    0% {
        transform: translateX(100%);
        visibility: hidden;
    }

    100% {
        transform: translateX(0);
        visibility: visible;
    }
}
@keyframes webview-dialog-hide-content {
    0% {
        transform: translateX(0);
        visibility: visible;
    }

    100% {
        transform: translateX(100%);
        visibility: hidden;
    }
}
</style>
