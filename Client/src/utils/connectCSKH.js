import { message } from 'antd';
import api from '../api';
import isCorrectNumberPhone from './isCorrectNumberPhone'

function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null;
  console.log('platform: ', platform);

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

export default async () => {
  try {
    const os = getOS();
    const { data } = await api.get('/users/sign-zalo');
    const contract = await api.get('/contracts');
    if (!data.data) {
      message.info('Bạn cần xác minh danh tính.');
      return;
    }
    if (contract?.data?.data?.length == 0) {
      message.info('Bạn cần tạo hồ sơ vay trước.');
      return;
    }
    if (isCorrectNumberPhone(data.data.supporter)) {
      if (os === 'Windows') {
        window.open(`https://zalo.me/${data.data.supporter}`)
      } else {
        window.location.assign(`https://zalo.me/${data.data.supporter}`);
      }
    } else {
      let idFB = data.data.supporter
      // window.location.assign(
      //   `fb://${os == 'iOS' ? 'profile' : 'page'}/${idFB ? '?id=' + idFB : data.data.supporter.phone}`
      // );
      if (os === 'Windows') {
        window.open(`https://facebook.com/` + idFB)
      } else {
        window.location.assign(
          `fb://${os == 'iOS' ? 'profile/' + idFB : 'page/' + idFB}`
        );
      }
    }

  } catch (err) {
    console.log("Lỗi", err);
    message.error('Xảy ra lỗi, vui lòng thử lại sau');
  }
};
