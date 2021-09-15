import { PrinterDriverInterface, PrintingResult } from '.';
import fs from 'fs';
import os from 'os';
import path from 'path';
const exec = require("child_process").exec;
const tga2png = require("tga2png");

export default class CupsPrinterDriver implements PrinterDriverInterface {
    async print(buffer: Buffer): Promise<PrintingResult> {
      return new Promise(resolve => {
        const tempDir = path.join(os.tmpdir(), 'sirius-client');
        fs.mkdirSync(tempDir, { recursive: true });
  
        const tempFile = path.join(tempDir, 'to_print.bmp');
  
        fs.writeFileSync(tempFile, buffer);
        console.log(`Written: ${tempFile}`);

        const newTempFile = path.join(tempDir, 'to_print.png')

        tga2png(tempFile, newTempFile);
        exec('lq ' + newTempFile);
        // const bitmap = bitmapify(buffer);
        //termImg(buffer);
        resolve();
      });
    }
  }