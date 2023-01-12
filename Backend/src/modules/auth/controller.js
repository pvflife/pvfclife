/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
import * as service from './service';
// import config from '../../app.config';

export const signup = async (req, res) => {
  try {
    // eslint-disable-next-line no-inner-declarations
    function isVietnamesePhoneNumber(number) {
      return /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(number);
    }

    const phoneNum = req.body.phone;

    if (isVietnamesePhoneNumber(phoneNum) && phoneNum.length < 13) {
      const user = await service.createUser({ ...req.body });
      if (user.code === 405) {
        return res.status(201).json({ success: true, ...user });
      }

      const token = await service.createToken({
        _id: user._id,
        role: user.role,
      });
      return res
        .status(200)
        .json({ success: true, access_token: token, role: user.role });
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid phone number' });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await service.signin({ ...req.body });

    const token = await service.createToken({
      _id: user._id,
      role: user.role,
    });

    return res
      .status(200)
      .json({ success: true, access_token: token, role: user.role });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const verify = async (req, res) => {
  try {
    const user = await service.verifyCode({
      phone: req.body.phone,
      code: req.body.code,
    });
    const token = await service.createToken({ _id: user._id, role: user.role });
    return res.status(200).json({ access_token: token });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    if (req.role === 'USER') {
      const { password } = req.body;
      await service.updatePassword({ userId: req.user, password });
    } else {
      const { password, userId } = req.body;
      await service.updatePassword({ userId, password });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    await service.createAdmin({
      phone: req.body.name,
      password: req.body.password,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
