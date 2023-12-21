/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */
export default class ParticipantProfile {
    userId;
    callExtra;
    state;
    joinTime = 0;
    acceptTime = 0;
    audioMuted = false;
    videoMuted = false;
    audience = false;
    screenSharing = false;
}
