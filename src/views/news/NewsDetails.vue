<template>
    <div class="navbar-custom">
        <img class="navback" v-if="!isWXShare" :src="getAssetsFile('icon_back.png')" @click="navbarBack" />
        <span>资讯详情</span>
        <img
            v-if="!isZwLoadingShow"
            class="favorite"
            :src="data.item.favorite ? getAssetsFile('common/icon_favorite_on.png') : getAssetsFile('common/icon_favorite_off.png')"
            @click="favoriteClick"
            :style="{ right: '12px' }"
        />
    </div>

    <div class="container">
        <div style="width: 100%; height: 50px; flex-shrink: 0"></div>
        <div class="download" v-if="isWXShare">
            <img :src="getAssetsFile('common/icon_download_logo.png')" />
            <button @click="downApp">下载APP</button>
        </div>
        <div v-if="isWXShare" style="width: 100%; height: 46px; flex-shrink: 0"></div>
        <div class="info">
            <span>{{ data.item.name }}</span>
            <div>
                <span>{{ data.item.time }}</span>
                <span>{{ data.item.author }}</span>
            </div>
        </div>
        <div class="description">
            <div class="preview" id="preview">
                <textarea style="display: none"></textarea>
            </div>
        </div>
    </div>
    <ZwLoading ref="zwLoading" @errorTap="zwLoadingErrorTap"></ZwLoading>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue'
import { Toast, ImagePreview } from 'vant'
import getAssetsFile from '../../utils/pub-use'
import { useRouter } from 'vue-router'
import newsService from '../../api/news'
import pictureService from '../../utils/picture-service'
import dateService from '../../utils/date-service'
import ZwLoading from '../../components/ZwLoading.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const isWXShare = ref(false)
const data = reactive({
    id: undefined,
    item: {},
    temp: {},
    editor: undefined,
    previewImgList: [],
})
const zwLoading = ref(null)
const isZwLoadingShow = computed({
    get() {
        let tag = zwLoading && zwLoading.value && zwLoading.value.isShow()
        console.log('``````````````', tag)
        return tag
    },
    set(value) {},
})
onMounted(() => {
    console.log(router)
    data.id = router.currentRoute.value.query.id
    reload()
})

const navbarBack = () => {
    history.back()
}
const favoriteClick = () => {}
const reload = () => {
    data.temp.isReloading = true

    zwLoading.value.showLoading()
    newsService
        .fetch(data.id)
        .then((result) => {
            console.log(result)
            if (!result || !result.information) {
                reloadEmpty()
                return
            }
            disposeResult(result)
            reloadFinish()
        })
        .catch((err) => {
            reloadError()
        })
}
const disposeResult = (result) => {
    let item = result.information

    data.temp.item = item
    data.item = {
        id: item.id,
        photo: pictureService.getPicture(item.photo, { width: window.innerWidth }),
        photoShare: pictureService.getPicture(item.photo, { width: 120 }),
        name: item.title,
        // author: information.organization && information.organization.name,
        time: dateService.format(item.addTime, 'yyyy/MM/dd HH:mm'),
        favorite: result.favorite,
    }

    console.log(item.content)
    // let content = result.content && JSON.parse(result.content)
    // content.Preview = content.Preview.replace(/<br\/>/g, '\n')
    // console.log(content)

    data.temp.markdown = item.content || '无'

    console.log(data.item)
    initMarkdown()
    // initShareInfo()
}

const reloadEmpty = () => {
    data.isDataEmpty = true
    zwLoading.value.showEmpty('您查看的资讯找不到了~')
}
const reloadError = () => {
    // hideLoading()
    zwLoading.value.showError()
}
const reloadFinish = () => {
    data.temp.isReloading = false
    // hideLoading()
    zwLoading.value.hide()
}
const loadingErrorTap = () => {
    reload()
}
const initMarkdown = () => {
    console.log(window.editormd)
    // //清空之前的内容
    if (data.editor && data.editor.length > 0) {
        data.editor[0].innerHTML = ''
    }
    data.editor = window.editormd.markdownToHTML('preview', {
        markdown: data.temp.markdown,
        htmlDecode: 'style,script', // you can filter tags decode
        emoji: true,
        taskList: true,
        markdownSourceCode: false,
        tex: false, // 默认不解析
        flowChart: false, // 默认不解析
        sequenceDiagram: false, // 默认不解析
    })
    //为markdown内容图片添加点击事件
    setPreviewImgClickEvent('preview')
}

const setPreviewImgClickEvent = (id) => {
    setTimeout(() => {
        try {
            let preview = document.getElementById(id)
            data.previewImgList = []
            foreachPreviewElement(preview)
        } catch (error) {
            console.log(error)
        }
    }, 300)
}
const foreachPreviewElement = (el) => {
    if (!el) return
    let child = el.firstElementChild
    if (!child) return
    while (child) {
        if (child.children.length > 0) {
            foreachPreviewElement(child)
        } else if (child.nodeName == 'IMG') {
            let src = child.src
            // console.log('找到img', src)
            data.previewImgList.push(src)
            let index = data.previewImgList.length - 1
            child.onclick = () => {
                // console.log('img click', src)
                previewPhotoClick(index)
            }
        } else if (child.nodeName == 'A') {
            let url = child.href
            child.removeAttribute('href')
            child.onclick = () => {
                // console.log('a click', url)
                // if (!this.isWeixinMini) {
                //     this.globalService.getNavigateLink(url, 'outer')
                // }
            }
        }
        child = child.nextElementSibling
    }
}
const previewPhotoClick = (index) => {
    let list = data.previewImgList
    console.log(list)
    ImagePreview({
        images: list,
        closeable: true,
        startPosition: index,
    })
}
const zwLoadingErrorTap = () => {
    reload()
}
const showLoading = (content) => {
    Toast.loading({
        duration: 0,
        message: content || '加载中...',
        forbidClick: true,
    })
}
const hideLoading = () => {
    Toast.clear()
}
</script>
<style lang="scss" scoped>
.navbar-custom {
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 100;
    background: white;

    .navback {
        flex-shrink: 0;
        width: 16px;
        height: auto;
        padding: 12px;
        margin-left: 6px;
    }

    span {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 17px;
        color: #262626;
        margin: 0;
    }

    .favorite {
        width: 24px;
        height: 24px;
        padding: 2px;

        position: absolute;
        right: 52px;
        top: 50%;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
    }

    .share {
        width: 22px;
        height: 22px;
        position: absolute;
        padding: 2px;

        right: 12px;
        top: 50%;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
    }
}

.container {
    width: 100%;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .photo {
        flex-shrink: 0;
        width: 100%;
        height: 250px;
        position: relative;

        p {
            position: absolute;
            z-index: 2;
            right: 14px;
            bottom: 13px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 25px;
            padding: 4px 11px 5px;
            color: #ffffff;
            font-size: 13px;
        }

        .swiper-news-details-photos {
            width: 100%;
            height: 100%;
            background-color: #fff;
        }
        .swiper-item {
            width: 100%;
            height: 100%;
        }
        .photo-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .download {
        flex-shrink: 0;
        background: white;
        width: 100%;
        height: 46px;
        padding: 0 21px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        position: fixed;
        top: 50px;
        left: 0;
        z-index: 1000;
        // position: relative;
        // z-index: 1000;
        // top: 49px;
        // position: sticky;

        img {
            flex-shrink: 0;
            width: 105px;
            height: 26px;
        }

        button {
            width: 90px;
            height: 36px;
            line-height: 36px;
            border-radius: 4px;
            font-size: 14px;
            border: none;
            color: white;
            background: #ff6d1d;

            &::after {
                border: none;
            }
        }
    }
    .info {
        flex-shrink: 0;
        background: white;
        width: 100%;
        padding: 22px 22px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        > span {
            font-size: 16px;
            line-height: 24px;
            color: #262626;
            font-weight: bold;
            word-break: break-all;
            text-align: justify;
        }
        div {
            display: flex;
            align-items: center;
            margin-top: 10px;

            span:nth-of-type(1) {
                flex-shrink: 0;
                font-size: 12px;
                color: #2d2d2d;
                opacity: 0.5;
                margin-right: 12px;
            }
            span:nth-of-type(2) {
                flex: 1;
                font-size: 12px;
                color: #2d2d2d;
                opacity: 0.5;
                text-align: right;
                word-break: break-all;

                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
        }
    }

    .description {
        flex-shrink: 0;
        background: white;
        width: 100%;
        padding: 0 22px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        .preview {
            box-sizing: border-box;
            width: 100%;
            // overflow-y: scroll;
            // -webkit-overflow-scrolling: touch;
            background: white;
            padding: 22px 0 32px;
            text-align: justify;

            :deep ul {
                list-style: disc !important;
            }
            :deep ol {
                list-style: decimal !important;
            }
            :deep iframe {
                width: 100%;
            }
        }
    }
}
</style>
