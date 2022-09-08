# 野火UniApp平台Demo
支持Android和iOS端，使用了***野火UniApp原生插件***(在UniApp的插件市场搜索“野火IM原生插件”)。

## 部署服务端
本应用默认连接野火官方服务，也可以自己部署服务。如果想要私有部署服务，请按照[服务器快速部署](https://docs.wildfirechat.cn/quick_start/server.html)来部署服务到您自己的服务器。

## 配置
1. 插件市场搜索[野火即时通讯IM原生插件](https://ext.dcloud.net.cn/plugin?id=7895)和[野火实时音视频RTC原生插件](https://ext.dcloud.net.cn/plugin?id=9364)，并购买(插件是免费的!)
2. HBuilderX 原生插件配置，选择云端插件，并选中购买的野火插件
3. 如果使用野火官方服务，直接编译运行即可。如果使用自己私有部署IM服务，需要在[config.js](./config.js)配置应用服务地址和IM服务地址。修改如下配置：
    ```
    //应用服务地址
    static APP_SERVER = 'http//wildfirechat.net:8888';

    //IM 服务Host
    static IM_SERVER_HOST = 'wildfirechat.net';
    ```

## 运行
1. 运行```npm install```命令
2. HBuilderX 制作自定义基座，可参考[什么是自定义调试基座及使用说明](https://ask.dcloud.net.cn/article/35115)
3. HBuilderX，运行基座选择：自定义调试基座
4. HBuilderX，运行到 Android App 基座 或 iOS App 基座

## 移植到其它应用
如果要在现有项目中使用野火原生插件，需要把[wfc](./wfc)目录和[config.js](./config.js)配置文件一同拷贝到现有项目，然后添加***野火UniApp原生插件***。现有项目使用[wfc](./wfc)目录下的[wfc.js](./wfc/client/wfc.js)接口文件。

## 应用截图
会话列表
![会话列表](./screenshots/uniapp_conversation_list.jpeg)

联系人列表
![联系人列表](./screenshots/uniapp_contact_tab.jpeg)

会话界面
![会话界面](./screenshots/uniapp_conversation.jpeg)

用户详情界面
![用户详情界面](./screenshots/uniapp_user_profile.jpeg)
