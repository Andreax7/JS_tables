/**
   *  Reads data from JSON file 
*/
// di god je \n treba JSON.stringify -> property objekta, ne sve!
const docx = require('docx')
const fs = require('fs')
const jsonfile = require('jsonfile')
//import * as docx from "docx"
//import * as fs from "fs"


const TecajPredavac = require('./tecajPredavacClass.js')
const TecajGrupa = require('./tecajGrupaClass.js')

// ulazni parametri 
const CourseNames = require('./tecajeviObj.js') 
const jsonData = './data.json'


const groupCourseArr = [] //raspored za grupe -> niz objekata TecajGrupa
const teachCourseArr = [] // raspored za ucitelje -> niz objekata TecajPredavac
const courses = [] // ALL Courses -> rasp za nas
let ukupnoLjudi = ''
let grupeArr = []

// Podaci iz file-a -data.json 
jsonfile.readFile(jsonData)
  .then(data => {
      data.forEach(element => {
         let grupeStr = element.grupe
         courses.push(element)   // iz courses izvuc profesore
         //console.log(grupeStr)
         let lections = grupeStr.split("+") // grupe po lekciji - koja grupa slusa lekciju -> ubaci u GroupCourseArr
         grupeArr.push(lections)
      })

      const tableGroup = GenerateTablePariticipants(courses, grupeArr) // napuni tecajeve -> prebaci u word -> isprazni niz niz.length=0 => sljedeca grupa  
      
      //GenerateTableTeachers(courses)
      //groupCourseArr.forEach(course => console.log(course))
      //console.log(element)
  })
  .catch(err => console.log(err))


function GenerateTablePariticipants(grupeArr){
   let cnt = Object.entries(CourseNames).length
   console.log('-cnt -   ', elem)

  // grupeArr.forEach( uk => {
   //      grupeArr = uk.split("+") // grupe po lekciji - koja grupa slusa lekciju -> ubaci u GroupCourseArr
   //         if(uk.includes('=')){
  //             ukupnoLjudi = (uk.split('='))[1] 
    //        }
   //})
  // console.log(grupeArr)

       
}

function GenerateTableTeachers(){
   
}
  


