import Quagga from 'quagga';
import { useEffect } from 'react';

const CustomBarcodeReader = ({ onScan, onError }) => {
    useEffect(() => {
        const handleBarcodeDetection = (data) => {
            const code = data.codeResult.code;

            onScan(code);
        };

        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: document.querySelector('#barcode-scanner'), // Point to the video container's DOM element
            },
            decoder: {
                readers: ['ean_reader', 'code_128_reader', 'code_39_reader'],
            },
        }, (err) => {
            if (err) {
                onError(err);
                return;
            }

            Quagga.start();
        });

        Quagga.onDetected(handleBarcodeDetection);

        return () => {
            Quagga.offDetected(handleBarcodeDetection);
            Quagga.stop();
        };
    }, [onScan, onError]);

    return (
        <div id="barcode-scanner" style={{ width: '100%', height: 'auto', position: 'relative' }}>
            <video style={{ width: '100%', height: 'auto', position: 'absolute' }}></video>
            <canvas style={{ width: '100%', height: 'auto', position: 'absolute' }}></canvas>
        </div>
    );
};

export default CustomBarcodeReader;
