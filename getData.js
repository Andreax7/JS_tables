async function getExcel_data(filepath, sheetName) {
    try{
      var workbook = new excel.Workbook();
     // var data =
       return workbook.xlsx.readFile(filepath).then(function () {
          var rowData = []; 
          var worksheet = workbook.getWorksheet(sheetName);
      
          worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
              for (let i=0; i < rowNumber; i++){
  
                  if( typeof row.values[i] !== 'undefined'){
                    console.log(typeof row.values[i] !== 'undefined', typeof row.values[i], row.values[i]   )
                      //console.log(rowNumber, ' i  ', typeof row.values[i])
                      rowData.push(row.values[i])
                      //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values))
                  }
              } 
              //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          });
          return rowData     
      }).catch(err=>console.log(err))
     // return data
  
    }catch(error){
      return error
    }
  }



/// VERZIJA 2.

/**
   * Reads data from an excel file and returns into a 2-d array
   *  filepath absolute path of the file
   *  sheetName sheet name to be read from
  */

//const excel = require("exceljs")
//const xlsx = require('xlsx')
//const fs = require('fs')
import excel from 'exceljs'
import xlsx from 'xlsx'
import Tecaj from './tecaj.js'
import { writeFile } from './helpers.js'

// ulazni parametri 
const filepath = "./raspored_25_6-1_7_2023.xlsx" // ime rasporeda - mora bit u istom folderu!
const sheetName =  "Sheet1"
const dayColumn = 'A'
const locationRow = '2'
const locationArray = ['TESLINA 1', 'TESLINA 2', 'PROSTOR', 'ARHITEKTI', 'BENE', 'ANTOIČIN MLIN', 'SUSTIPAN', 'GRGUR', 'OTŠ', 'JURAJ BONAČI']
var naslov = ""





// glavna funkcija čita podatke iz rasporeda
async function getExcel_data(filepath, sheetName) {
  try{
    var workbook = new excel.Workbook();
    
    return workbook.xlsx.readFile(filepath).then(function() {
        var allData = []; 
        var tecajObj = new Tecaj();

        var worksheet = workbook.getWorksheet(sheetName);
    
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
          row.eachCell({ includeEmpty: false }, function(cell, colNumber) {
           
            if(rowNumber == 1){ // izdvojit naslov i transformirat podatke
             naslov += ''
            }

            else{
  //----------------------------------------------------------------------------
  //      PODACI (STRING, OBJEKT) : TRANSFORMACIJA 
  //      (kreirati objekt Tecaj sa podacima i ubacit ih u niz objekata)
  //----------------------------------------------------------------------------            
                if(typeof cell.value === 'string'){  // --> podaci po ćelijama - za string podatke(bez boja)
                  //console.log('------',rowNumber, colNumber, cell.address)
                  allData.push(cell.value)
                  console.log(' ----- ',cell.value, cell.address , '\n')
                  let slovo = cell.address.substring(0,1)
                  
 // !!!                 console.log('A6 data ', slovo, typeof slovo , worksheet.getCell(slovo+ '3').value)
                }
                  // za objekte koji su obojani da izvuce tekst  
                if(typeof cell.value === 'object' && cell.value !== 'undefined' && cell.value !== null){  // -----> ako je ćelija/text obojano podatak je objekt --> vadi vrijednost(text) iz objekta
                  var objTxt = cell.value
                  //console.log(objTxt)
                  allData.push(objTxt)
                  //objectArr.forEach(obj => console.log(obj.text) )
                  // console.log(' objekt', cellVal)
                }
                //rowObject[`col${colNumber}`] = JSON.stringify(cell.value);
            }

          });
            //  rowData.push(rowObject)           
            //  console.log("Row " + rowNumber + " = " + JSON.stringify(row.values))
        });
        return allData     
    }).catch(err=>console.log(err))
   // return data

  }catch(error){
    return error
  }
}



 
getExcel_data(filepath, sheetName)
        .then(res => {
            writeFile('podaci.json', res)
            console.log('\n response  \n ' ) //,res)
   }).catch(err => console.log('err => ', err))
       

