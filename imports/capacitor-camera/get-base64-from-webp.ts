/**
 * Converts a webp image to base64 format.
 * @param {string} webPath - The web path of the photo.
 * @returns {Promise<string>} A Promise that resolves with the base64 representation of the photo.
 */
export const getBase64FromWebp = async (webPath: string) => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(webPath!);
    const blob = await response.blob();
    return await convertBlobToBase64(blob) as string;
  }
  
  /**
   * Converts a blob to base64 format.
   * @param {Blob} blob - The blob to convert.
   * @returns {Promise<string>} A Promise that resolves with the base64 representation of the blob.
   */
  export const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });