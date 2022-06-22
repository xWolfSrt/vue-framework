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
    env,
    ...envConfig,
}
