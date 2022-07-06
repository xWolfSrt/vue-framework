<template>
    <div class="container">
        <div class="search-container" v-if="data.selectedCity && data.temp.zoneView">
            <div class="city" @click="cityClick()">
                <span>{{ data.selectedCity || '' }}</span>
                <div v-if="data.zoneList.length > 0"></div>
            </div>
            <div class="search" @click="searchClick()">
                <img :src="getAssetsFile('home/icon_home_search.png')" />
            </div>
            <div class="scan" @click="scanClick()">
                <img :src="getAssetsFile('home/icon_home_scan.png')" />
            </div>
        </div>
        <!-- <div class="none" v-if="!data.temp.isReloading && !data.temp.zoneView">
            <img :src="getAssetsFile('common/icon_data_empty.png')" />
            <p>门户暂未开通，请联系管理员</p>
        </div> -->

        <div class="module">
            <div class="module-cell" v-for="(item, index) in data.modules" :key="index" @click="moduleClick(item)">
                <img :src="item.icon" />
                <p>{{ item.name }}</p>
            </div>
        </div>

        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell v-for="item in list" :key="item" :title="item" />
  </van-list>
</van-pull-refresh> -->

        <!-- <div style="width: 100%; height: 56px; flex-shrink: 0"></div> -->
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
import { ref, reactive, getCurrentInstance, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import { Toast } from 'vant'
import Tabbar from '../../components/Tabbar.vue'
import getAssetsFile from '../../utils/pub-use'
import zoneService from '../../api/zone'
import newsService from '../../api/news'
import config from '../../config'
import pictureService from '../../utils/picture-service'
const { proxy } = getCurrentInstance()
const count = ref(0)
const defaultCity = '江西省工商联'

const defaultModules = [
    { name: '商联头条', icon: getAssetsFile('home/icon_app_gstt.png'), page: 'gsdl://gstt' },
    { name: '金融服务', icon: getAssetsFile('home/icon_app_wyrz.png'), page: 'gsdl://gsrz' },
    { name: '政策服务', icon: getAssetsFile('home/icon_app_wyzc.png'), page: 'gsdl://wyzc' },
    { name: '全部应用', icon: getAssetsFile('home/icon_app_all.png'), page: 'gsdl://application' },
]
const data = reactive({
    selectedCity: '',
    temp: {},
    zoneList: [],
    modules: [
        { name: '商联头条', icon: getAssetsFile('home/icon_app_gstt.png'), page: 'gsdl://gstt' },
        { name: '金融服务', icon: getAssetsFile('home/icon_app_wyrz.png'), page: 'gsdl://gsrz' },
        { name: '政策服务', icon: getAssetsFile('home/icon_app_wyzc.png'), page: 'gsdl://wyzc' },
    ],

    notice: undefined,
    isNoticeShow: false,
    banner: undefined,
    bannerHeight: 150,
    currentBanner: 0,

    currentCompany: 0,
    companies: undefined,

    adHot: undefined,
    hotVideoHeight: '194px',

    ad1List: undefined,
    ad2List: undefined,
    news: [],
    // //是否重新加载
    // isReloadingNews = false
    // //是否在加载更多
    // isLoadingMoreNews = false
    // //是否显示已无更多
    // isNoMoreShowNews = false
    // //当前条件下的总数量
    // totalCountNews = 0
    // noDataNews = false
    perCountNews: 6, //约定每次查6条

    categoryList: [],
    tabs: [],
    currentPage: 0,
    sliderOffset: 0,
    sliderWidth: 90,
    sliderBarWidth: 28,
    sliderBarMarginLeft: 31,
})
const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
const guid = getGuid()

onMounted(() => {
    console.log('home onMounted')
    // startCount()
    reloadFull()
    initTestData()
})
const reloadFull = (isRefresh = false) => {
    // this.loadingBg = isRefresh ? 'transparent' : 'white'
    data.temp.refreshMode = 1
    reload()
}

const reload = () => {
    data.temp.isReloading = true
    let zone = proxy.$storage.get('selectedZone')
    // let location = this.localStorage.getLocation()

    // let lastSelectedCity = zone && ((zone.city && zone.city.name) || (zone.province && zone.province.name))
    let lastSelectedCity = zone && zone.organization && zone.organization.name
    if (lastSelectedCity) {
        data.selectedCity = lastSelectedCity
    }

    showLoading()

    // let organization = this.localStorage.get('organization') || environment.organization
    let organization = getOrganization()
    console.log(`current organization=${organization}`)

    let lastOrganization = proxy.$storage.get('lastOrganization')
    console.log(`lastOrganization=${lastOrganization}`)
    //如果链接中的organization和上一次选择的不一样，则清空已选的zone，重新查询
    if (lastOrganization != organization) {
        proxy.$storage.remove('selectedZone')
    }
    proxy.$storage.set('lastOrganization', organization)

    zoneService
        .query(organization)
        .then((result) => {
            if (!result) {
                queryEmpty()
                return
            }
            let zone = result.zone
            let value = result.zones || []
            // let value = []

            if (organization && !zone) {
                queryEmpty()
                return
            }
            if (!zone && value.length == 0) {
                queryEmpty()
                return
            }
            let lastSelectedZone = proxy.$storage.get('selectedZone')
            // let city = this.getLocationCity()

            let lastZone //上一次选择的城市对应的已开通城市Zone
            let operateZone = zone //  organizationId 所设置的运营地区，如果存在
            // let locationZone //定位城市对应的已开通城市Zone
            let defaultZone //默认城市对应的已开通城市Zone
            let selectedZone //最终确定的城市选择

            value &&
                value.forEach((item) => {
                    if (lastSelectedZone && item.name.indexOf(lastSelectedZone.name) != -1) {
                        lastZone = item
                    }
                    if (zone && zone.id == item.id) {
                        operateZone = item
                    }
                    // if (item.name.indexOf(city) != -1) {
                    //     locationZone = item
                    // }
                    if (item.name.indexOf(defaultCity) != -1) {
                        defaultZone = item
                    }
                })

            // selectedZone = lastZone || locationZone || defaultZone || value[0]
            selectedZone = lastZone || operateZone || defaultZone || value[0]
            console.log('selectedZone', selectedZone)
            proxy.$storage.set('selectedZone', selectedZone)
            data.zoneList = value
            switchCity(selectedZone)
        })
        .catch((err) => {
            console.log(err)
            queryError(err && err.msg)
        })
}
const queryFinish = () => {
    console.log('queryFinish')
    switch (data.temp.refreshMode) {
        case 1:
            // this.zwLoading.hide()
            hideLoading()
            break
        case 2:
            // wx.stopPullDownRefresh() //停止下拉刷新
            break
    }
    data.temp.isReloading = false
}

const queryError = (error) => {
    console.log('queryError error=' + error)
    if (error == 'invaild argument:id' || error == 'invaild argument:zone') {
        queryEmpty()
        return
    }
    switch (data.temp.refreshMode) {
        case 1:
            if (!data.temp.zoneView) {
                data.loadingBg = 'white'
                // this.zwLoading.showError()
                hideLoading()
                data.temp.zoneView = undefined
            } else {
                Toast('网络异常')
                queryFinish()
            }
            break
        case 2:
            // wx.stopPullDownRefresh() //停止下拉刷新
            break
    }
    data.temp.isReloading = false
}
const queryEmpty = () => {
    queryFinish()
    temp.zoneView = undefined
}

const getOrganization = () => {
    let organization = proxy.$storage.get('organization')
    if (!organization) {
        organization = config.organization
    }
    return organization
}
const switchCity = (zone) => {
    // console.log('switchCity', zone)
    // this.selectedCity = zone && ((zone.city && zone.city.name) || (zone.province && zone.province.name))
    data.selectedCity = zone && zone.organization && zone.organization.name
    fetch(zone)
    initShareInfo(zone)
    // this.getSplashConfig(zone)
}
const initShareInfo = (zone) => {
    try {
        data.shareDetails = {
            id: zone.organization.id,
            photo: pictureService.compressPicture(zone.organization.photo, { width: 120 }),
            name: zone.organization.name,
            content: '',
        }
    } catch (error) {
        console.log('initShareInfo err', error)
    }
}

const fetch = (zone) => {
    // this.showLoading()
    showLoading()

    zoneService
        .fetch(zone.id, zone.organization.id)
        .then((result) => {
            if (!result) {
                queryEmpty()
                return
            }
            updateUI(result)
            queryFinish()
        })
        .catch((err) => {
            console.log(err)
            queryError(err && err.msg)
        })
}

const updateUI = (zoneView) => {
    data.temp.zoneView = zoneView

    //如果广告配置为空，则提示首页未配置
    let adLength = (zoneView.home && Object.keys(zoneView.home).length) || 0
    if (adLength == 0) {
        queryEmpty()
        return
    }
    disposeConfig(zoneView.home)

    let category =
        (zoneView.directorys &&
            zoneView.directorys.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })) ||
        []
    data.categoryList = category
    initTabs()

    let news =
        (zoneView.news &&
            zoneView.news.map((item) => {
                return newsService.getItem(item)
            })) ||
        []

    let count = data.perCountNews * 2
    if (news.length < data.perCountNews) {
        count = news.length
    }
    let tab = data.tabs[0]
    tab.noData = news.length == 0
    tab.list = news
    tab.totalCount = count
    tab.isReloading = false
    tab.isLoadingMore = false
    tab.isNoMoreShow = false

    console.log(zoneView.applications)
    let app = []
    if (zoneView.applications) {
        let list = zoneView.applications.map((item) => {
            return {
                id: item.id,
                name: item.name,
                icon: pictureService.getPicture(item.photo, {}),
                page: item.uri,
                authorize: item.authorize,
                client: item.client && item.client.code,
            }
        })
        if (list.length > 4) {
            app = list.slice(0, 4)
        } else {
            app = list
        }
    }
    console.log(app)

    data.modules = app.concat(defaultModules)
    if (data.notice) {
        showNotice(true)
    }

    window.scrollTo(0, 0)
}
const showNotice = (isShow) => {
    data.isNoticeShow = isShow
}
const disposeConfig = (config) => {
    // 09964862-bb87-4efe-baab-e37c3a822e79	HomeCategory_Profile_Ad5	赣动热点
    // 0fe91f23-f7a2-4b65-9ad5-7f034a640229	HomeCategory_Profile_Ad2	弹出广告
    // 3055b33f-15db-45c3-b4fe-b643eba7a46d	HomeCategory_Profile_Ad4	横幅广告
    // 56a5531a-019e-496c-a901-3bbf4234cbca	HomeCategory_Profile_Ad3	轮播广告
    // b5b90e67-3551-4968-bb8f-7aa43ceea3a8	HomeCategory_Profile_Ad6	优质企业
    // e1a0cb80-4006-4fda-ba59-1864590c7ca3	HomeCategory_Profile_Ad1	开屏广告

    console.log(config)

    // initNotice(config && config['HomeCategory_Profile_Ad2'])
    // initAd(config && config['HomeCategory_Profile_Ad4'])
    // initBanner(getBannerList(config && config['HomeCategory_Profile_Ad3']))
    // initCompany(getCompanyList(config && config['HomeCategory_Profile_Ad6']))
    // initHot(config && config['HomeCategory_Profile_Ad5'])

    // initSplashAd(config && config['HomeCategory_Profile_Ad1'])
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
const tabRefresh = () => {
    console.log('home tabRefresh')
}
const search = () => {
    proxy.$router.push('/home/search')
}

onActivated(() => {
    console.log('home onActivated')
})
onDeactivated(() => {
    console.log('home onDeactivated')
})
onUnmounted(() => {
    console.log('home onUnmounted')
})
const initTabs = () => {
    let tabs = [
        {
            name: '最新资讯',
            list: [],
            //是否重新加载
            isReloading: false,
            //是否在加载更多
            isLoadingMore: false,
            //是否显示已无更多
            isNoMoreShow: false,
            //当前条件下的总数量
            totalCount: 0,
            noData: false,
        },
    ]
    data.categoryList.forEach((item) => {
        tabs.push({
            id: item.id,
            name: `${item.name}`,
            list: [],
            //是否重新加载
            isReloading: false,
            //是否在加载更多
            isLoadingMore: false,
            //是否显示已无更多
            isNoMoreShow: false,
            //当前条件下的总数量
            totalCount: 0,
            noData: false,
        })
    })
    data.tabs = tabs
    data.currentPage = 0
    let sliderWidth = parseInt(`${0.84 * window.innerWidth}`) / 3.5
    let sliderBarMarginLeft = (sliderWidth - data.sliderBarWidth) / 2

    data.sliderWidth = sliderWidth
    data.sliderBarMarginLeft = sliderBarMarginLeft
    switchTabNews(data.currentPage)
}
const tabClick = (event, index) => {
    updateTab(event.currentTarget.offsetLeft, index)

    // if (!this.tabItem) {
    //     return
    // }
    // let scrollToId = 'tab-' + (index - 2 >= 0 ? index - 2 : 0)
    // try {
    //     //滚动到选中的位置
    //     this.scrollIntoView(this.tabItem, scrollToId)
    // } catch (err) {
    //     console.log('scrollToSelections err', err)
    // }
    loadNews(index, { start: 0 })
}

const updateTab = (offsetLeft, index) => {
    data.sliderOffset = offsetLeft
    data.currentPage = index
}
const switchTabNews = (index) => {
    updateTab(data.sliderWidth * index, index)
}
const loadNews = (index, config) => {}
const initCategoryList = () => {
    data.categoryList = []
    data.categoryList.push({ name: '最新资讯' })
    data.categoryList.push({ name: '省联要闻' })
    data.categoryList.push({ name: '商会动态' })
    data.categoryList.push({ name: '市县动态' })
    data.categoryList.push({ name: '市县动态' })
    data.categoryList.push({ name: '市县动态' })
    data.categoryList.push({ name: '市县动态' })
    initTabs()
}
const initTestData = () => {
    data.ad1List = [
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            url: '',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            url: '',
        },
    ]
    data.ad2List = [
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            url: '',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            url: '',
        },
    ]
    data.news = [
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '陶行知教育基金会健康水计划项目走进于都县',
            time: '2020年6月12日',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '陶行知教育基金会健康水计划项目走进于都县',
            time: '2020年6月12日',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '陶行知教育基金会健康水计划项目走进于都县',
            time: '2020年6月12日',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '陶行知教育基金会健康水计划项目走进于都县',
            time: '2020年6月12日',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '陶行知教育基金会健康水计划项目走进于都县',
            time: '2020年6月12日',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '陶行知教育基金会健康水计划项目走进于都县',
            time: '2020年6月12日',
        },
    ]

    let banner = [
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            // video: 'http://img.ksbbs.com/asset/Mon_1703/d30e02a5626c066.mp4',
            // video: 'https://api.ykhcn.net/Upload/File/House1/Project/20200210/99aa351def4a47679e0515c85a3c8dfb.mp4',
            url: '',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            // video: 'https://api.ykhcn.net/Upload/File/House1/Project/20200210/99aa351def4a47679e0515c85a3c8dfb.mp4',
            url: '',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            video: '',
            url: '',
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            video: '',
            url: '',
        },
    ]

    let companies = [
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '天意医疗器械有限公司',
            tags: ['上市企业', '机械制造'],
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '天意医疗器械有限公司',
            tags: ['上市企业', '机械制造'],
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '天意医疗器械有限公司',
            tags: ['上市企业', '机械制造'],
        },
        {
            photo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0',
            name: '天意医疗器械有限公司',
            tags: ['上市企业', '机械制造'],
        },
    ]
    // initBanner(banner)
    // initCompany(companies)

    // let photo =
    //     'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F24%2F20141124141946_mB3aa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621059910&t=58a8341e384d218dbf5818b5b1b4b7e0'
    // let video = 'https://api.ykhcn.net/Upload/File/House1/Project/20200210/99aa351def4a47679e0515c85a3c8dfb.mp4'
    // let videoLive = 'http://39.134.157.205/PLTV/88888888/224/3221225580/index.m3u8'

    // initHotVideoPlayer(photo, video)

    initCategoryList()

    data.modules = [].concat(defaultModules)

    data.temp.zoneView = {}
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    // overflow-y: scroll;
    // overflow-x: hidden;
    // -webkit-overflow-scrolling: touch;

    .search-container {
        flex-shrink: 0;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        background-color: white;

        position: relative;
        z-index: 100;
        position: -webkit-sticky;
        position: -moz-sticky;
        top: 0;
        position: sticky;

        .city {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            overflow: hidden; //文本单行显示省略号的关键
            margin-left: 18px;
            margin-right: 6px;

            span {
                font-size: 18px;
                font-weight: bold;
                word-break: break-all;
                text-overflow: ellipsis; //文本单行显示省略号的关键
                white-space: nowrap; //文本单行显示省略号的关键
                overflow: hidden; //文本单行显示省略号的关键
                text-align: center;
                color: #262626;
            }
            > div {
                flex-shrink: 0;
                margin-left: 6px;
                position: relative;
                width: 9px;
                height: 5px;

                &:after {
                    border: 5px solid transparent;
                    border-top: 5px solid #737373;
                    width: 0;
                    height: 0;
                    position: absolute;
                    right: 0px;
                    content: ' ';
                }
            }
        }
        .search {
            margin-left: 18px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                flex-shrink: 0;
                width: 30px;
                height: 30px;
            }
        }
        .scan {
            flex-shrink: 0;
            margin-left: 18px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                flex-shrink: 0;
                width: 30px;
                height: 30px;
            }
        }
    }

    .none {
        position: fixed;
        top: 50px;
        left: 0;
        top: 0;
        bottom: 56px;
        right: 0;
        z-index: 99;
        background: #f4f5f6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            width: 315px;
            height: 216px;
        }

        p {
            color: #616b7a;
            font-size: 15px;
            line-height: 24px;
            text-align: center;
            margin-top: 12px;
            margin-bottom: 40px;
        }
    }

    .module {
        flex-shrink: 0;
        box-sizing: border-box;
        overflow: hidden;
        padding: 0 12px;
        margin: 10px 0 10px;

        .module-cell {
            float: left;
            box-sizing: border-box;
            width: 25%;
            border: 4px solid transparent;
            border-top: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 12px 0;
            img {
                width: 48px;
                height: 48px;
            }

            p {
                margin-top: 8px;
                color: #464646;
                font-size: 12px;
            }
        }
    }
}
</style>
