import 'jspdf-autotable'
import { Base64 } from 'js-base64';


export const convertImgToBase64URL = (url) => {

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            let canvas = document.createElement('CANVAS')
            const ctx = canvas.getContext('2d')
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
            canvas = null;
            resolve(dataURL)
        }
        img.src = url;
    });
}