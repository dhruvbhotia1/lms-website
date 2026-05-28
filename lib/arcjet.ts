import {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,

} from '@arcjet/next'

import arcjet from '@arcjet/next';

export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
}

export default arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ["fingerprint"],
    rules: [
        shield({
            mode: 'LIVE'
        })
    ],




})