import { PrinterDriverInterface, PrintingResult } from '.';
import fs from 'fs';
import os from 'os';
import path from 'path';
import gm from 'gm';
const exec = require("child_process").exec;

const im = gm.subClass({ imageMagick: true });

const pnger = async (buf: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    im(buf)
      .colors(2)
      .define('png:bit-depth=1')
      .toBuffer('PNG', (err, out) => {
        if (err) {
          return reject(err);
        }

        return resolve(out);
      });
  });
};

export default class CupsPrinterDriver implements PrinterDriverInterface {
    async print(buffer: Buffer): Promise<PrintingResult> {
      const png = await(pnger(buffer));
      return new Promise(resolve => {
        const tempDir = path.join(os.tmpdir(), 'sirius-client');
        fs.mkdirSync(tempDir, { recursive: true });
  
        const tempFile = path.join(tempDir, 'to_print.png');
  
        fs.writeFileSync(tempFile, png);
        console.log(`Written: ${tempFile}`);

        exec('lq ' + tempFile);
        // const bitmap = bitmapify(buffer);
        //termImg(buffer);
        return resolve(buffer);
      });
    }
  }