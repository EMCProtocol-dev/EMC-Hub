import { Client as MinioClient } from 'minio';
import { Axios, AxiosProgressEvent, isCancel } from 'axios';
import { sign } from '@/tools/open-api';
import { Http } from '@/tools/http';
import config from '@/minio.credentials.json';
const ACCESS_KEY = config.accessKey;
const SECRET_KEY = config.secretKey;

const HOST = '36.155.7.145';
const PORT = 9000;
const SSL = false;
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
  abortSignal?: AbortSignal;
  onProgress?: (e: AxiosProgressEvent) => void;
}

type PresignHttpOptions = {
  fileName: string;
  fileType: string;
  fileHash: string;
  fileSize: number;
  signType: number;
  userId: string | number;
};

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

  const presignedHttp = async (params: PresignHttpOptions) => {
    const appid = config.httpAppId;
    const secret = config.httpSecret;
    const nonce = new Date().getTime();
    const action = 'sign';
    const { fileName, fileType, fileHash, fileSize, signType, userId } = params;
    const body = {
      userId: userId, //用户id，第三方用户标识
      fileName: fileName,
      fileContentType: fileType,
      fileHash: fileHash,
      size: fileSize,
      type: signType, //指定目标桶 0 media 1 archive
    };
    const signParams: any = { appid, nonce, action, requestBody: JSON.stringify(body) };
    signParams.sign = await sign(signParams, secret);
    const { _result, data } = await Http.getInstance().postJSON({
      url: `https://upload.emchub.ai/emc/api/client/userUpload/${action}`,
      data: signParams,
    });
    if (_result !== 0) {
      return null;
    }
    return {
      postURL: data.postURL,
      postFormData: data.postFormData,
      doneURL: data.doneURL,
      doneBody: data.doneBody,
    };
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
    let { file, headers, url, policyData: _policyData, onProgress, abortSignal } = params;

    const policyData = _policyData ? _policyData : await presignedPolicy(file);

    if (!policyData) {
      return { _result: 1, _desc: `presigned error` };
    }

    const formData = new FormData();
    Object.entries(policyData.postFormData).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append('file', file.file as File);
    const axios: Axios = new Axios({ timeout: 60 * 60 * 1000 });

    const onUploadProgress = (event: AxiosProgressEvent) => typeof onProgress === 'function' && onProgress(event);
    try {
      const resp = await axios.post(`${policyData.postURL}`, formData, {
        onUploadProgress,
        signal: abortSignal,
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
      if (isCancel(e)) {
        return { _result: -1, _desc: e.toString() };
      } else {
        return { _result: 1, _desc: e.toString() };
      }
    }
  };

  const getArchiveUrl = async (sn: string): Promise<{ expireTime: number; sn: string; url: string }> => {
    const resp = await Http.getInstance().get({
      url: `https://upload.emchub.ai/emc/api/client/userUpload/queryUrlBySn`,
      data: { sn },
    });
    const defaultData = { expireTime: 0, sn: '', url: '' };
    return resp.data ? Object.assign(defaultData, resp.data) : defaultData;
  };
  return {
    presignedHttp,
    upload,
    getArchiveUrl,
  };
}
