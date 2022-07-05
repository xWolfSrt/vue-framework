<template>
    <!-- <router-view v-slot="{ Component }">
        <keep-alive :include="keepAlive">
            <component :is="Component" />
        </keep-alive>
    </router-view> -->

    <router-view v-slot="{ Component, route }">
        <keep-alive :include="keepAlive">
            <component :is="Component" :key="route.fullPath" />
        </keep-alive>
    </router-view>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const keepAlive = reactive(['Home', 'Personal'])
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
