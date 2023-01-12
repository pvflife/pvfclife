import mongoose from "mongoose";
import chalk from "chalk";
import userImages from "./crawlers/userImages.js";
import contractImages from "./crawlers/contractImages.js";
import cliProgress from "cli-progress";
import { createZipArchive } from "./utils/index.js";

const DATABASE = "pvflife";
const main = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(`mongodb://localhost:27017/${DATABASE}`)
    .then(() => {
      console.log(
        chalk.bgGreen("Database connected to database:") +
          chalk.green(" " + DATABASE)
      );
    })
    .catch((err) => {
      console.log(chalk.bgRed(err));
    });

  const multibar = new cliProgress.MultiBar({
    barCompleteChar: "\u2588",
    hideCursor: true,
    clearOnComplete: false,
  });

  try {
    console.log(chalk.bgRedBright("\n ==== Start crawling ==== \n"));

    await Promise.all([userImages(multibar), contractImages(multibar)]);

    multibar.stop();
    console.log(chalk.bgRedBright("\n ==== Crawled successfully ==== \n"));

    await createZipArchive();
  } catch (error) {
    console.error(error);
  }
};

main();
