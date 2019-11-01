export function setStorageSettings(settings) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem('url', settings.url);
      localStorage.setItem('apikey', settings.apikey);

      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export function getStorageSettings() {
  return new Promise((resolve, reject) => {
    try {
      const url = localStorage.getItem('url');
      const apikey = localStorage.getItem('apikey');

      resolve({ url, apikey });
    } catch (e) {
      reject(e);
    }
  });
}