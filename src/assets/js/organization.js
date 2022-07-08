function getOrganizationParam(window, document) {
    try {
        console.log(`url=${window.location.href}`)
        console.log(`host=${window.location.host}`)
        // let folder = '/consumer'
        let folder = ''
        let url = window.location.href
        let localStorage = window.localStorage
        let organization = getOrganizationUrlParam(url, 'organization')
        console.log(`organization=${organization}`)
        let rootPath = window.location.protocol + '//' + window.location.host
        console.log(`rootPath=${rootPath}${folder}/`)

        if (url == `${rootPath}${folder}/` || url.indexOf(`${window.location.host}${folder}/?`) != -1) {
            console.log(`当前在根目录 organization=${organization}`)
            if (organization != null) {
                localStorage.setItem('gsdl_organization', JSON.stringify(organization))
            } else {
                localStorage.removeItem(`gsdl_organization`)
            }
        }
    } catch (error) {
        console.log(`getOrganizationParam error`, error)
    }
}
// 获取url中参数
function getOrganizationUrlParam(str, name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = str.substr(str.indexOf('?') + 1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}
getOrganizationParam(window, document)
