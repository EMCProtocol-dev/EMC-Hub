export function navigateToSD(modelHashCode: string, parameters: string) {
  if (parameters) {
    const handleMessage = (event: MessageEvent) => {
      const request: any = event.data as any;
      if (request.type === 'emchub-txt2img-ready') {
        sdWindow?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters }, '*');
      }
      window.removeEventListener('message', handleMessage);
    };
    window.addEventListener('message', handleMessage);
  }

  const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : window.location.origin;
  const sdWindow: WindowProxy | null = window.open(`${host}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256:string){
    const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
    return _hashCodeSha256.substring(0, 10);

}