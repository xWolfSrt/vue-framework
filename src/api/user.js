import http from '../utils/http/httpclient'
import pictureService from '../utils/picture-service'

let { get, post, getOriginal } = http
export const refreshToken = (token) =>
    get('/gateway/api/refresh', {
        token: token,
    })

//发送验证码
export const sendCaptcha = (phone) =>
    getOriginal('/gateway/api/verification/sms/fetch', {
        account: phone,
        token: phone,
    })
export const validateCaptcha = (phone, captcha) =>
    get('/gateway/api/verification/sms/validate', {
        account: phone,
        code: captcha,
        token: phone,
    })

export const registerOrLogin = (phone, captcha) => {
    let reg = /(\d{3})\d{4}(\d{4})/
    let secretPhone = phone.replace(reg, '$1****$2')

    return get('/gateway/api/register/sms', {
        account: phone,
        code: captcha,
        mobile: phone,
        // password: phone,
        name: secretPhone,
        role: 'User',
        token: phone,
    })
}
export const logout = () => get('/gateway/api/logout', {})

export const getAccountSummary = () => post('/platform/api/wallet/account/getAccountSummaryResult', {})

export const convertAccount = (result) => {
    let user = result.user
    let person = result.person
    let company = result.company

    let reg = /(\d{3})\d{4}(\d{4})/
    let secretPhone = user.mobile.replace(reg, '$1****$2')

    let auth

    let personal
    if (person && person.current) {
        let current = person.current
        auth = {
            isPersonal: true,
            name: current.idCardName,
            status: 'accept',
        }

        personal = {
            id: person.id,
            captcha: person.captcha,
            currentId: current.id,
            education: current.education, //学历
            occupation: current.occupation, //职业

            idCardFrontUri: person.frontUri,
            idCardBackUri: person.backUri,
            idCardName: current.idCardName,
            idCardNumber: current.idCardNumber,
            idCardBirthday: current.idCardBirthday,
            idCardSex: current.idCardSex,
            idCardNation: current.idCardNation,
            idCardAuthority: current.idCardAuthority,
            idCardValidDate: current.idCardValidDate,

            isModifyReview: current.reviewIndicator,
            modifyReviewId: current.reviewIdentifier,
            isAuthReview: person.reviewIndicator,
            authReviewId: person.reviewIdentifier,
        }
        if (person.reviewIndicator || current.reviewModifyIndicator) {
            auth.status = 'submit'
        }
    }

    let _company
    if (company && company.current) {
        let current = company.current
        auth = {
            isPersonal: false,
            name: current.licenseName,
            status: 'accept',
        }

        _company = {
            id: company.id,
            captcha: company.captcha,
            currentId: current.id,
            asset: current.asset,
            employee: current.employee,
            income: current.income,
            industry: current.industry,
            licenseAddress: current.licenseAddress,
            licenseBusiness: current.licenseBusiness,
            licenseCapital: current.licenseCapital,
            licenseCity: current.licenseCity,
            licenseCounty: current.licenseCounty,
            licenseDate: current.licenseDate,
            licenseName: current.licenseName,
            licenseNumber: current.licenseNumber,
            licensePeriod: current.licensePeriod,
            licensePerson: current.licensePerson,
            licenseProvince: current.licenseProvince,
            licenseType: current.licenseType,
            licenseUri: company.uri,
            name: current.name,
            profit: current.profit,
            tax: current.tax,

            isModifyReview: current.reviewIndicator,
            modifyReviewId: current.reviewIdentifier,
            isAuthReview: company.reviewIndicator,
            authReviewId: company.reviewIdentifier,
        }

        if (company.reviewIndicator || current.reviewModifyIndicator) {
            auth.status = 'submit'
        }
    }
    console.log(company)

    return {
        id: result.id,
        account: user.account,
        nick: user.nick || secretPhone,
        name: user.name,
        sex: user.sex,
        birthday: user.birthday,
        photo: pictureService.getPicture(user.photo, { width: 120 }),
        photoOriginal: user.photo,
        mobile: user.mobile,
        captcha: user.captcha,
        point: (result.point || 0).toFixed(2),
        coin: (result.coin || 0).toFixed(2),
        balance: (result.balance || 0).toFixed(2),

        personal: personal,
        company: _company,
        auth: auth,
        direct: 0,
    }
}
