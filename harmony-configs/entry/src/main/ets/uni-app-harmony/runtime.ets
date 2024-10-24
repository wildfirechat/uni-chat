import { setUniRuntime } from '@dcloudio/uni-app-harmony-framework'
import { UTSJSONObject } from '@dcloudio/uts-harmony'

interface IUniErrorJson {
  errSubject: string,
  errCode: number,
  errMsg: string,
  data?: ESObject,
  cause?: Error
}

export interface IUniError {
  errSubject: string
  errCode: number
  errMsg: string
  cause?: Error
  data?: ESObject
}

export class UniError extends Error implements IUniError {
  errSubject: string
  errCode: number
  cause?: Error
  data?: ESObject

  constructor(
    errSubject?: string,
    errCode?: number | Record<string, ESObject>,
    errMsg?: string,
  ) {
    let options: Record<string, ESObject> = {}
    const argsLength = Array.from(arguments).length
    switch (argsLength) {
      case 0:
        errSubject = ''
        errMsg = ''
        errCode = 0
        break
      case 1:
        errMsg = errSubject
        errSubject = ''
        errCode = 0
        break
      case 2:
        errMsg = errSubject
        options = errCode as Record<string, ESObject>
        errCode = options.errCode || 0
        errSubject = options.errSubject || ''
        break
      case 3:
      default:
        break
    }
    super(errMsg)
    this.name = 'UniError'
    this.errSubject = errSubject as string
    this.errCode = errCode as number
    this.errMsg = errMsg as string
    if (options.data) {
      this.data = options.data
    }
    if (options.cause) {
      this.cause = options.cause
    }
  }

  set errMsg(msg: string) {
    this.message = msg
  }

  get errMsg(): string {
    return this.message
  }

  toString(): string {
    return this.errMsg
  }

  toJSON(): Record<string, ESObject> {
    return {
      errSubject: this.errSubject,
      errCode: this.errCode,
      errMsg: this.errMsg,
      data: this.data,
      cause:
      this.cause && typeof (this.cause as UniError).toJSON === 'function'
        ? (this.cause as UniError).toJSON()
        : this.cause,
    } as IUniErrorJson
  }
}

setUniRuntime({
  UTSJSONObject,
  UniError
})

export namespace HBuilderX {
  type ImageURIString = string
  type VideoURIString = string
  type URIString = string
  type WebviewIdString = string
  type IDString = string
  type ColorString = string
  type PageURIString = string
}

export declare namespace string {
  type ImageURIString = string
  type VideoURIString = string
  type URIString = string
  type WebviewIdString = string
  type IDString = string
  type ColorString = string
  type PageURIString = string
}

export interface ComponentPublicInstance {}

export interface ComponentInternalInstance {}

