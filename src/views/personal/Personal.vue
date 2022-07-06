<template>
    <div class="bg">
        <img :src="getAssetsFile('mine/bg.png')" />
    </div>
    <div class="container">
        <div class="header">
            <div class="info">
                <img :src="(data.account && data.account.photo) || getAssetsFile('common/profile_photo.png')" @click.stop="personal" />
                <img
                    v-if="data.account && data.account.auth && data.account.auth.status == 'accept'"
                    :src="getAssetsFile('mine/ico_vip.png')"
                    @click.stop="personal"
                />
                <div class="unlogin" v-if="!data.account" @click.stop="personal">
                    <span>点击登录</span>
                    <img :src="getAssetsFile('mine/icon_to_login.png')" />
                </div>
                <div class="unauth" v-if="data.account && !data.account.auth" @click.stop="personal">
                    <span>{{ data.account.name || data.account.nick }}</span>
                    <div>
                        <span>你还没有认证会员</span>
                    </div>
                </div>
                <div
                    class="auth_submit"
                    v-if="data.account && data.account.auth && data.account.auth.status == 'submit'"
                    @click.stop="personal"
                >
                    <span>{{ data.account.name || data.account.nick }}</span>
                    <div>
                        <span>认证审核中</span>
                        <!-- <span>续费</span> -->
                    </div>
                </div>
                <div
                    class="auth_accept"
                    v-if="data.account && data.account.auth && data.account.auth.status == 'accept'"
                    @click.stop="personal"
                >
                    <span>{{ data.account.name || data.account.nick }}</span>
                    <div>
                        <span>{{ data.account.auth.isPersonal ? '个人会员' : '企业会员' }}</span>
                        <!-- <span>续费</span> -->
                    </div>
                </div>

                <div
                    class="auth_deny"
                    v-if="data.account && data.account.auth && data.account.auth.status == 'deny'"
                    @click.stop="personal"
                >
                    <span>{{ data.account.name || data.account.nick }}</span>
                    <div>
                        <span>认证未通过</span>
                        <span @click="authDenyClick()">查看</span>
                    </div>
                </div>
            </div>
            <div class="wallet">
                <div class="wallet-item" @click="balanceClick()">
                    <span :class="{ none: !data.account }">{{ (data.account && data.account.balance) || '—— ——' }}</span>
                    <div>
                        <span>余额</span>
                        <span>(元)</span>
                    </div>
                </div>
                <div class="wallet-item" @click="pointClick()">
                    <span :class="{ none: !data.account }">{{ (data.account && data.account.point) || '—— ——' }}</span>
                    <div>
                        <span>积分</span>
                    </div>
                </div>
            </div>
            <div class="auth" @click="authClick()">
                <img :src="getAssetsFile('mine/bg_auth.png')" />
                <div>
                    <img :src="getAssetsFile('mine/icon_auth.png')" />
                    <span>{{
                        data.account && data.account.auth ? (data.account.auth.isPersonal ? '个人会员' : '企业会员') : '认证会员'
                    }}</span>
                    <span></span>
                    <span :class="{ authed: data.account && data.account.auth }">{{
                        (data.account && data.account.auth && data.account.auth.name) || '认证会员可享专属特权'
                    }}</span>
                </div>
            </div>
            <img class="settings" :src="getAssetsFile('mine/icon_settings.png')" @click="settingsClick()" />
        </div>

        <div class="rz">
            <div class="head">
                <span>我的融资</span>
                <div class="car" @click="directClick()">
                    <img :src="getAssetsFile('mine/icon_car.gif')" />
                    <span v-if="data.account && data.account.direct">{{ data.account && data.account.direct }}</span>
                </div>
            </div>
            <div class="menu">
                <div @click="authClick()">
                    <img :src="getAssetsFile('mine/icon_information.png')" />
                    <span>我的资料</span>
                </div>
                <div @click="recordClick()">
                    <img :src="getAssetsFile('mine/icon_apply.png')" />
                    <span>我的申请</span>
                </div>
                <div @click="favoriteClick()">
                    <img :src="getAssetsFile('mine/icon_favorite.png')" />
                    <span>我的关注</span>
                </div>
            </div>
        </div>
        <div class="list-container">
            <div class="list" v-for="(group, index) in data.list" :key="index">
                <PersonalItem
                    v-for="(item, i) in group"
                    :key="i"
                    :item="item"
                    :isLast="i == group.length - 1"
                    @itemClick="personalItemClick"
                ></PersonalItem>
            </div>
        </div>
        <div style="width: 100%; height: 86px; flex-shrink: 0"></div>
    </div>
    <Tabbar code="personal" @refresh="tabRefresh"></Tabbar>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onActivated, onDeactivated } from 'vue'
import { Toast } from 'vant'
import Tabbar from '../../components/Tabbar.vue'
import getAssetsFile from '../../utils/pub-use'
import PersonalItem from './PersonalItem.vue'
import { getAccountSummary, convertAccount } from '../../api/user'

const { proxy } = getCurrentInstance()
const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
const guid = getGuid()
let data = reactive({
    list: [],
    account: undefined,
})
const tabRefresh = () => {
    console.log('personal tabRefresh')
}
onMounted(() => {
    console.log('personal onMounted')
    data.account = proxy.$storage.get('currentAccount')
    initList()
    getSummary()
})
onActivated(() => {
    console.log('personal onActivated')
    data.account = proxy.$storage.get('currentAccount')
    console.log(data.account)
})
onDeactivated(() => {
    console.log('personal onDeactivated')
})
const initList = () => {
    let list0 = []
    let list1 = []

    list0.push(getListItem('', '我的收藏', 'personal/favorite', true, '#EFFCEA'))

    list0.push(getListItem('', '我的政策', 'wyzc/apply/record', true, '#EFFCEA'))
    list0.push(getListItem('', '我的设置', 'personal/settings', false, '#EFFCEA'))

    list1.push(getListItem('', '会员证书', 'ecard', true, '#EFFCEA'))

    data.list = [list1, list0]
}

const getListItem = (icon, name, page, permission, background, extra, options) => {
    return {
        icon: icon,
        name: name,
        page: page,
        permission: permission,
        background: background,
        extra: extra,
        options: options,
    }
}

const personalItemClick = (item) => {
    console.log('personalItemClick', item)
    if (!item.page) {
        Toast('敬请期待')
        return
    }
    if (item.page == 'contact') {
        return
    }
    if (item.permission && checkLogin()) {
        return
    }

    // if (item.page == 'personal/favorite') {
    //     this.router.navigate(['/personal/favorite'], {
    //         queryParams: {
    //             key: this.globalService.getGuid(),
    //         },
    //     })
    //     return
    // }
    // if (item.page == 'wyzc/apply/record') {
    //     this.router.navigate(['/wyzc/apply/record'], {
    //         queryParams: {
    //             key: this.globalService.getGuid(),
    //         },
    //     })
    //     return
    // }
    // if (item.page == 'personal/settings') {
    //     this.router.navigate(['/personal/settings'], {
    //         queryParams: {
    //             key: this.globalService.getGuid(),
    //         },
    //     })
    //     return
    // }

    proxy.$router.push(`/${item.page}`)
}
const isLogin = () => {
    return proxy.$storage.get('currentAccount') != null
}
const checkLogin = () => {
    if (!isLogin()) {
        proxy.$router.push('/login')
        return true
    }
    return false
}
const personal = () => {
    if (checkLogin()) {
        return
    }
    proxy.$router.push('/personal/details')
}

const settingsClick = () => {
    proxy.$router.push('/personal/settings')
    // this.router.navigate(['/personal/settings'], {
    //     queryParams: {
    //         key: this.globalService.getGuid(),
    //     },
    // })
}

const getSummary = () => {
    if (!isLogin()) {
        return
    }
    getAccountSummary()
        .then((result) => {
            if (result) {
                let account = convertAccount(result)
                proxy.$storage.set('currentAccount', account)
                data.account = account
                updateAccount()
            }
        })
        .catch((err) => {
            console.log(err)
        })
}
const updateAccount = () => {}
</script>
<style lang="scss" scoped>
.bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 235px;
    z-index: 1;

    img {
        width: 100%;
        height: 100%;
    }
}
.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 0 18px;
    box-sizing: border-box;

    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .header {
        flex-shrink: 0;
        padding: 32px 0 12px;
        box-sizing: content-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .info {
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;
            > img:nth-of-type(1) {
                margin-left: 10px;
                flex-shrink: 0;
                width: 56px;
                height: 56px;
                border-radius: 56px;
                background: white;
                padding: 2px;
                overflow: hidden;
                object-fit: cover;
            }
            > img:nth-of-type(2) {
                position: absolute;
                z-index: 1;
                top: 28px;
                left: 38px;
                flex-shrink: 0;
                width: 47px;
                height: 44px;
            }

            .unlogin {
                display: flex;
                align-items: center;
                margin-left: 24px;

                span {
                    font-size: 20px;
                    color: white;
                    font-weight: bold;
                }
                img {
                    margin-left: 2px;
                    width: 24px;
                    height: 24px;
                }
            }
            .unauth {
                margin-left: 24px;
                display: flex;
                flex-direction: column;

                > span {
                    font-size: 20px;
                    color: white;
                    font-weight: bold;
                }

                div {
                    display: flex;
                    align-items: center;
                    margin-top: 12px;
                    span:nth-of-type(1) {
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.7);
                    }
                }

                // span:nth-of-type(1) {
                //     font-size: 25px;
                //     color: #2b2b2b;
                //     margin-top: 12px;
                //     font-weight: bold;
                // }
                // span:nth-of-type(2) {
                //     font-size: 14px;
                //     color: #b6b7b6;
                //     margin-top: 4px;
                // }
            }
            .auth_submit {
                display: flex;
                flex-direction: column;
                margin-left: 24px;

                > span {
                    font-size: 20px;
                    color: white;
                    font-weight: bold;
                }

                div {
                    display: flex;
                    align-items: center;
                    margin-top: 12px;
                    span:nth-of-type(1) {
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    span:nth-of-type(2) {
                        font-size: 12px;
                        color: #be6212;
                        margin-left: 8px;
                        font-weight: bold;
                        height: 21px;
                        line-height: 21px;
                        padding: 0 8px;
                        background: linear-gradient(123deg, #fffbc7 7%, #f8c87a 122%);
                        border-radius: 21px;
                        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
                    }
                }
            }
            .auth_accept {
                display: flex;
                flex-direction: column;
                margin-left: 24px;

                > span {
                    font-size: 20px;
                    color: white;
                    font-weight: bold;
                }

                div {
                    display: flex;
                    align-items: center;
                    margin-top: 12px;
                    span:nth-of-type(1) {
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    span:nth-of-type(2) {
                        font-size: 12px;
                        color: #be6212;
                        margin-left: 8px;
                        font-weight: bold;
                        height: 21px;
                        line-height: 21px;
                        padding: 0 8px;
                        background: linear-gradient(123deg, #fffbc7 7%, #f8c87a 122%);
                        border-radius: 21px;
                        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
                    }
                }
            }
            .auth_deny {
                display: flex;
                flex-direction: column;
                margin-left: 24px;

                > span {
                    font-size: 20px;
                    color: white;
                    font-weight: bold;
                }

                div {
                    display: flex;
                    align-items: center;
                    margin-top: 12px;
                    span:nth-of-type(1) {
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    span:nth-of-type(2) {
                        font-size: 12px;
                        color: white;
                        margin-left: 8px;
                        font-weight: bold;
                        height: 21px;
                        line-height: 21px;
                        padding: 0 8px;
                        background: linear-gradient(123deg, #f8847f 7%, #fc6b59 122%);
                        border-radius: 21px;
                        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
                    }
                }
            }
        }

        .settings {
            position: absolute;
            top: 26px;
            right: -10px;
            width: 24px;
            height: 24px;
            padding: 12px;
        }

        .wallet {
            display: flex;
            align-items: center;
            width: 100%;
            margin: 23px 0 22px;
            .wallet-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                > span {
                    font-size: 24px;
                    color: white;
                    font-weight: bold;

                    &.none {
                        font-size: 10px;
                        margin-bottom: 4px;
                        margin-top: 15px;
                    }
                }

                div {
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    span {
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.7);
                    }
                    span:nth-of-type(2) {
                        font-size: 10px;
                        margin-left: 4px;
                    }
                }
            }
        }
        .auth {
            width: 100%;
            height: 46px;
            display: flex;
            align-items: center;
            position: relative;
            box-shadow: 0px 5px 12px 0px rgba(80, 80, 80, 0.12);

            > img {
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
            }

            div {
                display: flex;
                align-items: center;
                position: absolute;
                z-index: 2;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                img {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    margin-left: 17px;
                }

                span:nth-of-type(1) {
                    flex-shrink: 0;
                    font-size: 16px;
                    color: #ffc898;
                    font-weight: bold;
                    margin-left: 6px;
                    margin-right: 12px;
                }
                span:nth-of-type(2) {
                    flex: 1;
                    font-size: 16px;
                }
                span:nth-of-type(3) {
                    font-size: 12px;
                    color: white;
                    font-weight: bold;
                    padding: 3px 6px;
                    background: #e88943;
                    border-radius: 12px 0px 0px 12px;
                    box-shadow: 0px 5px 12px 0px rgba(80, 80, 80, 0.12);

                    word-break: break-all;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;

                    &.authed {
                        background: transparent;
                        box-shadow: none;
                        padding: 0 16px 0 0;
                        border-radius: 0;
                    }
                }
            }
        }
    }
    .rz {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 8px;
        // padding: 12px 14px 22px 22px;
        box-sizing: border-box;

        .head {
            display: flex;
            align-items: center;
            margin: 5px 0 8px;
            > span {
                margin-left: 22px;
                margin-top: 6px;
                flex: 1;
                font-size: 16px;
                color: #313131;
                font-weight: bold;
            }
            .car {
                flex-shrink: 0;
                position: relative;
                display: flex;
                margin-right: 4px;
                img {
                    flex-shrink: 0;
                    width: 129px;
                    height: 38px;
                }
                span {
                    position: absolute;
                    left: 4px;
                    top: 5px;
                    z-index: 1;
                    font-size: 11px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    border-radius: 20px;
                    color: white;
                    background: #ff741d;
                    border: 2px solid #f8f8f8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        .menu {
            display: flex;
            align-items: center;
            margin-top: 14px;
            padding: 0 22px 22px;
            box-sizing: border-box;
            div {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                img {
                    width: 32px;
                    height: 32px;
                }
                span {
                    font-size: 12px;
                    color: #313131;
                    margin-top: 8px;
                }
            }
        }
    }
    .list-container {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 6px 0;
        box-sizing: border-box;

        .list {
            flex-shrink: 0;
            margin: 6px 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            background: white;
            border-radius: 8px;
            padding: 0 24px;
            box-sizing: border-box;
        }
    }
}
</style>
