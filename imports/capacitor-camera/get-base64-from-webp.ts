export const getBase64FromWebp = async (webPath: string) => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(webPath!);
    const blob = await response.blob();
    return await convertBlobToBase64(blob) as string;
}

export const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});