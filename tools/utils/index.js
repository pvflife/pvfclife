import { API_PREFIX, __dirname } from "../constants/index.js";
import { unlink } from "fs/promises";
import AdmZip from "adm-zip";

export const isExistImage = (path = "") => {
  return path.includes(API_PREFIX);
};

export const removeFile = async (path = "") => {
  try {
    await unlink(`${__dirname}/${path}`);
  } catch (error) {}
};

export const createZipArchive = async () => {
  try {
    const zip = new AdmZip();
    const outputFile = "uploads.zip";
    zip.addLocalFolder(`${__dirname}/uploads`);
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
};
