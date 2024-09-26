import addon from "libmarswrapper.so"
import { pinyin4js } from '@ohos/pinyin4js';

export function _pinyin(str: string, options: Object) {
    let ch: string = pinyin4js.getShortPinyin(str.substring(0, 1)).toUpperCase() as string
    return [ch]
}

export default addon