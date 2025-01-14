/**
 * 大概流程
 *  采用类 client-server 模式实现开放平台 js sdk，有两部分相关代码：
 * 1. client 运行在工作台所加载的 webview 里面
 * 2. server 直接运行在工作台页面里面
 * 3. client 和 server 之间的交互，通过 uni.postMessage 和 _webView.evalJs 实现
 *
 */


let handlers;
let _webView;
let mApp;
let mWfc;

export function init(app, webView) {

    mApp = app;
    mWfc = app.wfc;
    _webView = webView;

    handlers = {
        'toast': toast,
        'openUrl': openUrl,
        'getAuthCode': getAuthCode,
        'config': config,
        'chooseContacts': chooseContacts,
        'close': close,
    }
}

export let __messageFromWebView = data => {
    let obj = data;
    try {
        obj = JSON.parse(data);
    } catch (e) {
        console.error('parse ws data error', e);
        return;
    }
    //let obj = {type: 'wf-op-request', requestId, handlerName, args};
    console.log('wf-op-request', obj)
    if (obj.type === 'wf-op-request') {
        if (handlers[obj.handlerName]) {
            handlers[obj.handlerName](obj.args, obj.appUrl, obj.requestId);
        } else {
            console.log('wf-op-request, unknown handlerName', obj.handlerName);
        }
    }
}

let openUrl = (url) => {
    console.log('openUrl', url)
    let targetPageUrl
    targetPageUrl = '/pages/workspace/WorkspaceWebViewPage';
    mApp.$navigateToPage(`${targetPageUrl}?url=${encodeURIComponent(url)}`);
}

let getAuthCode = (args, appUrl, requestId) => {
    let host = appUrl.substring(appUrl.indexOf('//') + 2)
    host = host.substring(0, host.indexOf('/'))
    if (host.indexOf(':') > 0) {
        host = host.substring(0, host.indexOf(':'))
    }
    mWfc.getAuthCode(args.appId, args.appType, host, (authCode) => {
        console.log('authCode', authCode);
        _response('getAuthCode', appUrl, requestId, 0, authCode);
    }, (err) => {
        console.log('getAuthCode error', err);
        _response('getAuthCode', appUrl, requestId, err)
    })
}

let config = (args, appUrl) => {
    // TODO implement
    mWfc.configApplication(args.appId, args.appType, args.timestamp, args.nonceStr, args.signature, () => {
        console.log('config success');
        _notify('ready', appUrl)

    }, (err) => {
        console.log('config failed');
        _notify('error', appUrl, err)
    })
}

let chooseContacts = (args, appUrl, requestId) => {
    // TODO

    console.log('xxxx ooo', mApp.store.state.contact)
    mApp.$pickUsers(
        {
            users: mApp.store.state.contact.friendList,
            confirmTitle: '确定',
            successCB: users => {
                console.log('picked user', users)
                _response('chooseContacts', appUrl, requestId, 0, users);
            },
        })
}

let close = (args, appUrl) => {
    // 关闭当前 tab
    uni.navigateBack({
        delta: 1,
        fail: err => {
            console.log('nav back err', err);
        }
    });
}

let toast = (text) => {
    uni.showToast({
        title: text,
        icon: 'none',
    });
}

function _response(handlerName, appUrl, requestId, code, data) {
    let obj = {
        type: 'wf-op-response',
        handlerName,
        appUrl,
        requestId,
        args: {
            code,
            data
        },
    }
    console.log('send response', obj)
    _webView.evalJs(`__messageFromUni('${JSON.stringify(obj)}')`);
}

function _notify(handlerName, appUrl, args) {
    let obj = {
        type: 'wf-op-event',
        handlerName,
        appUrl,
        args
    }
    console.log('send event', obj)
    _webView.evalJs(`__messageFromUni('${JSON.stringify(obj)}')`);
}


