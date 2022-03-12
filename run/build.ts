import { promises as fs } from 'fs';
import path from 'path';
import { FileItem } from '../src/modules/builder/builder.interface';

const buildFile = path.join(__dirname, 'build', 'data.json');
const thumbnailPath = path.join(__dirname, 'build', 'thumb');

fs.readdir(thumbnailPath).then(files => {
  const fileMap: Map<string, FileItem> = new Map();
  for (const file of files) {
    const split = file.split('.');
    const id = split[0];
    const duration = parseInt(split[1]);
    const select = parseInt(split[2]);
    fileMap.set(id, { id, duration, select });
  }

  const result: FileItem[] = Array.from(fileMap.values());
  fs.writeFile(buildFile, JSON.stringify(result, null, 2)).then(() => {
    console.log('Finished');
    process.exit();
  });
});
