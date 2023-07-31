/******************************************************************************
****************  NASLOV Mjenjati datum  ************************
******************************************************************************/
const naslovKA = ' ERASMUS+ KEY ACTION 1 '
const naslovPXbig = ' TEACHER TRAINING COURSES IN SPLIT, CROATIA '
const datumBold = 'August 6th - August 12th 2023'
const header1 = 'Erasmus+ Courses Croatia Teacher Training Centre '
const header2 = '     2023'
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
let TecajPredavac = require('./tecajPredavacClass.js')
const jsonData = './data.json'
const helpers = require('./helpers.js')

let ukupnoLjudi = ''


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



async function getParticipantsData(grupeArr){ 
  try{
        const allCourses = getAllCourses()
        const courses = await allCourses.then( elem => { return elem })
       // console.log('tu ', courses.length)
       await grupeArr.forEach(grupa => {
            const groupSchedule = []  //=> sadrzi sve lekcije za pojedinu grupu!!! 
            let isMultiple = grupa.includes('=')
            let nameArray = grupa.split('=')
            let str = helpers.removeNonLetters(grupa)// izvlaci samo slova za usporedbu
            let matches = [...grupa].reduce((x, y) => helpers.check(y) ? x + y : x, '')
              if(isMultiple){
                ukupnoLjudi = nameArray[nameArray.length-1]
              }
              else ukupnoLjudi = matches
            for(let i=0; i <= (courses.length)-1; i++){  // prodji kroz lekcije
                let cGrup = courses[i].grupe    // izvuci jednu lekciju za provjeru grupa  test: console.log( cGrup.includes(str), cGrup, str ) ----> false CRE6+COLL3=9 GB or true GB7+INN1=8 GB
                // PROVJERA        
                if(cGrup.includes(str)){  // spremi lekciju u tecaj pa u niz => na kraju iz niza printaj objekte u celije
                    var tecajObj = new TecajGrupa(courses[i].datum_dan, courses[i].sati, courses[i].naziv, courses[i].predavac, courses[i].lokacija)                 
                    groupSchedule.push(tecajObj)
                }
                if(courses[i].grupe === undefined || courses[i].naziv === undefined || courses[i].datum_dan === undefined || courses[i].sati === undefined || courses[i].lokacija === undefined){
                  console.log(' ERROR ----> one of the empty fields in data.json ')
                }
            } 
          
            writeCoursesToWord(nameArray,groupSchedule)
            // PROVJERA:
            //groupSchedule => sadrzi sve lekcije za pojedinu grupu!!! 
            //console.log('\n \n generate table bf funk ', grupa , groupSchedule.length ) 
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

function writeCoursesToWord(nameArray, schedules){
  try{
        const docx = officegen('docx')
        const nazivgr = he_pkg.decode(helpers.getGrup(nameArray))  // izvuci naslov i dekodiraj ga 
        let fileName = `./raspored_grupe/${nameArray[0]}.docx`   // sprema u folder raspored_grupe
        
        const out = fs.createWriteStream(fileName)
        var header = docx.getHeader().createP()
   
        header.addText( header1, { font_face: 'Cambria', font_size : 10})      
        header.addText(header2, { color: 'blue', bold: true, font_face: 'Cambria', font_size : 10})
        header.options.align = 'right' 
        header.addText('')
        const parag2 = docx.createP()
        const nasl = docx.createP()
        const parag = docx.createP()  

        parag2.addText(`${naslovKA}`,{ font_face: "Cambria", align:'center', font_size : 14})
        nasl.addText(`${naslovPXbig}`,{ font_face: "Cambria", font_size : 16})
        
        parag.addText('\n'+`${nazivgr}`, {bold: true, font_face: "Cambria", font_size : 12})
        parag.addText('\n'+`${datumBold}`, {bold: true, font_face: "Cambria", font_size : 12})
        parag.options.align ='center'
        parag2.options.align ='center'
        nasl.options.align ='center'

     
        for(let i=0; i < schedules.length-1; i++){
              var table = [ [{
                                val:( `${ schedules[i].date }`).toString(),
                                opts: {
                                        cellColWidth: 2000,
                                        autoFit: true,
                                        align: 'center',
                                        sz: '24',
                                        fontFamily: 'Cambria'
                                      }
                                        },
                            {
                                val: (`${schedules[i].time}` +'\r\n'+ `${schedules[i].title}` + '\n' + `${schedules[i].prof}` +'\n Location: '+ `${schedules[i].location}`).toString() ,
                                  opts: {
                                     align: 'center',
                                     cellColWidth: 9000,
                                     sz: '24',
                                          }
                            }], 
                          ]

        var tableStyle = {
            tableColWidth: 65000,
            tableSize: 450,
            tableAlign: "center",
            tableFontFamily: "Cambria",
            borders: true,
          }

        docx.createTable(table, tableStyle)                  
        }
        //)  console.log(tecaj)
        docx.generate(out)
        
  }catch(err){
      console.log('error in WriteFile ===> ', err)
  }
  
}


async function getTeachersData(teachersArr){ 
  try{
        const allCourses = getAllCourses()
        const courses = await allCourses.then( elem => { return elem })

       await teachersArr.forEach(teacher => {           
            const teachersSchedule = []  //=> sadrzi sve lekcije za pojedinog profesora !!! 

             for(let i=0; i <= (courses.length)-1; i++){  // prodji kroz lekcije
                let prof = courses[i].predavac       
                let napomena = courses[i].napomena ? courses[i].napomena : ' '
                if(prof === teacher){  // spremi lekciju u rasp za profesora pa u niz => na kraju iz niza printaj objekte u celije
                    var tecajPredavacOb = new TecajPredavac(courses[i].datum_dan, courses[i].grupe ,courses[i].sati, courses[i].naziv, courses[i].predavac, courses[i].lokacija, napomena)                 
                    teachersSchedule.push(tecajPredavacOb)
                }
                 if(courses[i].grupe === undefined || courses[i].naziv === undefined || courses[i].datum_dan === undefined || courses[i].sati === undefined || courses[i].lokacija === undefined){
                  console.log(' ERROR ----> one of the empty fields in data.json ')
                }
            }       
            writeTeacherSchedule(teacher,teachersSchedule)
        })

  }catch(err){
    console.log(err)
  } 
}

function writeTeacherSchedule(teacher, schedules){
  try{
        const docx = officegen('docx')
        let fileName = `./raspored_nast/${teacher}_schedule.docx`   // sprema u folder raspored_nast
        
        const out = fs.createWriteStream(fileName)
        var header = docx.getHeader().createP()
   
        header.addText( header1, { font_face: 'Cambria', font_size : 10})      
        header.addText(header2, { color: 'blue', bold: true, font_face: 'Cambria', font_size : 10})
        header.options.align = 'right' 
        header.addText('')
        const parag2 = docx.createP()
        const nasl = docx.createP()
        const parag = docx.createP()  

        parag2.addText(`${naslovKA}`,{ font_face: "Cambria", align:'center', font_size : 14})
        nasl.addText(`${naslovPXbig}`,{ font_face: "Cambria", font_size : 16})
        
        parag.addText('\n'+`${helpers.getTeacherFullName([teacher])}`, {bold: true, font_face: "Cambria", font_size : 12})
        parag.addText('\n'+`${datumBold}`, {bold: true, font_face: "Cambria", font_size : 12})
        parag.options.align ='center'
        parag2.options.align ='center'
        nasl.options.align ='center'

     
        for(let i=0; i < schedules.length-1; i++){
           // console.log(typeof schedules[i].prof, schedules[i].prof )
      
              var table = [ [{
                              val:( `${ schedules[i].date }`).toString(),
                                opts: {
                                        cellColWidth: 2000,
                                        autoFit: true,
                                        align: 'center',
                                        sz: '22',
                                        fontFamily: 'Cambria'
                                      }
                                        },
                            {
                                val: (`${schedules[i].time}` +'\r\n'+ `${schedules[i].title}` + '\n\n' + `${schedules[i].info}` + '\n\n' + `${schedules[i].prof}` +'\n'+ `${schedules[i].groups}` +'\n\n Location: '+ `${schedules[i].location}`).toString() ,
                                  opts: {
                                     align: 'center',
                                     cellColWidth: 9500,
                                     sz: '22',
                                          }
                            }], 
                          ]

        var tableStyle = {
            tableColWidth: 65000,
            tableSize: 400,
            tableAlign: "center",
            tableFontFamily: "Cambria",
            borders: true,
          }

        docx.createTable(table, tableStyle)                  
        }
        //)  console.log(tecaj)
        docx.generate(out)
        
  }catch(err){
      console.log('error in WriteFile ===> ', err)
  }
  
}




const allGroups = helpers.getAllGroups().then(
  res => {
    console.log(' niz sa svim grupama ',res)
    getParticipantsData(res)
  }
)

const allTeachers = helpers.getTeachers().then(
  res=> {
      console.log('niz sa svim profesorima ',res)
      getTeachersData(res)
  }
 
)
