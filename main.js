/******************************************************************************
****************  NASLOV Mjenjati datum  ************************
******************************************************************************/
const naslovKA = ' ERASMUS+ KEY ACTION 1 '
const naslovPXbig = ' TEACHER TRAINING COURSES IN SPLIT, CROATIA '
const datumBold = 'June 23 th - July 29 st 2023'
/******************************************************************************
******************************************************************************
******************************************************************************/

import { Document, Packer, Paragraph, Table, TableCell, TableRow } from 'docx'
import fs from 'fs'
import {readFile} from 'fs/promises'

import  he_pkg from 'he' // ==> PAKET ZA FORMATIRANJE TEKSTA
//import { HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, VerticalAlign, TextDirection } from "docx"
//import * as docx from "docx"
//import * as fs from "fs"
const {decode} = he_pkg
const {createWriteStream} = fs

// ulazni parametri
import TecajGrupa from './tecajGrupaClass.js'
const jsonData = './data.json'
import helpers from './helpers.js'

const groupCourseArr = [] //raspored za grupe -> niz objekata TecajGrupa
const teachCourseArr = [] // raspored za ucitelje -> niz objekata TecajPredavac
let ukupnoLjudi = ''


/**
   *  Reads data from JSON file 
*/
// Podaci iz file-a -data.json 

async function getAllCourses(){
  try{
    const courses = [] // ALL Courses -> rasp za nas
    await readFile(jsonData, 'utf8')
      .then(data => {
          let parsedData = JSON.parse(data)
            parsedData.forEach(element => {
                  courses.push(element)   // iz courses izvuc profesore
            })
      }).catch(err => console.log(err))
    
      return courses
  
  }catch(err){
    console.log('-------error reading json ', err)
  }
}

async function getAllGroups(){
    let grupeArr = []
    let grupe = []
    await readFile(jsonData, 'utf8')
    .then(d => {
      let data = JSON.parse(d)

      if(Array.isArray(data)){
         data.forEach(element => {
          
          let grupeStr = element.grupe
          let lections = grupeStr.split("+")
          lections.forEach(le => {
            let str = helpers.removeNonLetters(le)
            const found = helpers.isGroup(grupe, str)
            if(!found){
              grupe.push(le)
            }
          })
          grupeArr.push(lections)  // grupe po lekciji - koja grupa slusa lekciju -> ubaci u grupeArr   
        })
      }
          
    /**   zapis svih grupa u txt file     
     * fs.writeFile('./test.txt', JSON.stringify(grupeArr), err => {
          if(err){
              console.error(err);
          }
          // file written successfully
        }) **/    
    }).catch(err => console.log(err))
    
    return grupe
}

async function GenerateTablePariticipants(grupeArr){
 
  try{
        const courses = await allCourses.then( elem => { return elem })
        
        grupeArr.forEach(grupa => {
            const groupSchedule = []
            let str = removeNonLetters(grupa) // izvlaci samo slova za usporedbu
            for(let i=0; i < courses.length; i++){  // prodji kroz lekcije
                let cGrup = courses[i].grupe    // izvuci jednu lekciju za provjeru grupa  test: console.log( cGrup.includes(str), cGrup, str ) ----> false CRE6+COLL3=9 GB or true GB7+INN1=8 GB
                // PROVJERA        
                if(cGrup.includes(str)){  // spremi lekciju u tecaj pa u niz => na kraju iz niza printaj objekte u celije
                    var tecajObj = new TecajGrupa(courses[i].datum_dan,courses[i].sati, courses[i].naziv, courses[i].predavac, courses[i].lokacija)
                    groupSchedule.push(tecajObj)
                    //console.log(tecajObj)
                }
            }
            printSchedule_Groups(groupSchedule, grupa)
            //groupSchedule => sadrzi sve lekcije za pojedinu grupu!!!
            //console.log('\n \n generate table bf funk ', grupa , groupSchedule.length)
          
        })

//******************************************************************************************  
//****************************************************************************************** 
/**      
  PRIMJER: 
   elem je niz objekata lekcija
  let prAr = ["SEN4", "ICT3", "MH3", "GB7", "CRE6"]
  let neki = "CRE6+COLL3+MH3"
  grupeArr.forEach( grupa => {
    //console.log(popis.includes(grupa))
  })
    grupeArr.forEach( grupe => {  // grupe => niz sa kraticama grupa
    //console.log(grupe)
      elem.forEach(obj => {  // loop kroz svaki objekt (pristup za string grupa)
        grupe.forEach( group => { //grupa string => format: "grupaBrojPolaznika"
          let grupeStrAr = obj.grupe
          if(grupeStrAr.includes(group)){
            console.log('--',grupeStrAr, ' ',group)
            // dodat objekt ELEM u word s naslovom i datumom za svaku grupu  
          }     
        })
      })
         // spremi lekciju u tecaj pa u niz => na kraju iz niza printaj objekte u celije
         //var tecajObj = new TecajGrupa(); 
         //console.log('tuu ') 
    }) */ 

  }catch(err){
    console.log(err)
  } 
}     


function printSchedule_Groups(arrayOfLectures, groupName){  // izvlaci broj ljudi i inicijale grupe za naslov file-a
  
    let isMultiple = groupName.includes('=')
    let nameArray = groupName.split('=')
    let matches = [...groupName].reduce((x, y) => helpers.check(y) ? x + y : x, '')
    if(isMultiple){
      ukupnoLjudi = nameArray[nameArray.length-1]
    }
    else ukupnoLjudi = matches
    const nazivgr = decode(helpers.getGrup(nameArray))  // izvuci naslov i dekodiraj ga 
  
  //console.log('printSchedule_Groups FCJA => ', groupName, ukupnoLjudi)
   
  const doc = new Document({
    sections: [{
        properties: {
          creator: "AT005818",
          description: "Erasmus KA1 Courses Timetable",
          title: nazivgr
        },
        children: [
            new Paragraph({
                children: [
                    new TextRun("Hello World"),
                    new TextRun({
                        text: "Foo Bar",
                        bold: true,
                    }),
                    new TextRun({
                        text: "\tGithub is the best",
                        bold: true,
                    }),
                ],
            }),
        ],
    }],
})
   

    // console.log(' kraj ', nameArray[0])
    // Used to export the file into a .docx file
   
  
  
    let fileName = `./raspored_grupe/${nameArray[0]}.docx`
    const packer = new Packer()

    Packer.toBuffer(doc).then((buffer) => {
      createWriteStream(`./raspored_grupe/${nameArray[0]}.docx`, buffer);
    })
    //fs.writeFileSync('output.docx', buffer);

}    


function GenerateTableTeachers(){
   
}


const allCourses = getAllCourses()
const allGroups = getAllGroups()

allGroups.then( el =>{
  GenerateTablePariticipants(el)
} )


