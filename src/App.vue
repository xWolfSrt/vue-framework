<template>
    <router-view v-slot="{ Component, route }">
        <!-- <component :is="Component" :key="route.fullPath" /> -->
        <keep-alive :include="keepAlive">
            <component :is="Component" :key="route.fullPath" />
        </keep-alive>
    </router-view>
    <!-- <router-view></router-view> -->
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import config from './config'
const { proxy } = getCurrentInstance()

const keepAlive = reactive(['Home', 'Live', 'Personal', 'PersonalSettings'])

onMounted(() => {
    initHost()
})

const initHost = () => {
    console.log('initHost', document.location, window.location)
    let domain = window.location.origin

    if (config.isTest) {
        domain = config.defaultDomain
    }
    proxy.$storage.set('host', domain)
}
</script>
<style lang="scss">
html,
body {
    background: #f4f5f6;
}

.view-enter-active {
    animation: view-ani var(--el-transition-duration);
}

.view-leave-active {
    animation: view-ani reverse var(--el-transition-duration);
}

@keyframes view-ani {
    from {
        opacity: 0;
    }
}
</style>
