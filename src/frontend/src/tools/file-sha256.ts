import SparkMD5 from 'spark-md5';
import { Sha256 } from '@aws-crypto/sha256-browser';

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

export async function handleFileToMD5(file: File): Promise<string> {
  return new Promise((resolve) => {
    const chunkSize = 2097152; // Read in chunks of 2MB
    const chunks = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    let currentChunk = 0;

    fileReader.onload = function (e) {
      console.info('read chunk nr', currentChunk + 1, 'of', chunks);
      spark.append(e.target?.result as ArrayBuffer); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        console.info('finished loading');
        const hash = spark.end();
        console.info('computed hash', hash); // Compute hash
        resolve(hash);
      }
    };

    fileReader.onabort = function (e) {
      console.warn('oops, file reader abort', e);
      resolve('');
    };

    fileReader.onerror = function (e) {
      console.warn('oops, file reader error', e);
      resolve('');
    };

    function loadNext() {
      const start = currentChunk * chunkSize;
      const _end = start + chunkSize;
      const end = _end >= file.size ? file.size : _end;
      fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    loadNext();
  });
}

export async function handleFileToSHA256(file: File): Promise<string> {
  return new Promise((resolve) => {
    const chunkSize = 2097152; // Read in chunks of 2MB
    const chunks = Math.ceil(file.size / chunkSize);
    const hashData = new Sha256();
    const fileReader = new FileReader();

    let currentChunk = 0;

    fileReader.onload = async function (e) {
      console.info('read chunk nr', currentChunk + 1, 'of', chunks);
      hashData.update(e.target?.result as ArrayBuffer);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        console.info('finished loading');
        const byteArray = await hashData.digest();
        const hexCodes = [...byteArray].map((value) => {
          return value.toString(16).padStart(2, '0');
        });
        const hash = '0x' + hexCodes.join('');
        console.info('computed hash', hash); // Compute hash
        resolve(hash);
      }
    };

    fileReader.onabort = function (e) {
      console.warn('oops, file reader abort', e);
      resolve('');
    };

    fileReader.onerror = function (e) {
      console.warn('oops, file reader error', e);
      resolve('');
    };

    function loadNext() {
      const start = currentChunk * chunkSize;
      const _end = start + chunkSize;
      const end = _end >= file.size ? file.size : _end;
      fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    loadNext();
  });
}

/**
 * Base on spark-md5
 * @param file
 * @returns
 */
export async function fileToMD5(file: File) {
  try {
    const hash = await handleFileToMD5(file);
    return hash || '';
  } catch (e) {
    console.error(e);
    return '';
  }
}

/**
 * Only support file size limit to 2GB
 * @param file
 * @returns
 */
export async function fileToSha256HexLimit(file: File) {
  try {
    const ab = await fileToArrayBuffer(file);
    if (ab && ab.byteLength > 0) {
      const bf = arrayBufferToBuffer(ab);
      const ab2 = await bufferToSha256(bf);
      return hexString(ab2);
    } else {
      return '';
    }
  } catch (e) {
    console.error(e);
    return '';
  }
}

export async function fileToSha256Hex(file: File) {
  try {
    const hash = await handleFileToSHA256(file);
    return hash || '';
  } catch (e) {
    console.error(e);
    return '';
  }
}
