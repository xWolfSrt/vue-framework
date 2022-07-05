<template>
    <div class="temp-personal-item" :class="isLast ? 'last' : ''" @click="navigator">
        <!-- <div *ngIf="item.icon" [ngStyle]="{ background: item.background }">
            <img class="icon" [src]="item.icon" />
        </div> -->
        <span>{{ item.name }}</span>
        <span :style="{ color: (item.extra && item.extra.color) || '#888' }">
            {{ (item.page != 'contact' && item.extra && item.extra.value) || '' }}
        </span>
        <img class="next" :src="getAssetsFile('mine/icon_arrow.png')" />
        <a v-if="item.page == 'contact'" :href="'tel:' + item.extra.value"></a>
    </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, defineProps, defineEmits, onMounted, toRaw } from 'vue'
import getAssetsFile from '../../utils/pub-use.js'
const { proxy } = getCurrentInstance()

const data = reactive({
    item: undefined,
    isLast: false,
})
defineProps(['item', 'isLast'])
const emits = defineEmits(['itemClick'])
const navigator = () => {
    emits('itemClick', toRaw(data.item))
}
onMounted(() => {
    data.item = proxy.$props.item
    data.isLast = proxy.$props.isLast || false
})
</script>
<style lang="scss" scoped>
.temp-personal-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 52px;
    border-bottom: 1px solid rgba(220, 220, 220, 0.4);
    position: relative;

    &.last {
        border-bottom: none;
    }

    &:active {
        background-color: #fbfbfb;
    }
    div {
        flex-shrink: 0;
        margin-right: 16px;

        width: 38px;
        height: 38px;
        background: #fff4f3;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
            width: auto;
            height: 22px;
        }
    }

    .next {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        margin-right: -8px;
    }

    > span:nth-of-type(1) {
        flex: 1;
        color: #2b2b2b;
        font-size: 14px;
    }

    > span:nth-of-type(2) {
        flex-shrink: 0;
        color: #a1a1a1;
        font-size: 12px;
        margin-right: 8px;
    }

    > a {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
}
</style>
