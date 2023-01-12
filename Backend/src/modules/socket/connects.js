/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import User from '../../collections/user';
import * as notiService from '../notifications/services';

function disconnect(socket) {
  socket.on('disconnect', (payload) => {});
}

function joinChannel(socket, io) {
  socket.on('join-channel', (payload) => {
    socket.join(payload._id);
  });
}

function pushNotification(socket, io) {
  socket.on('push-notifications', async (payload) => {
    const root = await User.findOne({ role: 'ROOT' });
    const data = await notiService.createNotification({
      status: false,
      to: String(payload.to) === 'root' ? root._id : payload.to,
      message: payload.message,
      description: payload.description,
    });
    socket.to(payload.to).emit('recieve-notification', {
      _id: data._id,
      message: payload.message,
      description: payload.description,
      status: false,
      to: String(payload.to) === 'root' ? root._id : payload.to,
    });
  });
}

function initEvent(socket, io) {
  try {
    pushNotification(socket, io);
    disconnect(socket);
    joinChannel(socket, io);
  } catch (error) {
    console.log(error);
  }
}

export function connect(io) {
  try {
    io.on('connection', (socket) => {
      initEvent(socket, io);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connect,
};
