# 野火UniApp平台Demo
支持Android和iOS端，使用了***野火UniApp原生插件***(在UniApp的插件市场搜索“野火IM原生插件”)。

## 配置
使用野火官方服务，直接编译运行即可。如果使用自己私有部署IM服务，需要在[config.js](./config.js)配置应用服务地址和IM服务地址。修改如下配置：
```
//应用服务地址
static APP_SERVER = 'https//app.wildfirechat.net:8888';

//IM 服务Host
static IM_SERVER_HOST = 'wildfirechat.net';
```

## 运行
添加原生插件-***野火UniApp原生插件***，然后运行```npm install```命令，install成功后再按照正常流量打包运行测试。

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
