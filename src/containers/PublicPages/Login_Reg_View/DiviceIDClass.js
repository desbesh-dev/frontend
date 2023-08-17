import FingerprintJS from '@fingerprintjs/fingerprintjs';
import React, { useEffect, useState } from 'react';

const DeviceIDComponent = () => {
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        async function getDeviceId() {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setDeviceId(result.visitorId);
        }
        getDeviceId();
    }, []);

    return (
        <div>
            <p>Device ID: {deviceId}</p>
        </div>
    );
};

export default DeviceIDComponent;