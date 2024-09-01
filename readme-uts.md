# 野火IM插件使用说明
有2种插件的使用方法，一种是基于野火提供的Demo直接进行二次开发；另外一种是把野火插件放到现有项目中。

## 使用野火demo
野火UniApp平台的demo地址:[uni-chat 项目 uts 分支](https://gitee.com/wfchat/uni-wfc-client/tree/uts/)。按照说明配置地址就可以直接运行，再根据产品需求进行二次开发。

## 现有项目使用
### 集成步骤：
1. 添加野火插件到项目中。
2. 把野火UniApp平台的demo中的[wfc](https://gitee.com/wfchat/uni-chat/tree/main/wfc)目录和配置文件[config.js](https://gitee.com/wfchat/uni-chat/blob/main/config.js)拷贝到现有工程中。
3. 配置```config.js```中的IM服务和应用服务地址。
4. 调用接口类[wfc.js](https://gitee.com/wfchat/uni-chat/blob/main/wfc/client/wfc.js)来使用野火插件。

### 使用说明
所有的IM业务需要确保调用过connect之后才可以进行，connect需要用户token，需要在用户登陆时为用户换取token再调用connect。具体操作可以参考[野火demo](https://gitee.com/wfchat/uni-chat)。

## 源码地址
源码在[uni-wfc-client 项目 uts 分支](https://gitee.com/wfchat/uni-wfc-client)。

## 技术支持
如果遇到问题，可以去[插件源码工程](https://gitee.com/wfchat/uni-wfc-client)或者[demo源码工程](https://gitee.com/wfchat/uni-chat)提issue，也可以去[野火论坛](https://bbs.wildfirechat.cn)发帖子问题，我们会尽快回复。谢谢大家的支持。

