<template>
    <div class="container">
        首页

        <span>{{ count }}</span>
        <button @click="search">搜索</button>
    </div>
    <Tabbar code="home" @refresh="tabRefresh"></Tabbar>
</template>

<script>
// 声明额外的选项
export default {
    // name: 'home', // 组件重命名
}
</script>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import Tabbar from '../../components/Tabbar.vue'
const { proxy } = getCurrentInstance()
const count = ref(0)

const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
const guid = getGuid()

let interval
onMounted(() => {
    console.log('home onMounted')
    startCount()
})
const startCount = () => {
    interval = setInterval(() => {
        count.value += 1
        console.log(count.value)
    }, 1000)
}
const tabRefresh = () => {
    console.log('home tabRefresh')
}
const search = () => {
    proxy.$router.push('/home/search')
}

onActivated(() => {
    console.log('home onActivated')
})
onDeactivated(() => {
    console.log('home onDeactivated')
})
onUnmounted(() => {
    console.log('home onUnmounted')
    clearInterval(interval)
})
</script>
<style lang="scss" scoped></style>
