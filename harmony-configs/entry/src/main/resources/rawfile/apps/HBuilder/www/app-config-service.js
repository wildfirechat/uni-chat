
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundTextStyle":"light","navigationBar":{"backgroundColor":"#fff","titleText":"野火IM","type":"default","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"野火IM","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"4.28","entryPagePath":"pages/SplashPage","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#7f8389","selectedColor":"#3B62E0","borderStyle":"black","blurEffect":"none","fontSize":"10px","iconWidth":"24px","spacing":"3px","height":"50px","list":[{"pagePath":"pages/conversationList/ConversationListPage","text":"野火","iconPath":"/static/image/tabbar/message_normal.png","selectedIconPath":"/static/image/tabbar/message_press.png"},{"pagePath":"pages/contact/ContactListPage","text":"通讯录","iconPath":"/static/image/tabbar/contact_normal.png","selectedIconPath":"/static/image/tabbar/contact_press.png"},{"pagePath":"pages/workspace/WorkspacePage","text":"工作台","iconPath":"/static/image/tabbar/work_normal.png","selectedIconPath":"/static/image/tabbar/work_press.png"},{"pagePath":"pages/discovery/DiscoveryPage","text":"发现","iconPath":"/static/image/tabbar/discovery_normal.png","selectedIconPath":"/static/image/tabbar/discovery_press.png"},{"pagePath":"pages/me/MePage","text":"我的","iconPath":"/static/image/tabbar/me_normal.png","selectedIconPath":"/static/image/tabbar/me_press.png"}],"backgroundColor":"white","selectedIndex":0,"shown":true},"locales":{},"darkmode":false,"themeConfig":{}};
  const __uniRoutes = [{"path":"pages/SplashPage","meta":{"isQuit":true,"isEntry":true,"navigationBar":{"titleText":"","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/login/LoginPage","meta":{"navigationBar":{"titleText":"野火IM","type":"default"},"isNVue":false}},{"path":"pages/conversationList/ConversationListPage","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":0,"navigationBar":{"titleText":"会话列表","type":"default"},"isNVue":false}},{"path":"pages/conversation/ConversationPage","meta":{"enablePullDownRefresh":false,"disableScroll":true,"navigationBar":{"titleText":"会话详情","type":"default"},"isNVue":false}},{"path":"pages/conversation/message/CompositeMessagePage","meta":{"navigationBar":{"titleText":"组合消息预览","type":"default"},"isNVue":false}},{"path":"pages/conversation/SingleConversationInfoPage","meta":{"navigationBar":{"titleText":"单人会话信息","type":"default"},"isNVue":false}},{"path":"pages/conversation/message/forward/ForwardMessagePage","meta":{"navigationBar":{"titleText":"消息转发","type":"default"},"isNVue":false}},{"path":"pages/conversation/GroupConversationInfoPage","meta":{"navigationBar":{"titleText":"群会话信息","type":"default"},"isNVue":false}},{"path":"pages/contact/SearchUserPage","meta":{"navigationBar":{"titleText":"搜索用户","type":"default"},"isNVue":false}},{"path":"pages/contact/OrganizationTreePage","meta":{"navigationBar":{"titleText":"组织结构","type":"default"},"isNVue":false}},{"path":"pages/contact/ChannelListPage","meta":{"navigationBar":{"titleText":" 频道列表","type":"default"},"isNVue":false}},{"path":"pages/search/SearchPortalPage","meta":{"navigationBar":{"titleText":"搜索","type":"default"},"isNVue":false}},{"path":"pages/search/SearchConversationMessagePage","meta":{"navigationBar":{"titleText":"会话消息搜索","type":"default"},"isNVue":false}},{"path":"pages/contact/UserDetailPage","meta":{"navigationBar":{"titleText":"用户信息","type":"default"},"isNVue":false}},{"path":"pages/contact/FriendRequestDetailPage","meta":{"navigationBar":{"titleText":"好友请求","type":"default"},"isNVue":false}},{"path":"pages/contact/ContactListPage","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":1,"navigationBar":{"titleText":"好友","type":"default"},"isNVue":false}},{"path":"pages/contact/NewFriendListPage","meta":{"navigationBar":{"titleText":"新朋友","type":"default"},"isNVue":false}},{"path":"pages/contact/GroupListPage","meta":{"navigationBar":{"titleText":"我的群组","type":"default"},"isNVue":false}},{"path":"pages/pick/PickUserPage","meta":{"navigationBar":{"titleText":"选择联系人","type":"default"},"isNVue":false}},{"path":"pages/pick/PickSingleUserPage","meta":{"navigationBar":{"titleText":"选择单个联系人","type":"default"},"isNVue":false}},{"path":"pages/workspace/WorkspacePage","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":2,"navigationBar":{"titleText":" 工作台","type":"default"},"isNVue":false,"isNVueStyle":true}},{"path":"pages/workspace/WorkspaceWebViewPage","meta":{"navigationBar":{"titleText":"页面加载中...","type":"default"},"isNVue":false,"isNVueStyle":true}},{"path":"pages/discovery/DiscoveryPage","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":3,"navigationBar":{"titleText":"发现","type":"default"},"isNVue":false}},{"path":"pages/discovery/ChatroomListPage","meta":{"navigationBar":{"titleText":"聊天室列表","type":"default"},"isNVue":false}},{"path":"pages/me/MePage","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":4,"navigationBar":{"titleText":"我的","type":"default"},"isNVue":false}},{"path":"pages/misc/WebViewPage","meta":{"navigationBar":{"titleText":"页面加载中...","type":"default"},"isNVue":false}},{"path":"pages/misc/PreviewVideoPage","meta":{"navigationBar":{"titleText":"视频预览","type":"default"},"isNVue":false}},{"path":"pages/voip/Single","meta":{"titleNView":false,"navigationBar":{"titleText":"单人音视频通话","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false,"isNVueStyle":true}},{"path":"pages/voip/Multi","meta":{"titleNView":false,"navigationBar":{"titleText":"多人音视频通话","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false,"isNVueStyle":true}},{"path":"pages/voip/conference/ConferencePortalPage","meta":{"navigationBar":{"titleText":"会议","type":"default"},"isNVue":false}},{"path":"pages/voip/conference/JoinConferencePage","meta":{"navigationBar":{"titleText":" 加入会议","type":"default"},"isNVue":false}},{"path":"pages/voip/conference/CreateConferencePage","meta":{"navigationBar":{"titleText":"发起会议","type":"default"},"isNVue":false}},{"path":"pages/voip/conference/OrderConferencePage","meta":{"navigationBar":{"titleText":"预定会议","type":"default"},"isNVue":false}},{"path":"pages/voip/conference/ConferenceInfoPage","meta":{"navigationBar":{"titleText":"会议详情","type":"default"},"isNVue":false}},{"path":"pages/voip/conference/ConferencePage","meta":{"titleNView":false,"navigationBar":{"titleText":"音视频会议","type":"default","style":"custom","titleColor":"#ffffff"},"isNVue":false,"isNVueStyle":true}},{"path":"pages/voip/conference/ConferenceManagePage","meta":{"navigationBar":{"titleText":"会议管理","type":"default"},"isNVue":false}},{"path":"pages/misc/ApiTestPage","meta":{"navigationBar":{"titleText":"API测试","type":"default"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  