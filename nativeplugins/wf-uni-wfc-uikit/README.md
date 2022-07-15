# 野火IM UIKit插件使用说明

1. 本插件依赖于[wf-uni-wfc-client](https://ext.dcloud.net.cn/plugin?id=7895)
2. 本插件主要实现一些 UI相关的功能，比如会话页面、音视频通话页面等。
3. 遇到问题，请到[uni-wfc-client](https://gitee.com/wfchat/uni-wfc-client) 项目下提issue，我们会尽快解决

## 针对音视频通话功能的特殊说明

1. 默认使用的是单人版音视频 SDK，支持 1对1 音视频通话
2. 多人版或会议版，请联系我们

## 为什么不发布到插件市场？

因为客户可能需要替换音视频 SDK，发布到插件市场之后，无法进行替换

## 打包时提示```gson```相关库冲突

```uniPush```模块也用到了```gson```库，所以导致冲突。删除本目录下```package.json```文件里面的``` "com.google.code.gson:gson:2.8.5",```即可