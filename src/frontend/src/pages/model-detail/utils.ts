export function navigateToSD(modelHashCode: string, parameters: string) {
  if (parameters) {
    const handleMessage = (event: MessageEvent) => {
      const request: any = event.data as any;
      if (request.type === 'emchub-txt2img-ready') {
        event.source?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters });
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  }

  const sdWindow: WindowProxy | null = window.open(`${window.location.origin}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256: string) {
  const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
  return _hashCodeSha256.substring(0, 10);
}
