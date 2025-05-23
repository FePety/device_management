const locks = new Map<number, string | number>(); // deviceId -> userId

function lockDevice(deviceId: number, userId: string | number): boolean {
    if (locks.has(deviceId)) {
        return false;
    }
    locks.set(deviceId, userId);
    return true;
}

function unlockDevice(deviceId: number, userId: string | number, force = false): boolean {
    if (!locks.has(deviceId)) return false;
    if (locks.get(deviceId) === userId || force) {
        locks.delete(deviceId);
        return true;
    }
    return false;
}

function isLocked(deviceId: number): boolean {
    return locks.has(deviceId);
}

function getLocker(deviceId: number): string | number | undefined {
    return locks.get(deviceId);
}


export default {
    lockDevice,
    unlockDevice,
    isLocked,
    getLocker,
};
