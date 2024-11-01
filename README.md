# 野火uni-app demo

支持 Android、iOS 和 HarmonyOS 端

## HarmonyOS 特别说明

1. Android、iOS 端，是免费的，可直接使用，可连接到自行部署的`im-server`
2. 野火IM 鸿蒙 SDK 是需要付费的，鸿蒙 5.0 上，默认只能连到官方服务，需要申请试用才能连到自行部署的`im-server`
3. 申请试用，具体请看 [试用](https://docs.wildfirechat.cn/trial/)

## 关于音视频通话功能的重要说明

1. HarmonyOS 平台上，暂不支持音视频通话，未来将提供 uts 插件方案的音视频通话能力
2. Android、iOS 平台，支持音视频通话，但是是基于原生语言插件实现的，并且有两种方案
    1. 对应的插件是[野火实时音视频RTC插件(原生UI)](https://ext.dcloud.net.cn/plugin?id=9364), 使用原生UI，就是把Android平台和iOS平台的音视频SDK和UI代码全都集成到uni-chat项目中。这种方案的问题是引入的无关代码太多，且原生UI无法修改，跟uniapp互通也很不方便，不利于二次开发。
    2. 对应的插件是[野火实时音视频RTC插件](https://ext.dcloud.net.cn/plugin?id=15619), 是使用原生的音视频SDK，但UI层使用nvue编写，UI和SDK使用uniapp插件的方式沟通。这种方案引入的SDK比较小，且修改方便，有利于大家做自定义相关 UI。
3. 默认附带免费版本音视频，关于野火音视频可以参考[野火音视频使用说明](https://docs.wildfirechat.cn/webrtc/)和[野火音视频简介](https://docs.wildfirechat.cn/blogs/野火音视频简介.html)。 如果需要使用音视频高级版，请参考[音视频高级版切换方法](./README-AV.MD)。

** 自 2023-11-29 起，uni-chat 将音视频通话方案切换到方案 2，方案1 相关的代码，保留到native-rtc-ui分支 **

## 配置

1. [野火IM uts插件](https://ext.dcloud.net.cn/plugin?id=20059) 已包含在项目，一般不用特殊处理
2. 插件市场搜索[野火实时音视频RTC插件](https://ext.dcloud.net.cn/plugin?id=15619) ，并购买(插件是免费的!)
3. HBuilderX 原生插件配置，选择云端插件，并选中购买的野火插件
4. 如果使用野火官方服务，直接编译运行即可。如果使用自己私有部署IM服务，需要在[config.js](./config.js)配置应用服务地址和IM服务地址。修改如下配置：
    ```
    // 下面两个配置都要一起修复，否则登录进去之后，会马上退回登录界面
    //应用服务地址
    static APP_SERVER = 'http//wildfirechat.net:8888';

    //IM 服务Host，不能包含 http 前缀或者端口，不支持设置端口，端口是写死的 80
    static IM_SERVER_HOST = 'wildfirechat.net';
    ```

## 运行

1. 运行```npm install```命令
2. HBuilderX 制作自定义基座，可参考[什么是自定义调试基座及使用说明](https://ask.dcloud.net.cn/article/35115)
3. HBuilderX，运行基座选择：自定义调试基座
4. HBuilderX，运行到 Android App 基座、iOS App 基座 或 鸿蒙

> 如果没有制作并运行到自定义基座，那么野火原生插件就没有集成进去，将无法使用野火原生插件，界面会显示白屏。所以一定要严格阿照上述步骤执行。

## 部署服务端

本应用默认连接野火官方服务。私有化部署服务，请按照 [服务器快速部署](https://docs.wildfirechat.cn/quick_start/server.html) 来部署服务到您自己的服务器。

## 野火IM插件使用说明

有2种插件的使用方法，一种是基于野火提供的Demo直接进行二次开发；另外一种是把野火插件放到现有项目中。

### 集成到现有项目

1. 下载[野火IM uts插件](https://ext.dcloud.net.cn/plugin?id=20059)，并导入到项目中。
2. 把野火UniApp平台的demo中的[wfc](https://gitee.com/wfchat/uni-chat-uts/tree/main/wfc)目录和配置文件[config.js](https://gitee.com/wfchat/uni-chat-uts/blob/main/config.js)拷贝到现有工程中。
3. 配置```config.js```中的IM服务和应用服务地址。
4. 调用接口类[wfc.js](https://gitee.com/wfchat/uni-chat-uts/blob/main/wfc/client/wfc.js)来使用野火插件。

## 源码地址

1. Android 和 iOS uts 插件源码在[uni-wfc-client 项目 uts 分支](https://gitee.com/wfchat/uni-wfc-client)
2. 本 demo 源码在[demo源码工程](https://gitee.com/wfchat/uni-chat)

## 技术支持

如果遇到问题，可以去[插件源码工程](https://gitee.com/wfchat/uni-wfc-client)或者[demo源码工程](https://gitee.com/wfchat/uni-chat)提issue，也可以去[野火论坛](https://bbs.wildfirechat.cn)发帖子问题，我们会尽快回复。谢谢大家的支持。

## 抓取原生插件的日志

1. ```Android```端，可以通过```adb logcat > wfc.log```进行抓去日志，如果提示找不到```adb```命令，请参考 [这儿](https://uniapp.dcloud.net.cn/tutorial/run/run-app-faq.html)
2. ```iOS```端，请连接```Xcode```抓取
3. `HarmonyOs`，请使用`hdc`或`DevEco Studio`抓取

## 常见问题说明

1. 如果希望普通电话，能打断音视频通话，则需要在`package.json`里面，添加如下权限声明:
    ```xml
       <uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" />
    ```
2. 如何集成推送功能
    1. `HBuilder X`里面选中`manifest.json`，然后选中`Push`-> `uniPush 1.0`
    2. 参考[uni-push v1](https://uniapp.dcloud.net.cn/unipush-v1.html)，并进行相关配置
    3. 编译、配置、部署 [push server](https://github.com/wildfirechat/push_server)
    4. `App.vue` 里面会调用`plus.push.getClientInfoAsync`获取推送相关的`clientId`，可以使用该`clientId`在`uni-push`后台测试推送功能。
    5. 当设备不在线时，`im-server`会调用`push-server`，然后`push-server`调用`个推`进行推送

3. 打包失败：请确认是否执行过```npm install```命令。
4. iPhone上打开会话页面报错`SyntaxError: Invalid regular expression: invalid group specifier name __ERROR`

   `anchorme`只能使用`2.1.2`版本，不支持`3.x`版本，可参数这个[issue](https://github.com/alexcorvi/anchorme.js/issues/133)

## 应用截图

会话列表
![会话列表](./screenshots/uniapp_conversation_list.jpeg)

联系人列表
![联系人列表](./screenshots/uniapp_contact_tab.jpeg)

会话界面
![会话界面](./screenshots/uniapp_conversation.jpeg)

用户详情界面
![用户详情界面](./screenshots/uniapp_user_profile.jpeg)
