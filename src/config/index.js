// 环境配置
// 引入的时候 import config from "XXX/config";
const env = import.meta.env.MODE || 'prod'
const envConfig = {
    dev: {
        // baseApi: '/',
    },
    test: {
        // baseApi: '/',
    },
    prod: {
        // baseApi: '/',
    },
}
export default {
    namespace: 'live',
    contactPhone: '400-000-0001',
    isTest: true,
    defaultDomain: 'https://release.gsdl.top',
    env,
    ...envConfig,
}
