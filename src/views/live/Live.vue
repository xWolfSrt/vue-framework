<template>
    <div class="container">直播</div>

    <Tabbar code="live" @refresh="tabRefresh"></Tabbar>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onActivated, onDeactivated } from 'vue'
import { Toast } from 'vant'
import Tabbar from '../../components/Tabbar.vue'

import getAssetsFile from '../../utils/pub-use'

const { proxy } = getCurrentInstance()
const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
const guid = getGuid()
const tabRefresh = () => {
    console.log('live tabRefresh')
}
</script>
<style lang="scss" scoped></style>
