<template>
    <div
        class="zw-loading"
        v-if="show"
        @click.stop="bgTap()"
        :style="{
            background: background || '#FFF',
            bottom: bottom || 0,
            top: top || 0,
            'z-index': zIndex || 98,
            position: isAbsolute ? 'absolute' : 'fixed',
        }"
    >
        <div v-if="data.loadingShow" class="loading">
            <img :src="getAssetsFile('icon_loading_circle.gif')" />
            <span v-if="data.loadingText">{{ data.loadingText || '' }}</span>
        </div>

        <div v-if="data.errorShow" class="error">
            <img :src="getAssetsFile('common/icon_net_error.png')" />
            <span>{{ data.errorText || '您的网络好像不太给力' }}</span>
            <button
                class="btn btn-lg btn-gradient btn-gradient-shadow"
                @click="errorTap()"
                :style="{ 'margin-bottom': data.hideErorIcon ? '0' : '.8rem' }"
            >
                {{ data.errorBtnText || '重新加载' }}
            </button>
        </div>

        <div v-if="data.emptyShow" class="empty">
            <img :src="getAssetsFile('common/icon_data_empty.png')" />
            <span>{{ data.emptyText || '暂无相关数据' }}</span>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import getAssetsFile from '../utils/pub-use'
const { proxy } = getCurrentInstance()

defineProps(['top', 'bottom', 'background', 'zIndex', 'isAbsolute'])
const emits = defineEmits(['errorTap'])
const show = ref(false)

const top = ref(0)
const bottom = ref(0)
const background = ref('#FFF')
const zIndex = ref(0)
const isAbsolute = ref(true)

const data = reactive({
    loadingShow: true,
    loadingText: '',

    errorShow: false,
    errorText: '',
    errorBtnText: '',
    hideErorIcon: false,

    emptyShow: false,
    emptyText: '',
})
onMounted(() => {
    top.value = proxy.$props.top
    bottom.value = proxy.$props.bottom
    background.value = proxy.$props.background
    zIndex.value = proxy.$props.zIndex
    isAbsolute.value = proxy.$props.isAbsolute
})

const showLoading = (text) => {
    console.log('showLoading config', data)
    show.value = true
    data.loadingShow = true
    data.emptyShow = false
    data.errorShow = false
    data.loadingText = text
}
const hide = () => {
    show.value = false
}

const showError = (errorText, hideIcon, errorBtnText) => {
    console.log('showError config', data)
    show.value = true
    data.loadingShow = false
    data.emptyShow = false
    data.errorShow = true
    data.errorText = errorText
    data.errorBtnText = errorBtnText
    data.hideErorIcon = hideIcon
}
const errorTap = () => {
    emits('errorTap')
}

const showEmpty = (emptyText) => {
    console.log('showEmpty config', data)
    show.value = true
    data.loadingShow = false
    data.errorShow = false
    data.emptyShow = true
    data.emptyText = emptyText
}
const isShow = () => {
    return show.value
}
const bgTap = () => {}
defineExpose({
    showLoading,
    hide,
    showError,
    showEmpty,
    isShow,
})
</script>
<style lang="scss" scoped>
.zw-loading {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 98;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .loading {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            flex-shrink: 0;
            width: 44px;
            height: 44px;
        }

        p {
            flex-shrink: 0;
            color: #888;
            font-size: 16px;
            margin-top: 24px;
        }
    }
    .error {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            flex-shrink: 0;
            width: 315px;
            height: 216px;
        }

        p {
            flex-shrink: 0;
            color: #616b7a;
            font-size: 15px;
            margin-top: 16px;
        }

        button {
            flex-shrink: 0;
            text-align: center;
            color: white;
            margin-top: 32px;
            margin-bottom: 80px;
            border-radius: 4px;
            min-width: 180px;
            max-width: 80%;
            font-size: 15px;

            &:after {
                border: none;
            }
        }
    }
    .empty {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            flex-shrink: 0;
            width: 315px;
            height: 216px;
        }

        p {
            flex-shrink: 0;
            color: #616b7a;
            font-size: 15px;
            line-height: 24px;
            text-align: center;
            margin-top: 16px;
            margin-bottom: 64px;
        }
    }
}
</style>
