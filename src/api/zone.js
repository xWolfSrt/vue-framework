import http from '../utils/http/httpclient'

let { post } = http

// 客户端使用硬编码 organizationId 调用 /api/profile/zone/fetchSummaryResult 返回
// {
//     zone:{},
//     zones:[]
// }
// zone 为 organizationId 所设置的运营地区，即 organization 的 zone 字段。
// zones 为 匹配 organizationId 所返回的 zone 列表（organizationId 是其中某个 zone 的运营方即为匹配）。

// 若 zone == null 并且 zones == null，则表示 organizationId 所属机构既没有设置运营地区，也不是某个zone的运营方，那么，客户端无法显示门户，提示错误（“门户暂未开通，请联系管理员”之类）。
// 若 zone == null 但 zones != null，则表示 organizationId 所属机构既没有设置运营地区，但是某个zone的运营方，那么客户端呈现左上角的地区列表，并使用默认或切换的某个zones项目的字段作为参数去调用  /api/profile/home/listSummaryResult 获得首页配置
// 若 zone !=null 但 zones == null，则表示  organizationId 所属机构设置了运营地区，但不是某个zone的运营方，那么客户端不呈现左上角的地区列表，仅仅使用该zone的字段作为参数去调用  /api/profile/home/listSummaryResult 获得首页配置
// 若 zone !=null 并且 zones != null，则表示  organizationId 所属机构设置了运营地区，也是某个zone的运营方，那么，客户端在使用默认或切换的某个zones项目的字段作为参数去调用  /api/profile/home/listSummaryResult 获得首页配置时，需要比对是否等于 zone，等于则优先使用该zone

const query = (organization) =>
    post('/platform/api/profile/zone/fetchSummaryResult', {
        organization: organization,
    })

const fetch = (id, organization) =>
    post('/gsdl/api/gsmh/home/fetch', {
        zone: id,
        organization: organization,
    })

export default {
    query,
    fetch,
}
