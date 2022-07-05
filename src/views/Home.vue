<template>
    <div class="container">
        首页

        <span>{{ count }}</span>
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
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import Tabbar from '../components/Tabbar.vue'
import pictureService from '../utils/picture-service'
import dateService from '../utils/date-service'
const { proxy } = getCurrentInstance()
const count = ref(0)
onMounted(() => {
    let photo =
        'http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg'
    let picture =
        '[{"Category":null,"Index":0,"Items":["http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg"]},{"Category":"abc","Index":0,"Items":["http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg","http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg","http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg"]}]'

    // console.log(pictureService.getPicture(picture))
    console.log(pictureService.getPicture(picture, { width: 100 }))
    console.log(pictureService.getPicture(picture, { width: 100, original: true }))
    // console.log(pictureService.getPictures(picture))
    console.log(pictureService.getPictures(picture, true, { width: 100 }))
    console.log(pictureService.getPictures(picture, true, { width: 100, original: true }))
    // console.log(pictureService.compressPicture(photo))
    // console.log(pictureService.compressPicture(photo, { width: 100 }))
    let date = new Date()
    let date1 = '2022-07-04 20:30:11'
    console.log(dateService.format(date, 'yyyy-MM-dd HH:mm'))
    console.log(dateService.convert(date1))
    console.log(dateService.format(dateService.convert(date1), 'HH:mm'))

    startCount()
})
const startCount = () => {
    setInterval(() => {
        count.value += 1
        console.log(count.value)
    }, 1000)
}
const tabRefresh = () => {
    console.log('home tabRefresh')
}
</script>
<style lang="scss" scoped></style>
