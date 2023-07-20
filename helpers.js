import fs from 'fs'
import tecaevi from './tecajeviObj.js'


async function writeFile(filename, writedata) {
    try {
      await fs.promises.writeFile(filename, JSON.stringify(writedata));
      console.log('data is written successfully in the file')
    }
    catch (err) {
        console.log('not able to write data in the file ', err)
    }
}

function isGroup(gr, str){
  let res = gr.find(v =>{
    if(v.includes(str)) return true
  })
  return res ? true : false
}

function check(x){
  let c = '0123456789'
  return c.includes(x) ? true : false;
}


function getGrup(nameArray){
  for (const [key, value] of Object.entries(tecaevi)){
      if(nameArray[0].includes(key)) return value
  }
  return nameArray[0]  
}

// pomocna funkcija 
function removeNonLetters(str){
  return str.replace(/[^a-z]/gi, '');
}

export default {
    writeFile, 
    isGroup, 
    check,
    getGrup,
    removeNonLetters
  }