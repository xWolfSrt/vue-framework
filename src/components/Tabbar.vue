<template>
    <div class="container">
        <div class="zw-tabbar-item" v-for="(tab, index) in tabs" :key="index" @click="tabClick(tab.code)">
            <div class="normal">
                <img :src="currentCode == tab.code ? tab.selectedIcon : tab.icon" />
                <!-- <img src="../assets/images/tab/icon_tab_main_selected.png" /> -->
                <span :class="currentCode == tab.code ? 'selected' : ''">{{ tab.name }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import getAssetsFile from '../utils/pub-use'
const { proxy } = getCurrentInstance()

const currentCode = ref('')
let tabs = reactive([])
defineProps(['code'])
const emits = defineEmits(['refresh'])
onMounted(() => {
    currentCode.value = proxy.$props.code
    initTabbar()
})
const initTabbar = () => {
    let itemMain = {}
    itemMain.name = '首页'
    itemMain.icon = getAssetsFile('tab/icon_tab_main.png')
    itemMain.selectedIcon = getAssetsFile('tab/icon_tab_main_selected.png')
    itemMain.path = '/home'
    itemMain.code = 'home'

    let itemLive = {}
    itemLive.name = '直播'
    itemLive.icon = getAssetsFile('tab/icon_tab_live.png')
    itemLive.selectedIcon = getAssetsFile('tab/icon_tab_live_selected.png')
    itemLive.path = '/live'
    itemLive.code = 'live'

    let itemCircle = {}
    itemCircle.name = '点播'
    itemCircle.icon = getAssetsFile('tab/icon_tab_video.png')
    itemCircle.selectedIcon = getAssetsFile('tab/icon_tab_video_selected.png')
    itemCircle.path = '/gssx'
    itemCircle.code = 'gssx'

    let itemMine = {}
    itemMine.name = '我的'
    itemMine.icon = getAssetsFile('tab/icon_tab_more.png')
    itemMine.selectedIcon = getAssetsFile('tab/icon_tab_more_selected.png')
    itemMine.path = '/personal'
    itemMine.code = 'personal'

    tabs.push(itemMain)
    tabs.push(itemLive)
    tabs.push(itemCircle)
    tabs.push(itemMine)
}

const tabClick = (code) => {
    console.log(code)
    if (code == currentCode.value) {
        emits && emits('refresh')
    } else {
        let path
        tabs.forEach((tab) => {
            if (code == tab.code) {
                path = tab.path
            }
        })
        console.log(path)
        path && proxy.$router.push(path)
    }
}
</script>
<style lang="scss" scoped>
.container {
    position: fixed;
    bottom: 0;
    z-index: 99999;
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background: white;

    &.shadow {
        box-shadow: 0px -5px 16px 0px rgba(65, 65, 65, 0.12);
    }
    .zw-tabbar-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .normal {
            width: 72px;
            height: 58px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: transparent;

            img {
                width: 34px;
                height: 34px;
            }

            span {
                color: #4b4b4b;
                font-size: 12px;
                &.selected {
                    color: #3fbf3f;
                }
            }
        }
    }
}
</style>
