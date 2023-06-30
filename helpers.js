import * as fs from 'fs'


export async function writeFile(filename, writedata) {
    try {
      await fs.promises.writeFile(filename, JSON.stringify(writedata));
      console.log('data is written successfully in the file')
    }
    catch (err) {
        console.log(err)
      console.log('not able to write data in the file ')
    }
  }