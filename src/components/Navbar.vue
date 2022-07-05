<template>
    <div class="navbar" :style="{ background: bg || 'white', opacity: opacity }">
        <img v-if="canback" :src="dark ? getAssetsFile('icon_back_white.png') : getAssetsFile('icon_back.png')" @click="backClick" />
        <span :style="{ color: dark ? 'white' : '#111' }">{{ title }}</span>
        <img
            class="navbar-extra-img"
            v-if="extra && extra.img"
            :src="extra.img"
            :style="{ width: (extra && extra.imgWidth) || '16px' }"
            @click="extraClick"
        />
        <div class="navbar-extra-text" v-if="data.extra && data.extra.text" @click="extraClick">
            <span :style="{ color: data.extra.color || (dark ? 'white' : '#111') }">{{ data.extra.text }}</span>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, defineProps, defineEmits, onMounted } from 'vue'
import getAssetsFile from '../utils/pub-use'
const { proxy } = getCurrentInstance()

defineProps(['bg', 'opacity', 'title', 'canback', 'extra', 'dark'])
const emits = defineEmits(['navbarBack', 'navbarExtraClick'])

const bg = ref('#FFF')
const opacity = ref(1)
const title = ref('')
const canback = ref(true)
const data = reactive({
    extra: undefined,
})
const dark = ref(false)

onMounted(() => {
    bg.value = proxy.$props.bg || '#FFF'
    opacity.value = proxy.$props.opacity || 1
    title.value = proxy.$props.title || ''
    canback.value = proxy.$props.canback || true
    data.extra = proxy.$props.extra
    dark.value = proxy.$props.dark || false
})
const backClick = () => {
    console.log('button ' + title.value + ' back')
    emits('navbarBack', title.value)
}
const extraClick = () => {
    console.log('extraClick')
    emits('navbarExtraClick')
}
</script>
<style lang="scss" scoped>
.navbar {
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 99999;
    background: white;

    > img {
        flex-shrink: 0;
        width: 16px;
        height: auto;
        padding: 12px;
        margin-left: 6px;
    }

    > span {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 17px;
        color: rgba(0, 0, 0, 1);
        opacity: 1;
        margin: 0;
        width: 64%;
        text-align: center;

        word-break: break-all;
        word-wrap: break-word;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .navbar-extra-img {
        position: absolute;
        right: 4px;
        top: 50%;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
        padding: 8px;
    }
    .navbar-extra-text {
        position: absolute;
        right: 4px;
        height: 50px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
            font-size: 13px;
            color: #111;
        }
    }
}
</style>
