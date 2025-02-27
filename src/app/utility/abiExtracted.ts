import fs from "fs";
import path from 'path';

const filePath = path.join(process.cwd(), 'contracts', 'abi.json');
export const abi = JSON.parse(fs.readFileSync(filePath, 'utf-8'));