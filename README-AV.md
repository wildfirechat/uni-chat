# 音视频SDK使用说明

默认使用的是免费版多人音视频，可以更换音视频高级版，支持更高质量的音视频通话和会议功能。关于免费音视频和音视频高级版的区别，请参考[野火音视频简介](https://docs.wildfirechat.cn/blogs/野火音视频简介.html)和[野火音视频使用说明](https://docs.wildfirechat.cn/webrtc/)。


## 音视频高级版的使用说明
音视频高级版包括专业版IM服务，[janus服务](https://gitee.com/wfchat/wf-janus)和客户端音视频高级版SDK。在服务端部署专业版IM服务和janus服务后，客户端需要替换野火发给客户的SDK，替换以后就可以发起音视频通话了。音视频高级版不需要turn服务，不用部署和配置turn服务。

替换方法：下载[【官方】野火实时音视频RTC插件](https://ext.dcloud.net.cn/plugin?id=15619)，然后替换野火音视频高级版SDK，android平台是```avenginekit.aar```，iOS平台是```WFAVEngineKit.xcframework```。然后使用本地插件。