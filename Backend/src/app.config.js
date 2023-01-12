require('dotenv').config();

const username = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD
const database = process.env.MONGO_DATABASE

export default {
  port: process.env.PORT,
  db: {
    url: `mongodb+srv://${username}:${password}@${database}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 10,
    },
  },
  secret_key: process.env.SECRET_KEY,
  time_life_token: '100h',
  app: {
    role: ['USER', 'ADMIN', 'ROOT'],
    contract_status: ['pending', 'accepted', 'rejected'],
    kyc_status: ['pending', 'accepted', 'rejected'],
    withdraw_status: ['pending', 'accepted', 'rejected'],
  },
};
