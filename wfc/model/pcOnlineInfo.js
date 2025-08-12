export default class PcOnlineInfo {
    static PC_ONLINE_TYPE_PC_Online = 0;
    static PC_ONLINE_TYPE_Web_Online = 1;
    static PC_ONLINE_TYPE_WX_Online = 2;
    static PC_ONLINE_TYPE_Pad_Online = 3

    /**
     * PC online type
     * @type {number}
     */
    type = 0
    /**
     * 参考
     *     PlatformType_UNSET(0),
     *     PlatformType_iOS(1),
     *     PlatformType_Android(2),
     *     PlatformType_Windows(3),
     *     PlatformType_OSX(4),
     *     PlatformType_WEB(5),
     *     PlatformType_WX(6),
     *     PlatformType_Linux(7),
     *     PlatformType_iPad(8),
     *     PlatformType_APad(9),
     *     PlatformType_Harmony(10),
     *     PlatformType_Harmony_Pad(11),
     *     PlatformType_Harmony_PC(12);
     * @type {number}
     */
    platform = 0;
    isOnline = false;
    clientId = '';
    clientName = '';
    timestamp = 0;


    static fromStr(value, pcOnlineType) {
        if (!value || !value.trim()) {
            return null;
        }
        let parts = value.split('|');
        if (parts.length >= 4) {
            let info = new PcOnlineInfo();
            info.type = pcOnlineType;
            info.timestamp = Number(parts[0]);
            info.platform = Number(parts[1]);
            info.clientId = parts[2];
            info.clientName = parts[3];
            info.isOnline = true;
            return info;
        }
        return null;
    }
}