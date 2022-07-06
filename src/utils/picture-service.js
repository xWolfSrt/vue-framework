/**
 * 获取默认图片
 * @param {*} photo  图片json字符串  "[{\"Category\":null,\"Index\":0,\"Items\":[\"http://xxx/x.jpg\"]}]"
 * @param {*} config  图片压缩配置 { width: 100 , height: 100 , original: false } ，目标宽高，是否需要原图，需要原图的话，将返回对象列表 [{thumbnail: xx, url: xx}] ,否则只返回 图片列表 [xxx, xxx ]
 */
const getPicture = (photo, config) => {
    let picture = photo && toPicture(photo)
    return config ? compressPicture(picture, config) : picture
}

/**
 * 获取图片列表
 * @param {*} photo  图片json字符串  "[{\"Category\":null,\"Index\":0,\"Items\":[\"http://xxx/x.jpg\"]}]"
 * @param {*} needDefault  是否需要默认图片中的图片列表
 * @param {*} config  图片压缩配置 { width: 100 , height: 100 , original: false } ，目标宽高，是否需要原图，需要原图的话，将返回对象列表 [{thumbnail: xx, url: xx}] ,否则只返回 图片列表 [xxx, xxx ]
 */
const getPictures = (photo, needDefault = false, config) => {
    let pictures = photo && toPictures(photo, needDefault)
    return config ? compressPictures(pictures, config) : pictures
}

/**
 * 仅压缩图片
 * @param {*} photo 图片地址
 * @param {*} config  图片压缩配置 { width: 100 , height: 100 , original: false } ，目标宽高，是否需要原图，需要原图的话，将返回对象列表 [{thumbnail: xx, url: xx}] ,否则只返回 图片列表 [xxx, xxx ]
 */
const compressPicture = (photo, config) => {
    let picture
    if (photo && config) {
        let img = compress(photo, config.width || 0, config.height || 0)
        if (config.original) {
            picture = {
                thumbnail: img,
                url: photo,
            }
        } else {
            picture = img
        }
    }
    return picture || photo
}

/**
 * 仅压缩图片
 * @param {*} photos 图片列表地址
 * @param {*} config  图片压缩配置 { width: 100 , height: 100 , original: false } ，目标宽高，是否需要原图，需要原图的话，将返回对象列表 [{thumbnail: xx, url: xx}] ,否则只返回 图片列表 [xxx, xxx ]
 */
const compressPictures = (photos, config) => {
    let pictures
    if (photos && config) {
        pictures = photos.map((photo) => {
            let img = compress(photo, config.width || 0, config.height || 0)
            if (config.original) {
                return {
                    thumbnail: img,
                    url: photo,
                }
            } else {
                return img
            }
        })
    }
    return pictures || photos
}

/**
 * 获取图片
 * @param {*} photo 图片json字符串  "[{\"Category\":null,\"Index\":0,\"Items\":[\"http://xxx/x.jpg\"]}]"
 * @param {*} index 图片下标，默认取第一个
 * @returns
 */
const toPicture = (photo, index) => {
    let picture
    try {
        let pictures = JSON.parse(photo)

        if (!pictures) return
        pictures.forEach((item) => {
            if (item && (!item.Category || item.Category == null)) {
                picture = item
                return
            }
        })
    } catch (err) {
        console.log(err)
        return picture
    }
    return picture && (index < picture.Items.length ? picture.Items[index] : picture.Items[0])
}

const toPictures = (photo, needDefault = false) => {
    let list = []
    try {
        let pictures = JSON.parse(photo)

        pictures &&
            pictures.forEach((item) => {
                if (item && (needDefault || (item.Category && item.Category != null))) {
                    list = list.concat(item.Items)
                }
            })
    } catch (err) {
        console.log(err)
    }
    return list
}
const compress = (uri, width, height) => {
    let pixedRatio = window.devicePixelRatio || 2
    // Cos对象存储
    // let template
    // if (width == 0 && height == 0) {
    //     template = `imageView2/q/85/format/png` //https://cloud.tencent.com/document/product/460/6929
    // } else {
    //     template = `imageView2/2/w/${width * pixedRatio}/h/${height * pixedRatio}/q/85/format/png` //https://cloud.tencent.com/document/product/460/6929
    // }
    // console.log(template)

    // return `${uri.replace(this.constantService.cos.domain, this.constantService.cos.piccd)}?${template}`

    // 服务器裁剪
    // let windowWidth = Number(window.innerWidth)
    // if (config && config.ratio && windowWidth > 0 && width > 0)
    //     width = config.ratio ? Math.round((width * pixedRatio * windowWidth) / 750) : width

    // if (config && config.ratio && windowWidth > 0 && height > 0)
    //     height = config.ratio ? Math.round((height * pixedRatio * windowWidth) / 750) : height

    // let format = 'jpg'
    // let mode = 'high'
    // let stretch = 'uniform'
    // let compress = 90
    // return `${uri}?format=${format}&mode=${mode}&stretch=${stretch}&compress=${compress}&width=${width}&height=${height}`

    return uri
}
const test = () => {
    // import pictureService from '../../utils/picture-service'

    let photo =
        'http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg'
    let picture =
        '[{"Category":null,"Index":0,"Items":["http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg"]},{"Category":"abc","Index":0,"Items":["http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg","http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg","http://upload.lianma.tech/live/debug/debug/upload/platform_member_user/bb4b2fd90b3a4214af844231f22fc60b/8bf5d7f6c43f56013d5edf96f3f57c36.jpg"]}]'

    // console.log(pictureService.getPicture(picture))
    console.log(pictureService.getPicture(picture, { width: 100 }))
    console.log(pictureService.getPicture(picture, { width: 100, original: true }))
    // console.log(pictureService.getPictures(picture))
    console.log(pictureService.getPictures(picture, true, { width: 100 }))
    console.log(pictureService.getPictures(picture, true, { width: 100, original: true }))
    // console.log(pictureService.compressPicture(photo))
    // console.log(pictureService.compressPicture(photo, { width: 100 }))
}
export default {
    getPicture,
    getPictures,
    compressPicture,
}
