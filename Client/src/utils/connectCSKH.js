/* eslint-disable import/no-anonymous-default-export */
import { message } from 'antd';
import api from '../api';

function getOS() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device
    return 'mobile';
  } else {
    // false for not mobile device
    return 'windows';
  }
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

    if (contract?.data?.data?.length === 0) {
      message.info('Bạn cần tạo hồ sơ vay trước.');
      return;
    }

    if (os === 'windows') {
      window.open(data.data.supporter);
    } else {
      window.location.assign(data.data.supporter);
    }
  } catch (err) {
    console.log('Lỗi', err);
    message.error('Xảy ra lỗi, vui lòng thử lại sau');
  }
};
