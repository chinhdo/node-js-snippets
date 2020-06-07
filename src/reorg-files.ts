import fs from "fs";
import path from "path";

/** Reorg files into folders yyyy/mm/dd */
class PhotoUtils {
  private rootDir = "d:\\OneDrive\\Pictures\\";
  private numPhotosMoved = 0;

  reorgFolder() {
    const srcFolder = "d:\\OneDrive\\Pictures\\2019";

    this.traverseDir(srcFolder);

    console.log(`Done. photos=${this.numPhotosMoved}.`);
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  private traverseDir(dir: string) {
    fs.readdirSync(dir).forEach(item => {
      const currPath = path.join(dir, item);
      if (fs.lstatSync(currPath).isDirectory()) {
        this.traverseDir(currPath);

        // Check if empty
        const items = fs.readdirSync(currPath);
        console.log(`${currPath} ${items.length}.`);
        if (items.length === 0) {
          console.log(`Deleting empty directory ${currPath}.`);
          fs.rmdirSync(currPath);
        }
      } else {
        // Process file
        if (dir.match(/(\d{4})-\d{2}-\d{2}/)) {
          const regexp = /(?<year>\d{4})\-(?<month>\d{2})\-(?<day>\d{2})/g;
          const matches = regexp.exec(dir);
          const year = matches.groups["year"];
          const month = matches.groups["month"];
          const day = matches.groups["day"];

          const newPath = `${this.rootDir}${year}\\${month}\\${day}\\${item}`;
          this.ensureDir(`${this.rootDir}${year}`);
          this.ensureDir(`${this.rootDir}${year}\\${month}`);
          this.ensureDir(`${this.rootDir}${year}\\${month}\\${day}`);

          console.log(`${currPath} -> ${newPath}`);

          fs.renameSync(currPath, newPath);
          this.numPhotosMoved++;
        }
      }
    });
  }
}

export default PhotoUtils;