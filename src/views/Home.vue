<template>
    <div class="container">首页</div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import pictureService from '../utils/picture-service'
const { proxy } = getCurrentInstance()

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
})
</script>
<style lang="scss" scoped></style>
