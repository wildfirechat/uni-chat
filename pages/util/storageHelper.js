export function removeItem(key) {
    uni.removeStorageSync(key)
}

export function getItem(key) {
    return uni.getStorageSync(key);
}

export function setItem(key, value) {
    uni.setStorageSync(key, value);
}

export function clear() {
    uni.clearStorageSync();
}
