import Contract from "../schemas/contract.js";
import https from "https";
import { appendFile, copyFile } from "fs/promises";
import { createWriteStream } from "fs";
import { isExistImage, removeFile } from "../utils/index.js";
import { API_PREFIX, STEP, WAIT_TIME, __dirname } from "../constants/index.js";

const fileName = "contractsCrawled.txt";

const contractImages = async (multibar) => {
  await removeFile(fileName);

  try {
    const totalContract = await Contract.count();
    const bar = multibar.create(totalContract, 0);
    for (let i = 0; i < Math.round(totalContract / STEP); i++) {
      const users = await getContract(i * STEP, STEP);
      for (const [index, user] of users.entries()) {
        await crawler(user);
        await logFile(user);
        bar.update(i * STEP + index);
      }
    }
    bar.update(totalContract);

    await copyFile(`${__dirname}/${fileName}`, `${__dirname}/logs/${fileName}`);

    await removeFile(fileName);
  } catch (error) {
    console.log(error);
  }
};

const getContract = async (skip = 0, limit = STEP) => {
  return await Contract.find()
    .select("signature_capture")
    .limit(limit)
    .skip(skip);
};

const crawler = async (contract = {}) => {
  if (isExistImage(contract.signature_capture)) {
    await new Promise((res) => {
      setTimeout(res, WAIT_TIME);
    });
    https.get(contract.signature_capture, (res) => {
      const path = `${__dirname}/uploads/${
        contract.signature_capture.split(API_PREFIX)[1]
      }`;
      const filePath = createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => filePath.close);
    });
  }
};

const logFile = async (contract = {}) => {
  let content = `${
    isExistImage(contract.signature_capture)
      ? contract.signature_capture + "\n"
      : ""
  }`;

  return await appendFile(`${__dirname}/${fileName}`, content);
};

export default contractImages;
