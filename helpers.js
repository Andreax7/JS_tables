const fs = require('fs')
const tecaevi = require('./tecajeviObj.js')
const prof = require('./predavacObj.js')
const jsonData = './data.json'

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

function getGrup(nameArray){
  for (const [key, value] of Object.entries(tecaevi)){
      if(nameArray[0].includes(key)) return value
  }
  return nameArray[0]  
}


function getTeacherFullName(name){
  for (const [key, value] of Object.entries(prof)){
    if(name[0] === key) return value
    }
  return name[0]  
}


function check(x){
  let c = '0123456789'
  return c.includes(x) ? true : false;
}


// pomocna funkcija 
function removeNonLetters(str){
  return str.replace(/[^a-z]/gi, '');
}

function getAllGroups(){ 
  try{ 
    let grupe = []
    return new Promise((resolve, reject) => {
          fs.readFile(jsonData, 'utf8', ((err, data) => {   
            if(err){return reject(err)} 
            let parsedData = JSON.parse(data)
            if(Array.isArray(parsedData)){
              parsedData.forEach(element => {
                  let grupeStr = element.grupe
                  let lections = grupeStr.split("+")
                    lections.forEach(le => {
                          let str = removeNonLetters(le)
                          const found = isGroup(grupe, str) // vraca true ako je grupa nije u nizu
                          if(!found){
                            grupe.push(le)// grupe po lekciji - koja grupa slusa lekciju -> ubaci u grupe 
                          }
                    })
              })
            }
            resolve(grupe)
          }))
    })
  }catch(err){
    console.log(err)
  }
}

function getTeachers(){ 
  try{ 
    let TeachersArr = []   
    return new Promise((resolve, reject) => {
          fs.readFile(jsonData, 'utf8', ((err, data) => {   
            if(err){return reject(err)} 
            let parsedData = JSON.parse(data)
            if(Array.isArray(parsedData)){
              parsedData.forEach(element => {
                  let predavacStr = element.predavac          
                  if(predavacStr.includes("+")){
                    let ifMultiple = predavacStr.split("+")
                    ifMultiple.forEach(pred => {
                          let str = pred
                          if(!TeachersArr.includes(str)){
                            TeachersArr.push(str)
                          }
                    })
                  }
                  else{
                    if(!TeachersArr.includes(predavacStr)){
                       TeachersArr.push(predavacStr)
                    } 
                  }          
              })
            }  
            resolve(TeachersArr)
          }))
    })
  }catch(err){
    console.log(err)
  }
}

module.exports = {
    writeFile, 
    check,
    getGrup,
    getAllGroups,
    getTeachers,
    getTeacherFullName,
    removeNonLetters
  }