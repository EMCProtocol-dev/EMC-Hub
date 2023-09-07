export function navigateToSD(modelHashCode: string, parameters: string) {
  if (parameters) {
    const handleMessage = (event: MessageEvent) => {
      const request: any = event.data as any;
      if (request.type === 'emchub-txt2img-ready') {
<<<<<<< HEAD
<<<<<<< HEAD
        event.source?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters });
        window.removeEventListener('message', handleMessage);
      }
=======
        sdWindow?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters }, '*');
      }
      window.removeEventListener('message', handleMessage);
>>>>>>> 77b72c4 (~)
=======
        event.source?.postMessage({ type: 'emchub-txt2img-parameters', data: parameters });
        window.removeEventListener('message', handleMessage);
      }
>>>>>>> 3cf5440 (~)
    };
    window.addEventListener('message', handleMessage);
  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const sdWindow: WindowProxy | null = window.open(`${window.location.origin}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256: string) {
  const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
  return _hashCodeSha256.substring(0, 10);
}
=======
  const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://models.emchub.ai';
=======
  const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : window.location.origin;
>>>>>>> 6df9060 (~)
  const sdWindow: WindowProxy | null = window.open(`${host}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256:string){
    const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
    return _hashCodeSha256.substring(0, 10);

}
>>>>>>> 77b72c4 (~)
=======
  const sdWindow: WindowProxy | null = window.open(`${window.location.origin}/#/sd/${modelHashCode}`);
}

export function shortHashCodeSha256(hashCodeSha256: string) {
  const _hashCodeSha256 = (hashCodeSha256 || '-').trim().toLocaleLowerCase();
  return _hashCodeSha256.substring(0, 10);
}
>>>>>>> 3cf5440 (~)
