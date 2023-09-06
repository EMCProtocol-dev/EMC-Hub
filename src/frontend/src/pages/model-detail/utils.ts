export function navigateToSD(modelHashCode: string, parameters: string) {
  if (parameters) {
    const handleMessage = (event: MessageEvent) => {
      const request: any = event.data as any;
      if (request.type === 'emchub-txt2img-ready') {
<<<<<<< HEAD
        event.source?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters });
        window.removeEventListener('message', handleMessage);
      }
=======
        sdWindow?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters }, '*');
      }
      window.removeEventListener('message', handleMessage);
>>>>>>> 77b72c4 (~)
    };
    window.addEventListener('message', handleMessage);
  }

<<<<<<< HEAD
  const sdWindow: WindowProxy | null = window.open(`${window.location.origin}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256: string) {
  const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
  return _hashCodeSha256.substring(0, 10);
}
=======
  const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://models.emchub.ai';
  const sdWindow: WindowProxy | null = window.open(`${host}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256:string){
    const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
    return _hashCodeSha256.substring(0, 10);

}
>>>>>>> 77b72c4 (~)
