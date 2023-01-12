import User from "../schemas/user.js";
import https from "https";
import { appendFile, copyFile } from "fs/promises";
import { createWriteStream } from "fs";
import { isExistImage, removeFile } from "../utils/index.js";
import { API_PREFIX, STEP, WAIT_TIME, __dirname } from "../constants/index.js";

const fileName = "usersCrawled.txt";

const userImages = async (multibar) => {
  await removeFile(fileName);

  try {
    const totalUser = await User.count();
    const bar = multibar.create(totalUser, 0);
    for (let i = 0; i < Math.round(totalUser / STEP); i++) {
      const users = await getUser(i * STEP, STEP);
      for (const [index, user] of users.entries()) {
        await crawler(user);
        await logFile(user);
        bar.update(i * STEP + index);
      }
    }
    bar.update(totalUser);

    await copyFile(`${__dirname}/${fileName}`, `${__dirname}/logs/${fileName}`);

    await removeFile(fileName);
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (skip = 0, limit = STEP) => {
  return await User.find()
    .select({
      avatar: 1,
      kyc: {
        id_back: 1,
        id_front: 1,
        id_with_face: 1,
      },
    })
    .limit(limit)
    .skip(skip);
};

const crawler = async (user = {}) => {
  if (isExistImage(user.avatar)) {
    await new Promise((res) => {
      setTimeout(res, WAIT_TIME);
    });
    https.get(user.avatar, (res) => {
      const path = `${__dirname}/uploads/${user.avatar.split(API_PREFIX)[1]}`;
      const filePath = createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => filePath.close);
    });
  }

  if (!user.kyc) {
    return;
  }

  if (isExistImage(user.kyc.id_back)) {
    await new Promise((res) => {
      setTimeout(res, WAIT_TIME);
    });
    https.get(user.kyc.id_back, (res) => {
      const path = `${__dirname}/uploads/${
        user.kyc.id_back.split(API_PREFIX)[1]
      }`;
      const filePath = createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => filePath.close);
    });
  }

  if (isExistImage(user.kyc.id_front)) {
    await new Promise((res) => {
      setTimeout(res, WAIT_TIME);
    });
    https.get(user.kyc.id_front, (res) => {
      const path = `${__dirname}/uploads/${
        user.kyc.id_front.split(API_PREFIX)[1]
      }`;
      const filePath = createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => filePath.close);
    });
  }

  if (isExistImage(user.kyc.id_with_face)) {
    await new Promise((res) => {
      setTimeout(res, WAIT_TIME);
    });
    https.get(user.kyc.id_with_face, (res) => {
      const path = `${__dirname}/uploads/${
        user.kyc.id_with_face.split(API_PREFIX)[1]
      }`;
      const filePath = createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => filePath.close);
    });
  }
};

const logFile = async (user = {}) => {
  let content = `${isExistImage(user.avatar) ? user.avatar + "\n" : ""}`;

  if (!user.kyc) {
    return await appendFile(`${__dirname}/${fileName}`, content);
  }

  content = `${content}${
    isExistImage(user.kyc.id_front) ? user.kyc.id_front + "\n" : ""
  }${isExistImage(user.kyc.id_back) ? user.kyc.id_back + "\n" : ""}${
    isExistImage(user.kyc.id_with_face) ? user.kyc.id_with_face + "\n" : ""
  }`;

  return await appendFile(`${__dirname}/${fileName}`, content);
};

export default userImages;
