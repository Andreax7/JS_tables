/******************************************************************************
****************  NASLOV Mjenjati datum  ************************
******************************************************************************/
const naslovKA = ' ERASMUS+ KEY ACTION 1 '
const naslovPXbig = ' TEACHER TRAINING COURSES IN SPLIT, CROATIA '
const datumBold = 'June 23 th - July 29 st 2023'
/******************************************************************************
******************************************************************************
******************************************************************************/
const officegen = require('officegen')
const fs = require('fs')
const fsp = require('fs').promises
const he_pkg = require('he') // ==> PAKET ZA FORMATIRANJE TEKSTA
//import { HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, VerticalAlign, TextDirection } from "docx"
//import * as docx from "docx"
//import * as fs from "fs"

// ulazni parametri
let TecajGrupa = require('./tecajGrupaClass.js')
const jsonData = './data.json'
let helpers = require('./helpers.js')

let ukupnoLjudi = ''

/**
   *  Reads data from JSON file 
*/
// Podaci iz file-a -data.json 

function getAllCourses(){
  try{  
      return new Promise((resolve, reject) => {
          const courses = [] // ALL Courses -> rasp za nas
          fs.readFile(jsonData, 'utf8', ((err, data) => {
            if(err){return reject(err)} 
            let parsedData = JSON.parse(data)
            parsedData.forEach(element => {
                  courses.push(element)   // iz courses izvuc profesore
            })
            resolve(courses)
          }))
      })
  }catch(err){
    console.log('-------error reading json ', err)
  }
}

function getAllGroups(){ 
  try{ 
    let grupeArr = []
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
                          let str = helpers.removeNonLetters(le)
                          const found = helpers.isGroup(grupe, str)
                          if(!found){
                            grupe.push(le)
                          }
                    })
                    grupeArr.push(lections)  // grupe po lekciji - koja grupa slusa lekciju -> ubaci u grupeArr   
              })
            }  
            resolve(grupe)
          }))
    })
  }catch(err){
    console.log(err)
  }
  
}

async function getParticipantsData(grupeArr){
 
  try{
        const allCourses = getAllCourses()
        const courses = await allCourses.then( elem => { return elem })
       // console.log('tu ', courses.length)
       await grupeArr.forEach(grupa => {
            const groupSchedule = []
            let isMultiple = grupa.includes('=')
            let nameArray = grupa.split('=')
            let str = helpers.removeNonLetters(grupa) // izvlaci samo slova za usporedbu
            let matches = [...grupa].reduce((x, y) => helpers.check(y) ? x + y : x, '')
              if(isMultiple){
                ukupnoLjudi = nameArray[nameArray.length-1]
              }
              else ukupnoLjudi = matches
            for(let i=0; i < courses.length; i++){  // prodji kroz lekcije
                let cGrup = courses[i].grupe    // izvuci jednu lekciju za provjeru grupa  test: console.log( cGrup.includes(str), cGrup, str ) ----> false CRE6+COLL3=9 GB or true GB7+INN1=8 GB
                // PROVJERA        
                if(cGrup.includes(str)){  // spremi lekciju u tecaj pa u niz => na kraju iz niza printaj objekte u celije
                    var tecajObj = new TecajGrupa(courses[i].datum_dan,courses[i].sati, courses[i].naziv, courses[i].predavac, courses[i].lokacija)
                    groupSchedule.push(tecajObj)
                }
            }  
      
        writeToFile(nameArray,groupSchedule)
           // printSchedule_Groups(groupSchedule, grupa)
            //groupSchedule => sadrzi sve lekcije za pojedinu grupu!!! 
            //console.log('\n \n generate table bf funk ', grupa , groupSchedule.length 
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

let cnt = 0
async function printSchedule_Groups(arrayOfLectures, groupName){  // izvlaci broj ljudi i inicijale grupe za naslov file-a
    try{
        let isMultiple = groupName.includes('=')
        let nameArray = groupName.split('=')
        let matches = [...groupName].reduce((x, y) => helpers.check(y) ? x + y : x, '')
        if(isMultiple){
          ukupnoLjudi = nameArray[nameArray.length-1]
        }
        else ukupnoLjudi = matches
        
    }catch(err){
      console.log(' error in printSchedule_Groups ===> ', err)
    }
    
  //console.log('printSchedule_Groups FCJA => ', groupName, ukupnoLjudi)
  
  // Used to export the file into a .docx file
   
   
    //out.on('error', function(err){
      //console.log(err)
    //})
    
    //
   
   // Packer.toBuffer(doc).then((buffer) => {
    //createWriteStream(`./raspored_grupe/${nameArray[0]}.docx`,buffer)
    //})
    //fs.writeFileSync('output.docx', buffer);
}    


function writeToFile(nameArray, schedules){
  try{
        const docx = officegen('docx')
        const nazivgr = he_pkg.decode(helpers.getGrup(nameArray))  // izvuci naslov i dekodiraj ga 
        let fileName = `./raspored_grupe/${nameArray[0]}.docx`
        
        const out = fs.createWriteStream(fileName)
        var header = docx.getHeader().createP()
   
        header.addText( 'Erasmus+ Courses Croatia Teacher Training Centre ', { font_face: 'Cambria', font_size : 10})      
        header.addText('   2023', { color: 'blue', bold: true, font_face: 'Cambria', font_size : 10})
        header.options.align = 'right'  
        const parag2 = docx.createP()
        const nasl = docx.createP()
        const parag = docx.createP()  

        parag2.addText(`${naslovKA}`,{ font_face: "Cambria", align:'center', font_size : 18})
        nasl.addText('\n'+`${naslovPXbig}`,{ font_face: "Cambria", font_size : 16})
      
        parag.addText('\n'+`${nazivgr}`, {bold: true})
        parag.addText('\n'+`${datumBold}`, {bold: true})
        parag.options.align ='center'
        parag2.options.align ='center'
        nasl.options.align ='center'

        for(let i=0; i < schedules.length-1; i++){
            console.log(nameArray, schedules[i].date)
              var table = [ [{
                                val: `${schedules[i].date} \n`,
                                opts: {
                                        cellColWidth: 42,
                                        align: 'center',
                                        b: true,
                                        sz: '11',
                                        fontFamily: 'Cambria'
                                      }
                                        },
                            {
                                val: ` ${schedules[i].time} \n ${schedules[i].title}  ${schedules[i].prof} \n ${schedules[i].location} ` ,
                                  opts: {
                                    align: 'center',
                                    cellColWidth: 42,
                                    b: true,
                                    sz: '11',
                                          }
                            }], 
                          ]

        var tableStyle = {
            tableColWidth: 4261,
            tableSize: "auto",
            tableAlign: "center",
            tableFontFamily: "Cambria",
            borders: true   
          }
       
          
      
    
        docx.createTable(table, tableStyle)                  

        }
        
                          //)  console.log(tecaj)
                  

          
        docx.generate(out)
        
  }catch(err){
      console.log('error in WriteFile ===> ', err)
  }
  
}


function GenerateTableTeachers(){
   
}



const allGroups = getAllGroups().then(
  res => getParticipantsData(res)
)



