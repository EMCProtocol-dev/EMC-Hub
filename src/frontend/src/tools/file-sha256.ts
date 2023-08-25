/**
 * JavaScript browser file to SHA-256 hash
 */
export function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buffer = Buffer.allocUnsafe(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

export function hexString(buffer: Buffer | ArrayBuffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    return value.toString(16).padStart(2, '0');
  });
  return '0x' + hexCodes.join('');
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer | void> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    const readFile = function (event: any) {
      const buffer = reader.result as ArrayBuffer;
      resolve(buffer);
    };
    const handleError = function (event: any) {
      console.info(`file reader error `, event);
      resolve();
    };
    const handleAbort = function (event: any) {
      console.info(`file reader abort `, event);
      resolve();
    };
    reader.addEventListener('load', readFile);
    reader.addEventListener('abort', handleAbort);
    reader.addEventListener('error', handleError);
    reader.readAsArrayBuffer(file);
  });
}

export async function bufferToSha256(buffer: Buffer): Promise<ArrayBuffer> {
  return window.crypto?.subtle?.digest('SHA-256', buffer);
}

export async function fileToSha256Hex(file: File) {
  try {
    const ab = await fileToArrayBuffer(file);
    console.info(`await fileToArrayBuffer(file)-->`, ab?.byteLength);
    if (ab && ab.byteLength > 0) {
      const bf = arrayBufferToBuffer(ab);
      const ab2 = await bufferToSha256(bf);
      console.info(`await bufferToSha256(arrayBufferToBuffer(buffer))`, ab2.byteLength);
      return hexString(ab2);
    } else {
      return '';
    }
  } catch (e) {
    console.error(e);
    return '';
  }
}
