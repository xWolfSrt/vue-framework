<template>
    <router-view v-slot="{ Component, route }">
        <keep-alive :include="keepAlive">
            <component :is="Component" :key="route.fullPath" />
        </keep-alive>
    </router-view>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const keepAlive = reactive(['PersonalSettings'])
</script>
<style lang="scss" scoped></style>
