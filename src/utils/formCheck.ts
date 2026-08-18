/* eslint-disable no-unused-vars */

import { landlinePhoneRegex, mobilePhoneRegex } from './regExp'

export function checkPhone(rule: any, value: any, callback: (err?: Error) => void) {
  const bool = mobilePhoneRegex.test(value) || landlinePhoneRegex.test(value)
  if (bool) {
    callback()
  } else {
    callback(new Error('电话或手机号码异常！'))
  }
}
