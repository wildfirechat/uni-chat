import permission from "../../common/permission";

async function checkVoipPermissions(audioOnly) {
    // #ifdef APP-PLUS
    let iosPermissions = ['record'];
    let androidPermissions = ['android.permission.RECORD_AUDIO'];
    if (!audioOnly) {
        iosPermissions.push('camera');
        androidPermissions.push('android.permission.CAMERA');
    }
    let status = permission.isIOS ? await permission.requestIOS(iosPermissions) :
        await permission.requestAndroid(androidPermissions)
    if (status !== 1) {
        uni.showModal({
            content: "需要相关权限",
            confirmText: "设置",
            success: (res) => {
                if (res.confirm) {
                    permission.gotoAppSetting();
                }
            }
        })
        return false;
    } else {
        return true;
    }
    // #endif
    return true;
}

export default checkVoipPermissions