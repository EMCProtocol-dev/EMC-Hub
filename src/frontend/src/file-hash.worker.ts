addEventListener('message', (e: any) => {
  const { data } = e;
  console.log(data);
  setTimeout(() => {
    return postMessage('线程完成');
  }, 1000);
});

export default class FileHashWorker {
  postMessage(message: any): void {}
}
