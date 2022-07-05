<template>
    <div class="container">
        <span>我的</span>
        <span>{{ count }}</span>
        <button @click="add">+1</button>
    </div>

    <Tabbar code="personal" @refresh="tabRefresh"></Tabbar>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Tabbar from '../../components/Tabbar.vue'
const { proxy } = getCurrentInstance()
const count = ref(0)
const tabRefresh = () => {
    console.log('personal tabRefresh')
}
const add = () => {
    count.value += 1
}
</script>
<style lang="scss" scoped></style>
