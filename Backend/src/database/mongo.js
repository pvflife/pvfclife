/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from '../app.config';

// eslint-disable-next-line import/prefer-default-export
export const connection = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.url, { ...config.db.options }, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Connected to : ${res.connections[0].name} database`);
  });
};
