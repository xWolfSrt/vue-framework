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
        <div class="none" v-if="!data.temp.isReloading && !data.temp.zoneView">
            <img :src="getAssetsFile('common/icon_data_empty.png')" />
            <p>门户暂未开通，请联系管理员</p>
        </div>

        <div class="swiper-container-home-banner" v-if="data.banner">
            <swiper
                :modules="[Autoplay, A11y]"
                :slides-per-view="1"
                :space-between="0"
                :autoplay="{ delay: 3000, stopOnLastSlide: false, disableOnInteraction: false }"
                :loop="true"
                @swiper="onBannerSwiper"
                @slideChange="onBannerSlideChange"
                @click="onBannerClick"
            >
                <swiper-slide v-for="(item, index) in data.banner" :key="index">
                    <div class="banner-image">
                        <img :src="item.photo" />
                    </div>
                </swiper-slide>
            </swiper>
            <div class="custom-swiper-pagination">
                <div v-for="(item, i) in data.banner" :key="i" :class="{ selected: data.currentBanner == i }"></div>
            </div>
        </div>

        <div class="module">
            <div class="module-cell" v-for="(item, index) in data.modules" :key="index" @click="moduleClick(item)">
                <img :src="item.icon" />
                <span>{{ item.name }}</span>
            </div>
        </div>

        <div class="hot" v-if="data.adHot">
            <div class="part-head">
                <div></div>
                <span>赣动热点</span>
            </div>
            <div class="hot-video-container" :style="{ height: data.hotVideoHeight }" id="hotvideocontainer">
                <div id="video_hot" style="flex-shrink: 0" ref="hotplayer"></div>

                <div class="video-full-back" v-if="data.temp.isFullScreen">
                    <img :src="getAssetsFile('icon_back_white.png')" @click="cancelFullScreen()" />
                </div>
            </div>
        </div>
        <div class="ad" v-if="data.ad1List && data.ad1List.length > 0">
            <img :src="data.ad1List[0].photo" @click="adClick(ad1List[0])" />
            <img v-if="data.ad1List[1]" :src="data.ad1List[1].photo" @click="adClick(data.ad1List[1])" />
        </div>

        <div class="company" v-if="data.companies">
            <div class="part-head">
                <div></div>
                <span>优质企业</span>
                <span v-if="data.companies && data.companies.length > 0"
                    >{{ 1 + data.currentCompany }}/{{ (data.companies && data.companies.length) || 0 }}</span
                >
            </div>

            <div class="swiper-container-home-company">
                <swiper
                    :modules="[Autoplay, A11y]"
                    :slides-per-view="1"
                    :space-between="0"
                    :autoplay="{ delay: 3000, stopOnLastSlide: false, disableOnInteraction: false }"
                    :loop="true"
                    @swiper="onCompanySwiper"
                    @slideChange="onCompanySlideChange"
                    @click="onCompanyClick"
                >
                    <swiper-slide v-for="(item, index) in data.companies" :key="index">
                        <div class="company-item">
                            <img :src="item.photo" />
                            <div>
                                <span class="company-name"> {{ item.name }}</span>
                                <div class="company-tags">
                                    <span v-for="(tag, i) in item.tags" :key="i">{{ tag }}</span>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div class="ad" v-if="data.ad2List && data.ad2List.length > 0">
            <img :src="data.ad2List[0].photo" @click="adClick(ad2List[0])" />
            <img v-if="data.ad2List[1]" :src="data.ad2List[1].photo" @click="adClick(data.ad2List[1])" />
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
        <van-tabs v-model:active="data.currentPage" @change="tabClick" swipeable shrink v-if="data.tabs && data.tabs.length > 0">
            <van-tab v-for="(tab, page) in data.tabs" :title="tab.name">
                <div class="news" v-if="page == data.currentPage">
                    <div class="news-list" v-if="!tab.noData">
                        <div class="news-container">
                            <!-- <portal-news-item
                        *ngFor="let item of tab.list; let index = index"
                        [item]="item"
                        [page]="page"
                        [index]="index"
                        (itemClick)="newsItemClick($event)"
                    >
                    </portal-news-item> -->
                            <NewsItem
                                v-for="(item, index) in tab.list"
                                :key="index"
                                :item="item"
                                :page="page"
                                :index="index"
                                @itemClick="newsItemClick"
                            ></NewsItem>
                        </div>
                        <div class="news-reloading" v-if="tab.isReloading">
                            <img :src="getAssetsFile('icon_loading_circle.gif')" style="width: 30px; height: 30px" />
                        </div>
                        <div class="news-loadingMore" v-if="tab.isLoadingMore">
                            <img :src="getAssetsFile('icon_loading_circle.gif')" />
                            <p>正在加载...</p>
                        </div>
                        <div class="news-nomore" v-if="tab.isNoMoreShow">已无更多</div>
                    </div>

                    <div class="news-none" v-if="tab.noData">
                        <img :src="getAssetsFile('common/icon_data_empty.png')" />
                        <p>暂无相关数据</p>
                    </div>
                </div>
            </van-tab>
        </van-tabs>

        <div style="width: 100%; height: 56px; flex-shrink: 0"></div>
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
import { Toast, Tab, Tabs } from 'vant'
import DPlayer from 'dplayer'
import Tabbar from '../../components/Tabbar.vue'
import NewsItem from '../news/NewsItem.vue'
import getAssetsFile from '../../utils/pub-use'
import zoneService from '../../api/zone'
import newsService from '../../api/news'
import config from '../../config'
import pictureService from '../../utils/picture-service'
import dateService from '../../utils/date-service'

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, Autoplay, A11y } from 'swiper'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'
import 'swiper/css/autoplay'

const { proxy } = getCurrentInstance()
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

    swiperBanner: undefined,
    banner: undefined,
    currentBanner: 0,

    swiperCompany: undefined,
    currentCompany: 0,
    companies: undefined,

    dplayer: undefined,
    adHot: undefined,
    hotVideoHeight: '12.125rem',

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
    updateHotVideoHeight()
    reloadFull()
    // initTestData()
})
const updateHotVideoHeight = () => {
    setTimeout(() => {
        console.log(window.baseFontSize)
        try {
            let width = window.innerWidth
            let paddingWidth = 36 * (window.baseFontSize / 16)
            let hotVideoWidth = width - paddingWidth
            console.log(hotVideoWidth)
            data.hotVideoHeight = (hotVideoWidth * 9) / 16 / window.baseFontSize + 'rem'
        } catch (error) {}
    }, 100)
}
const searchClick = () => {}
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

    initNotice(config && config['HomeCategory_Profile_Ad2'])
    initAd(config && config['HomeCategory_Profile_Ad4'])
    initBanner(getBannerList(config && config['HomeCategory_Profile_Ad3']))
    initCompany(getCompanyList(config && config['HomeCategory_Profile_Ad6']))
    initHot(config && config['HomeCategory_Profile_Ad5'])

    initSplashAd(config && config['HomeCategory_Profile_Ad1'])
}
const initNotice = (_data) => {
    let config = _data && JSON.parse(_data)
    let notice
    let pops =
        (config &&
            config.pop &&
            config.pop.filter((item) => {
                let now = new Date()
                let start = item.start && dateService.convert(item.start)
                let end = item.end && dateService.convert(item.end)
                let isExpire = false //不在时间范围内不显示
                if (start && end && (now.getTime() > end.getTime() || now.getTime() < start.getTime())) {
                    isExpire = true
                }
                return item.enable && !isExpire
            })) ||
        []

    if (pops && pops.length > 0) {
        let list = pops
        let index = Math.floor(Math.random() * list.length) //随机取出一个
        let pop = list[index]

        let photo = pop.photo
        if (photo) photo = pictureService.compressPicture(photo, { width: parseInt(window.innerWidth * 0.9 + '') })
        let width = parseInt(window.innerWidth * 0.8 + '')
        let height = parseInt(window.innerWidth * 0.8 * 1.25 + '') //w:h=1:1.25

        if (window.innerWidth > window.innerHeight) {
            //说明是横向页面
            width = window.innerHeight * 0.5
            height = parseInt(window.innerHeight * 0.5 * 1.25 + '') //w:h=1:1.25
        }
        notice = {
            photo: photo,
            photoWidth: width,
            photoHeight: height,
            url: pop.uri,
            category: pop.category,
        }
    }
    data.notice = notice
    console.log(data.notice)
}
const initSplashAd = (result) => {
    proxy.$storage.set('splash', (result && JSON.parse(result)) || undefined)
}
const initAd = (_data) => {
    console.log('initAd', _data)

    let config = _data && JSON.parse(_data)
    let list1 = []
    let list2 = []
    if (config && config.banner && config.banner.length > 0) {
        let ads =
            config.banner.filter((banner) => {
                let now = new Date()
                let start = banner.start && dateService.convert(banner.start)
                let end = banner.end && dateService.convert(banner.end)
                let isExpire = false //不在时间范围内不显示
                if (start && end && (now.getTime() > end.getTime() || now.getTime() < start.getTime())) {
                    isExpire = true
                }
                return banner.enable && !isExpire
            }) || []
        ads.forEach((ad) => {
            let group = ad.group

            let item = {
                photo: ad.photo && pictureService.compressPicture(ad.photo, { width: window.innerWidth }),
                url: ad.uri,
                category: ad.category, //Outside  or  Inside
            }
            if (group == '1') {
                if (list1.length < 2) {
                    list1.push(item)
                }
            } else {
                if (list2.length < 2) {
                    list2.push(item)
                }
            }
        })
    }
    data.ad1List = list1
    data.ad2List = list2
}

const initBanner = (list) => {
    //1--先清除绑定，回收swiper
    data.banner = undefined
    data.swiperBanner = undefined
    //2--延迟刷新列表，确保swiper已经回收了
    setTimeout(() => {
        data.banner = list
        //  this.bannerHeight = parseInt(vm.getScreenW() * 0.95 * 0.7 + '')
    }, 500)
    //3--需要swiper组件渲染之后，延迟初始化Swiper控制类,如果Swiper在绑定item数据前初始化(new)，会导致
    //无法滑动且不能循环，而且需要setTimeout延时执行，否则也会失效
    setTimeout(() => {
        initBannerSwiper()
        data.currentBanner = 0
    }, 1000)
}

const initBannerSwiper = () => {}

const onBannerSwiper = (swiper) => {
    console.log(swiper)
    data.swiperBanner = swiper
}
const onBannerSlideChange = (event) => {
    // console.log('slide banner change', event)
    data.currentBanner = parseInt(event.realIndex)
}
const onBannerClick = (event) => {
    // console.log('slide banner click', event)
    bannerClick(data.currentBanner)
}
const bannerClick = (index) => {
    let item = data.banner[index]
    // this.globalService.getNavigateLink(item.url, item.category)
    // this.uploadBehaviorAd('首页优质企业', item.url)
}

const getBannerList = (_data) => {
    let config = _data && JSON.parse(_data)

    let list = []
    if (config && config.poster) {
        config.poster.forEach((item) => {
            let now = new Date()
            let start = item.start && dateService.convert(item.start)
            let end = item.end && dateService.convert(item.end)
            let isExpire = false //不在时间范围内不显示
            if (start && end && (now.getTime() > end.getTime() || now.getTime() < start.getTime())) {
                isExpire = true
            }
            if (item.enable && !isExpire) {
                list.push({
                    photo: item.photo && pictureService.compressPicture(item.photo, { width: parseInt(window.innerWidth * 0.95 + '') }),
                    url: item.uri,
                    video: item.video,
                    category: item.category, //Outside  or  Inside
                })
            }
        })
    }
    console.log(list)
    return list
}

const initCompany = (list) => {
    //1--先清除绑定，回收swiper
    data.companies = undefined
    data.swiperCompany = undefined
    //2--延迟刷新列表，确保swiper已经回收了
    setTimeout(() => {
        data.companies = list
        //  this.bannerHeight = parseInt(vm.getScreenW() * 0.95 * 0.7 + '')
    }, 500)
    //3--需要swiper组件渲染之后，延迟初始化Swiper控制类,如果Swiper在绑定item数据前初始化(new)，会导致
    //无法滑动且不能循环，而且需要setTimeout延时执行，否则也会失效
    setTimeout(() => {
        initCompanySwiper()
        data.currentCompany = 0
    }, 1000)
}

const initCompanySwiper = () => {}

const onCompanySwiper = (swiper) => {
    console.log(swiper)
    data.swiperCompany = swiper
}
const onCompanySlideChange = (event) => {
    // console.log('slide company change', event)
    data.currentCompany = parseInt(event.realIndex)
}
const onCompanyClick = (event) => {
    // console.log('slide company click', event)
    companyClick(data.currentCompany)
}
const companyClick = (index) => {
    let item = data.companies[index]
    // this.globalService.getNavigateLink(item.url, item.category)
    // this.uploadBehaviorAd('首页优质企业', item.url)
}
const getCompanyList = (_data) => {
    let config = _data && JSON.parse(_data)

    let list = []
    if (config && config.highQuality) {
        config.highQuality.forEach((item) => {
            if (item.enable) {
                list.push({
                    name: item.name,
                    tags: item.tag && JSON.parse(item.tag),
                    photo: item.photo && pictureService.compressPicture(item.photo, { width: parseInt(window.innerWidth * 0.95 + '') }),
                    url: item.uri,
                    category: item.category, //Outside  or  Inside
                })
            }
        })
    }
    console.log(list)
    return list
}
const initHot = (_data) => {
    let config = _data && JSON.parse(_data)
    let selectedAdHot

    if (config && config.adHot && config.adHot.length > 0) {
        let adHot =
            config.adHot.filter((item) => {
                let now = new Date()
                let start = item.start && dateService.convert(item.start)
                let end = item.end && dateService.convert(item.end)
                let isExpire = false //不在时间范围内不显示
                if (start && end && (now.getTime() > end.getTime() || now.getTime() < start.getTime())) {
                    isExpire = true
                }
                return item.enable && !isExpire
            }) || []

        if (adHot.length > 0) {
            selectedAdHot = adHot[0]
            initHotVideoPlayer(
                selectedAdHot.photo && pictureService.compressPicture(selectedAdHot.photo, { width: window.innerWidth }),
                selectedAdHot.uri
            )
        }
    }
    if (!selectedAdHot && data.dplayer) {
        data.dplayer.destroy()
    }
    data.adHot = selectedAdHot
}
const initHotVideoPlayer = (photo, video) => {
    setTimeout(() => {
        let id = `video_hot`

        video = video && video.replace('http:', 'https:')

        console.log(document.getElementById(`${id}`))
        //https://upload.gsdl.top/release/upload/platform_profile_information/97cacb14-e3fa-4905-8568-8e1272fca713/0d0ace9e-8eb0-4ff1-819a-7567ed3d3211.mp4
        let videoObject = {
            container: proxy.$refs.hotplayer,
            screenshot: false,
            live: false,
            preload: 'none',
            theme: '#21c179',
            hotkey: false,
            video: {
                url: video,
                pic: photo,
                thumbnails: photo,
                // index静态引入hls后，不需要这么写，如果这么写，只能播放hls视频，mp4等会报错
                // type: 'customHls',
                // customType: {
                //     customHls: function (video, player) {
                //         const hls = new Hls()
                //         hls.loadSource(video.src)
                //         hls.attachMedia(video)
                //     },
                // },
            },
        }

        let videoObjectLive = {
            container: document.getElementById(`${id}`),
            screenshot: false,
            live: true,
            theme: '#21c179',
            video: {
                url: video,
                type: 'hls',
                pic: photo,
                thumbnails: photo,
            },
            // danmaku: {
            //     id: '9E2E3368B56CDBB4',
            //     api: 'https://api.prprpr.me/dplayer/',
            //     token: 'tokendemo',
            //     maximum: 1000,
            //     addition: ['https://api.prprpr.me/dplayer/v3/?id=9E2E3368B56CDBB4'],
            //     user: 'DIYgod',
            //     bottom: '15%',
            //     unlimited: true,
            // },
        }
        console.log(videoObject)
        let player = new DPlayer(videoObject)
        player.on('fullscreen', () => {
            console.log('player fullscreen')
            data.temp.isFullScreen = true
        })
        // player.on('seeked', function () {
        //     console.log('player seeked')
        //     console.log(player.video.currentTime)
        // })
        // player.on('timeupdate', function () {
        //     console.log('player timeupdate')
        //     console.log(player.video.currentTime)
        // })
        player.on('fullscreen_cancel', () => {
            console.log('player fullscreen_cancel')
            data.temp.isFullScreen = false
        })
        player.on('webfullscreen', () => {
            console.log('player webfullscreen')
            data.temp.isFullScreen = true

            data.dplayer.fullScreen.request('browser')
        })
        player.on('webfullscreen_cancel', function () {
            console.log('player webfullscreen_cancel')
            data.temp.isFullScreen = false
        })
        data.dplayer = player
    }, 500)
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

    if (data.temp.zoneView) {
        reloadFull(true)
    } else {
        reloadFull(false)
    }
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
const tabClick = (event) => {
    console.log(event)
    // updateTab(event.currentTarget.offsetLeft, index)

    loadNews(event, { start: 0 })
}

const updateTab = (offsetLeft, index) => {
    data.sliderOffset = offsetLeft
    data.currentPage = index
}
const switchTabNews = (index) => {
    // updateTab(data.sliderWidth * index, index)
}
const loadNews = (index, config) => {
    let isReloading = config && config.start == 0

    //如果是重新加载且当前正在reload,则取消
    if (isReloading && data.tabs[index].isReloading) return

    let tabs = data.tabs
    let tab = tabs[index]

    tab.isReloading = isReloading
    tab.isLoadingMore = !isReloading
    if (isReloading) {
        // tab.list = [];
        tab.isNoMoreShow = false
        // tab.totalCount = 0
        tab.noData = false
    }

    let zone = proxy.$storage.get('selectedZone')
    console.log(zone)

    let directory = tab.id
    let lambda =
        'item.getEnable()&&item.getIdInfo().getEnable()&&item.getDirectoryInfo().getEnable()&&item.getDirectoryInfo().getCategoryInfo().getCode()=="DirectoryCategory_Profile_Information"'
    // let lambda =
    //     'item.getDirectoryInfo().getEnable()&&item.getDirectoryInfo().getCategoryInfo().getCode()=="DirectoryCategory_Profile_Information"'

    if (directory) {
        lambda = lambda.concat(`&&item.getDirectory()==\"${directory}\"`)
    }
    if (zone) {
        lambda = lambda.concat(`&&item.getDirectoryInfo().getOrganization()==\"${zone.organization.id}\"`)
    }
    let pager = {
        start: isReloading ? 0 : tab.list.length,
        limit: data.perCountNews,
        filter: `sql->sql.where(item-> ${lambda})`,
        navigations: [],
        // sorter: 'sql->sql.orderby(item->item.getAddTime(),false)',
        sorter: 'sql->sql.orderby(item->item.getIdInfo().getTop(),false).orderby(item->item.getAddTime(),false)',
    }
    newsService
        .query(pager)
        .then((result) => {
            if (!result) {
                queryErrorNews(index)
                return
            }
            let count = result.count
            let value = result.list || []
            let tab = data.tabs[index]
            let newList = tab.list
            if (tab.isReloading) newList = []
            let isNoMoreShow = false

            if (value.length > 0) Array.prototype.push.apply(newList, newsService.getList(value))

            //当前列表数量超过一页,且等于最大数量则显示已无更多
            if (newList.length >= 10 && newList.length >= count) isNoMoreShow = true

            tab.noData = newList.length == 0
            tab.list = newList
            tab.totalCount = count
            tab.isReloading = false
            tab.isLoadingMore = false
            tab.isNoMoreShow = isNoMoreShow
        })
        .catch((err) => {
            queryErrorNews(index)
        })
}
const queryErrorNews = (index) => {
    console.log('queryFinish')
    let tabs = data.tabs
    let tab = tabs[index]

    if (tab.isReloading && tab.list && tab.list.length == 0) tab.noData = true
    tab.isReloading = false
    tab.isLoadingMore = false
    Toast('加载失败')
}

const newsItemClick = (event) => {
    console.log(event)
}
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
    .part-head {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 16px 18px;
        box-sizing: border-box;
        div {
            flex-shrink: 0;
            background: #00ecff;
            width: 4px;
            height: 16px;
        }
        span:nth-of-type(1) {
            flex: 1;
            margin-left: 8px;
            color: #303030;
            font-weight: bold;
            font-size: 16px;
        }

        span:nth-of-type(2) {
            flex-shrink: 0;
            color: #acacac;
            font-size: 12px;
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

    .swiper-container-home-banner {
        flex-shrink: 0;
        width: 100%;
        overflow: hidden;
        position: relative;
        margin-top: 8px;

        .banner-image {
            width: 100%;
            height: 150px;
            border: 18px solid transparent;
            box-sizing: border-box;
            border-bottom: 0;
            border-top: 0;

            img {
                width: 100%;
                height: 100%;
                // animation: fadeIn 1s both;
                // border: .01rem solid rgba(220, 220, 220, 0.3);
                box-sizing: border-box;
                background: white;
                border-radius: 4px;
                object-fit: cover;
            }
        }
        .custom-swiper-pagination {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 100;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 16px;
            div {
                height: 4px;
                width: 23px;
                background: white;
                margin: 0 2px;
                opacity: 0.6;
                // transition: width 0.3s;
                // -moz-transition: width 0.3s;
                // -webkit-transition: width 0.3s;
                // -o-transition: width 0.3s;

                &.selected {
                    background: white;
                    opacity: 1;
                }
            }
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

            span {
                margin-top: 8px;
                color: #464646;
                font-size: 12px;
            }
        }
    }

    .hot-video-container {
        flex-shrink: 0;
        width: 100%;
        height: 194px;
        padding: 0 18px;
        box-sizing: border-box;

        #video_hot {
            width: 100%;
            height: 100%;
            border-radius: 0.04rem;
        }
        ::v-deep .dplayer-setting {
            display: none;
        }

        ::v-deep .dplayer-full-icon {
            display: none;
        }

        ::v-deep .dplayer-bar-preview {
            visibility: hidden;
        }

        // ::ng-deep .dplayer-video {
        //     object-fit: cover;
        // }

        .video-full-back {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1000000;
            display: flex;
            align-items: center;
            height: 64px;

            img {
                flex-shrink: 0;
                width: 16px;
                height: auto;
                padding: 12px;
                margin-left: 6px;
            }
        }
    }
    .ad {
        flex-shrink: 0;
        margin: 16px 0 8px;
        width: 100%;
        height: 76px;
        padding: 0 18px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
            flex-shrink: 0;
            width: 48.5%;
            height: 100%;
            // animation: fadeIn 1s both;
            border-radius: 4px;
            box-sizing: border-box;
            object-fit: cover;
        }
    }

    .swiper-container-home-company {
        flex-shrink: 0;
        width: 100%;
        overflow: hidden;
        position: relative;
        margin-top: 4px;

        .company-item {
            width: 100%;
            height: 100%;
            border: 18px solid transparent;
            box-sizing: border-box;
            border-bottom: 0;
            border-top: 0;
            display: flex;
            flex-direction: column;

            img {
                flex-shrink: 0;
                width: 100%;
                height: 160px;
                // animation: fadeIn 1s both;
                border: 1px solid rgba(220, 220, 220, 0.3);
                box-sizing: border-box;
                background: white;
                object-fit: cover;
                border-radius: 4px;
                overflow: hidden;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            > div {
                width: 100%;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: #f4f7fa;
                border-radius: 4px;
                overflow: hidden;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                box-sizing: border-box;
                padding: 8px 12px;

                .company-name {
                    font-size: 15px;
                    color: #393939;
                }

                .company-tags {
                    margin-top: 6px;
                    overflow: hidden;
                    height: 20px;
                    box-sizing: border-box;
                    > span {
                        float: left;
                        color: #ff7f1d;
                        font-size: 10px;
                        border: 1px solid #ffcc9f;
                        height: 20px;
                        padding: 0 4px;
                        margin-right: 4px;
                        border-radius: 4px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }

    .news {
        flex-shrink: 0;
        width: 100%;
        position: relative;
        .news-list {
            width: 100%;
            min-height: 360px;
            display: flex;
            flex-direction: column;
            position: relative;

            .news-container {
                flex-shrink: 0;
                margin-top: 0px;
                width: calc(100% - 36px);
                margin-left: 18px;
                box-sizing: border-box;
                overflow: hidden;
            }
            .news-reloading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 360px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .news-loadingMore {
                width: 100%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;

                img {
                    width: 20px;
                    height: 20px;
                }

                p {
                    margin-left: 6px;
                    color: #999;
                    font-size: 14px;
                }
            }
            .news-nomore {
                width: 100%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: #939393;
            }
        }

        .news-none {
            flex-shrink: 0;
            width: 100%;
            height: 360px;
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
                margin: 16px 0;
            }
        }
    }
}
</style>
