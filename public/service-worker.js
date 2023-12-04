self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.info('sw installed');
  self.__WB_MANIFEST;
});
