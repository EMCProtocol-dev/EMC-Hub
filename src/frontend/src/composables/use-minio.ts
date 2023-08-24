import { Client as MinioClient } from 'minio';
import { Axios, AxiosProgressEvent } from 'axios';

const HOST = '36.155.7.145';
const PORT = 9000;
const SSL = false;
const ACCESS_KEY = 'vozdBpAulYbtpZDTvSeD';
const SECRET_KEY = 'thD4BZO84k1vUJVt1a5332ZWNeYqZ3tNFlcr4vcO';
const BUCKET_NAME = 'hub-archive';

interface FileInfo {
  id: string;
  name: string;
  batchId?: string | null;
  percentage?: number | null;
  status: 'pending' | 'uploading' | 'finished' | 'removed' | 'error';
  url?: string | null;
  file?: File | null;
  thumbnailUrl?: string | null;
  type?: string | null;
  fullPath?: string | null;
}

export interface PolicyResult {
  postURL: string;
  postFormData: {
    [key: string]: any;
  };
  doneURL?: string;
  doneBody?: {
    [key: string]: any;
  };
}

interface UploadOptions {
  file: FileInfo;
  url?: string;
  data?: any;
  headers?: any;
  policyData?: PolicyResult | null;
  onProgress?: (e: AxiosProgressEvent) => void;
}

function wait(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export function useMinio() {
  let minioClient: MinioClient;
  const getContext = () => {
    if (!minioClient) {
      minioClient = new MinioClient({
        endPoint: HOST,
        port: PORT,
        useSSL: SSL,
        accessKey: ACCESS_KEY,
        secretKey: SECRET_KEY,
      });
    }
    return minioClient;
  };
  const presigned = (fileName: string) => {
    const ctx = getContext();
    return ctx.presignedPutObject(BUCKET_NAME, `${fileName}`, 2);
  };

  const presignedPolicy = async (file: FileInfo): Promise<PolicyResult> => {
    const ctx = getContext();
    const policyRaw = ctx.newPostPolicy();
    policyRaw.setBucket(BUCKET_NAME);
    policyRaw.setKey(file.name);
    policyRaw.setContentLengthRange(1024, 1024 * 1024 * 1024 * 10); // Min upload length is 1KB Max upload size is 10GB

    const expires = new Date();
    expires.setSeconds(6000); // 100 minutes
    policyRaw.setExpires(expires);

    const policyData = await ctx.presignedPostPolicy(policyRaw);
    console.info(`presigned policy --->`, policyData);
    return {
      postURL: policyData.postURL,
      postFormData: policyData.formData,
    };
  };

  const upload = async (params: UploadOptions): Promise<Resp365> => {
    let { file, headers, url, policyData: _policyData, onProgress } = params;

    const policyData = _policyData ? _policyData : await presignedPolicy(file);

    if (!policyData) {
      return { _result: 1, _desc: `presigned error` };
    }

    const formData = new FormData();
    Object.keys(policyData.postFormData).forEach((k: string) => {
      formData.append(k, policyData.postFormData[k]);
    });
    formData.append('file', file.file as File);

    const axios: Axios = new Axios({ timeout: 60 * 60 * 1000 });
    const onUploadProgress = (event: AxiosProgressEvent) => typeof onProgress === 'function' && onProgress(event);
    try {
      const resp = await axios.post(`${policyData.postURL}`, formData, {
        onUploadProgress,
      });
      if (resp.status === 200 || resp.status === 204) {
        if (!policyData.doneURL) {
          return { _result: 1, _desc: 'not found done url' };
        }
        const doneResp = await axios.post(`${policyData.doneURL}`, JSON.stringify(policyData.doneBody), {
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });
        try {
          const { _result, data = {} } = JSON.parse(doneResp.data);
          const { url, sn, expireTime } = data;
          if (url) {
            return { _result: 0, url, sn, expireTime };
          } else {
            return { _result: 1, _desc: 'not found url' };
          }
        } catch (e) {
          return { _result: 1, _desc: `parse done data error` };
        }
      } else {
        return { _result: 1, _desc: `upload error ${resp.status}` };
      }
    } catch (e: any) {
      return { _result: 1, _desc: e.toString() };
    }
  };

  return {
    presigned,
    upload,
  };
}
