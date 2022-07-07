<template>
    <div
        :id="data.page + '_' + data.index"
        class="temp-gstt-item"
        @click="itemClick"
        :class="{ favorite: data.favorite, last: data.index == data.total - 1 }"
    >
        <div class="agent" v-if="data.favorite" @click.stop="agentClick">
            <img :src="(data.item.agent && data.item.agent.photo) || getAssetsFile('common/profile_photo.png')" />
            <div>
                <span>{{ data.item.agent && data.item.agent.name }}</span>
                <span>{{ data.item.time }}</span>
            </div>
        </div>
        <div class="text-container" v-if="data.item.type == 'text'">
            <div class="content" :style="{ height: data.item.photo || !data.favorite ? '77px' : 'auto' }">
                <span :style="{ '-webkit-line-clamp': data.favorite ? 3 : 2 }">{{ data.item.name }}</span>
                <div class="bottom" v-if="!data.favorite">
                    <!-- <span class="top" v-if="!favorite && item.top && !search">置顶</span> -->
                    <!-- <span class="agent-name" v-if="item.agent && item.agent.name">{{ item.agent && item.agent.name }}</span> -->
                    <span class="time">{{ data.item.time }}</span>
                </div>
            </div>
            <img v-if="data.item.photo" :src="data.item.photo" />
        </div>
        <div class="picture-container" v-if="data.item.type == 'picture'">
            <span>{{ data.item.name }}</span>
            <div
                class="photos"
                v-if="data.item.photos && data.item.photos.length > 0"
                :style="{ 'margin-bottom': data.favorite ? '0' : '10px' }"
            >
                <div v-for="(photo, i) in data.item.photos" :key="i">
                    <img :src="photo" v-if="i < 3" />
                </div>
            </div>
            <div class="bottom" v-if="!data.favorite">
                <!-- <span class="top" v-if="!favorite && item.top && !search">置顶</span> -->
                <!-- <span class="agent-name" v-if="item.agent && item.agent.name">{{ item.agent && item.agent.name }}</span> -->
                <span class="time">{{ data.item.time }}</span>
            </div>
        </div>
        <div class="video-container" v-if="data.item.type == 'video'">
            <span>{{ data.item.name }}</span>
            <img :src="data.item.photo" v-if="data.item.photo" :style="{ 'margin-bottom': data.favorite ? '0' : '10px' }" />
            <div class="bottom" v-if="!data.favorite">
                <!-- <span class="top" v-if="!favorite && item.top && !search">置顶</span> -->
                <!-- <span class="agent-name" v-if="item.agent && item.agent.name">{{ item.agent && item.agent.name }}</span> -->
                <span class="time">{{ data.item.time }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, defineProps, defineEmits, onMounted, toRaw } from 'vue'
import getAssetsFile from '../../utils/pub-use'
const { proxy } = getCurrentInstance()

defineProps(['item', 'index', 'page', 'favorite', 'total', 'border', 'search'])

const data = reactive({
    item: {},
    index: 0,
    page: 0,
    favorite: false,
    total: 0,
    border: false,
    search: false,
})
const emits = defineEmits(['itemClick'])
onMounted(() => {
    data.item = proxy.$props.item
    data.index = proxy.$props.index
    data.page = proxy.$props.page
    data.favorite = proxy.$props.favorite
    data.total = proxy.$props.total
    data.border = proxy.$props.border
    data.search = proxy.$props.search
})

const itemClick = () => {
    emits('itemClick', {
        item: toRaw(data.item),
        page: toRaw(data.page),
        index: toRaw(data.index),
    })
}
</script>
<style lang="scss" scoped>
.temp-gstt-item {
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 20px 0 21px;
    border-bottom: 1px solid #e3e3e3;

    &.last {
        border-bottom: none;
    }
    &.favorite {
        margin: 6px 0;
        padding: 20px 16px 21px;
        border-bottom: none;
    }
    .agent {
        width: 100%;
        height: 34px;
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        img {
            flex-shrink: 0;
            width: 34px;
            height: 34px;
            border-radius: 34px;
            margin-right: 9px;
            object-fit: cover;
        }

        div {
            flex: 1;
            display: flex;
            flex-direction: column;

            span:nth-of-type(1) {
                font-size: 13px;
                color: #262626;
                font-weight: bold;
                word-break: break-all;

                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            span:nth-of-type(2) {
                margin-top: 2px;
                font-size: 11px;
                color: #919eb5;
            }
        }
    }
    .text-container {
        display: flex;
        align-items: center;
        box-sizing: border-box;

        .content {
            flex: 1;
            height: 77px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            > span:nth-of-type(1) {
                color: #000000;
                font-size: 15px;
                line-height: 24px;
                // font-weight: bold;
                word-break: break-all;
                word-wrap: break-word;

                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }

        img {
            flex-shrink: 0;
            margin-left: 14px;
            flex-shrink: 0;
            width: 112px;
            height: 77px;
            object-fit: cover;
            border-radius: 4px;
        }
    }
    .video-container {
        display: flex;
        flex-direction: column;

        > span:nth-of-type(1) {
            color: #000000;
            font-size: 15px;
            line-height: 24px;
            // font-weight: bold;
            word-break: break-all;
            word-wrap: break-word;
            margin-bottom: 10px;
        }
        img {
            margin: 0 0 10px;
            flex-shrink: 0;
            width: 100%;
            height: 194px;
            border-radius: 4px;
            object-fit: cover;
        }
    }
    .picture-container {
        display: flex;
        flex-direction: column;

        > span:nth-of-type(1) {
            color: #000000;
            font-size: 15px;
            line-height: 24px;
            // font-weight: bold;
            word-break: break-all;
            word-wrap: break-word;
            margin-bottom: 10px;
        }

        .photos {
            margin: 0 0 10px;
            display: flex;
            align-items: center;
            height: 96px;
            overflow: hidden;
            img {
                flex-shrink: 0;
                height: 100%;
                width: 32%;
                border-radius: 4px;
                object-fit: cover;
                margin: 0 0.33%;
            }
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        .top {
            flex-shrink: 0;
            color: #ff371d;
            font-size: 12px;
            margin-right: 12px;
        }
        .agent-name {
            color: #919eb5;
            font-size: 12px;
            margin-right: 10px;
            word-break: break-all;

            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .time {
            flex-shrink: 0;
            color: #919eb5;
            font-size: 12px;
        }
    }
}
</style>
