export default class Config {
    // 调试用
    static ENABLE_AUTO_LOGIN = true;
    // 是否支持多人音视频通话
    static ENABLE_MULTI_VOIP_CALL = true;
    // 是否支持1对1音视频通话
    static ENABLE_SINGLE_VOIP_CALL = true;

    static DEFAULT_PORTRAIT_URL = 'data:image/png;base64,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';

    static DEFAULT_ORGANIZATION_PORTRAIT_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABlUlEQVR4nO2aIW7DQBBFc409UJRD9AoFJr1DeUADSrogoDws8EslloKCLeUEOcDWEzWtii133d2xH/h0ZD/9Pzs72lVSMBRGM1gBL/zJQAAUAK1kinCgAGg4UH4nASIsABoOVPkoEmEtBGDcN5PodFgvA+Dm+WMSfUFcDMDm/WK79jObANgC0HAgETZ6oDhEjENEnMKMMWIONAbplkHauIlwlTPuwprhMuFhd74vFHJpccuEDeus6UHHfXMHXcJVVTswARCACQcGIpwqaDP0QAHQcKAYY4wxpkLFJQ3Sp8M6+1ONp5fX3ztublUHMP64xYuqBZgyfpiXmgAUAA0Higibh35FDxQADQc6jltkjAkATDjQb9wiEQ6+AY5dGqQZ1MwKcHu8DNLj23nwz9ZeMyvA7toP0vb4/W5lDjUBeAWg4UARYRf9KtIDewB2ONBv3CIR7gHY4UC/cYtEuAdghwP/Z00UndTMskwY+worzaBmFoAoADBlNgIOFACtZGvBgQKg4UD5PeGJsABoOFDlo0iEVQbgDWanvolAkB8PAAAAAElFTkSuQmCC';
    static DEFAULT_DEPARTMENT_PORTRAIT_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAFCgAwAEAAAAAQAAAFAAAAAAwtohTAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KGV7hBwAAAjlJREFUeAHt28FOwkAQgOGt8UF4Cg0nOJjo1bfgEfRkPekj8BZeOGjigRuRcNeTJ30NsW0g2UzatTNTpE3+JiS7dGba/dgAW0oIbAgggAACCCCAAAIIIIAAAgMTyI59vlcPq2lxDuVDtT3fjnNVwoGCTw9UV1N2us3CnSZhF5sbcjpP6QNgNajri7NWg/v4/A7vxaMv20lfTmSo5wGg85UDEECngDOdGQigU8CZzgwE0CngTGcGAugUcKYzAwF0CjjTmYEAOgWc6b25nPX0unYO5TjpfQBcZtvawY9+QhgV7zHL2r08mRYoLvXnl4+retp06r/u5UPEyQ0ggE4BZzozEECngDOdGQigU8CZ3smtHdbbM1LnXnyJnmZZmBRfsu9TcZZ9Xd4W0tVKxHp7RuP496+s8baPxrq7HflfAW33dwVYHe/lZrwfd9vjN8aVK5ES7xA1Gw9q2MGHiAEtTgEw1jC0ATSgxSkAxhqGNoAGtDgFwFjD0AbQgBanABhrGNoAGtDiFNXKIbHmTf4AlFp7DqVmjBa3tUu5xjVv+UoUvwBN4uJRO4/asjmUmvK8q74WsEqaz85ri8knF5uvsNi0+0vCUGrKMfIeKEWUfQCVYDIcQCmi7AOoBJPhAEoRZR9AJZgMB1CKKPsAKsFkOIBSRNkHUAkmwwGUIso+gEowGQ6gFFH2AVSCyXDT5azZ/E3WcfeHUlMOVAvY9JcEWVfTH0pNzZiIRQABBBBAAAEEEEAAAQQQ6K/ALz1vZTdxNVa5AAAAAElFTkSuQmCC';

    // 视频消息发送完成之前，无法拿到缩略图，故显示一个占位图，256x256
    static DEFAULT_VIDEO_POSTER = 'data:image/png;base64,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'

    // APP SERVER的地址，不能省略http(s)前缀。
    // 默认的app server使用端口是8888，注意端口号别忘记了。
    // 上线建议使用https，使用https更安全。
    //static APP_SERVER = 'http://wildfirechat.net:8888';
    static APP_SERVER = 'https://app.wildfirechat.net';

    // 组织结构服务地址，如果没有部署组织结构服务，或者不需要组织结构的话，可置为 null
    // 组织结构项目：https://github.com/wildfirechat/organization-platform 或 https://gitee.com/wfchat/organization-platform
    static ORGANIZATION_SERVER = 'https://org.wildfirechat.cn';

    // 工作台地址，如果不需要工作台，请删除 pages.json 里面，WorkspacePage 相关配置
    static WORKSPACE_URL = "https://open.wildfirechat.cn/work.html";


    // 请仔细看注释
    // 仅仅是 HOST，没有 http 前缀，后面也没有端口
    // IM SERVER 的 host 地址，一定要和 APP_SERVER 对应起来，即 APP_SERVER 上配置的 im-server 和下面所配置的im-server 是同一个
    static IM_SERVER_HOST = 'wildfirechat.net'/** 请仔细看上面的注释，仅仅是 HOST，没有 http 前缀，后面也没有端口 **/;

    static QR_CODE_PREFIX_PC_SESSION = "wildfirechat://pcsession/";

    // 如果使用的是高级版音视频 SDK，则不需要配置 ICE_SERVER，否则需要配置。<br>
    // 请参考 src/wfc/av/internal/README.MD 切换音视频 SDK <br>
    // turn server 配置，可以添加多个<br>
    // 格式: [uri, 用户名, 密码]，可以添加多个<br>
    // Turn服务配置，用户音视频通话功能，详情参考 https://docs.wildfirechat.net/webrtc/ <br>
    // 我们提供的服务能力有限，总体带宽仅3Mbps，只能用于用户测试和体验，为了保证测试可用，我们会不定期的更改密码。<br>
    // 上线时请一定要切换成你们自己的服务。可以购买腾讯云或者阿里云的轻量服务器，价格很便宜，可以避免影响到您的用户体验。<br>
    static ICE_SERVERS = [{uri: 'turn:turn.wildfirechat.net:3478', userName: 'wfchat', password: 'wfchat123'}];
    static LANGUAGE = 'zh_CN';

    // 允许主动加入多人音视频通话
    static ENABLE_MULTI_CALL_AUTO_JOIN = true;

    // 是否启用语音对讲功能，语音对讲是和对讲机类似的功能，不是和微信类似的，发送语音消息功能
    // 启用后，请联系官方获取对讲插件
    static ENABLE_PTT = false;

    // 是否启用音视频通话功能
    static ENABLE_VOIP = true;

    static SDK_PLATFORM_WINDOWS = 3;
    static SDK_PLATFORM_OSX = 4;
    static SDK_PLATFORM_WEB = 5;
    static SDK_PLATFORM_WX = 6;

    // uni-app 默认录音格式为mp3
    // 如果只有 uni-app 端，没有Android、iOS、Web、小程序 或者 PC 端时，录音可以直接播放，可将下面的AMR_TO_MP3_SERVER_ADDRESS置为""

    // html5 audio 标签不能播放amr格式的音频，需要将amr格式转换为mp3格式
    // 本服务传入amr音频文件的地址，将音频文件转换为mp3格式，并以application/octet-stream的格式返回
    // 如果语音消息很多，建议使用cdn
    //static AMR_TO_MP3_SERVER_ADDRESS = Config.APP_SERVER + '/amr2mp3?path=';
    static AMR_TO_MP3_SERVER_ADDRESS = '';
    // 文件传输助手ID
    static FILE_HELPER_ID = 'wfc_file_transfer';

    /**
     * 允许重新编辑多长时间内的撤回消息，单位是秒
     */
    static RECALL_REEDIT_TIME_LIMIT = 60;

    static platform = -1;

    static getWFCPlatform() {
        if (Config.platform > 0) {
            return Config.platform;
        }
        let info = uni.getSystemInfoSync();
        console.log('systemInfo', info);
        if (info.osName === 'ios' || info.platform === 'ios') {
            Config.platform = info.deviceType !== 'phone' ? 8 : 1;
        } else if (info.osName === 'android' || info.platform === 'android') {
            Config.platform = info.deviceType !== 'phone' ? 9 : 2;
        } else {
            Config.platform = 0;
        }
        return Config.platform;
    }


    static config(options) {
        Object.keys(options).forEach(key => {
            Config[key] = options[key];
        });
    }

    /**
     * 网络地址重定向
     *
     * 仅当双网环境时，需要特殊处理，默认原样返回
     *
     * @param {string} url
     * @return {string} newUrl
     */
    static urlRedirect(url) {
        if (!url) {
            return url;
        }
        // 示例代码
        // url = url.replace('oss.xxxx.com', '192.168.2.19');
        return url;
    }

    /**
     * 表情 base 路径
     * @return {string}
     */
    static emojiBaseUrl() {
        // 表情的 baseUrl，一定要求以 / 结尾
        let emojiBaseUrl = 'https://static.wildfirechat.net/twemoji/assets/';
        // 实例代码
        // 双网环境时，将表情地址切换到备选网络
        // if (!wfc.connectedToMainNetwork()) {
        //     emojiBaseUrl = 'https://192.168.2.169/twemoji/assets/';
        // }
        return emojiBaseUrl;
    }

    /**
     * 动态表情 base 路径
     * @return {string}
     */
    static stickerBaseUrl() {
        // 动态表情的 baseUrl，一定要求以 / 结尾
        let stickerBaseUrl = 'https://static.wildfirechat.net/sticker/';
        // 实例代码
        // 双网环境时，将动态表情地址切换到备选网络
        // if (!wfc.connectedToMainNetwork()) {
        //     stickerBaseUrl = 'https://192.168.2.169/sticker/';
        // }
        return stickerBaseUrl;
    }
}
