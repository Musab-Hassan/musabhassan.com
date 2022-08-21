import { imgPromises } from "./store";

// Load images asynchronously during page loading animation
export async function loadImage(src) {
    const promise =  new Promise(async (resolve: (src: string) => void, reject) => {
        const blob = await (await fetch(src)).blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

    imgPromises.update(val => [...val, promise]);
    return promise;
}