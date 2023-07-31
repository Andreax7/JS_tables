let predavaci = require('./predavacObj.js')
 
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
 
 class TecajPredavac {
    
  constructor(date, groups, time, title, prof, location, info  ) {
      this.date = this.dateFormat(date)
      this.time = time
      this.title = title
      this.prof = this.recognizeProf(prof)
      this.location = location
      this.groups = groups
      this.info = info
    }


    dateFormat(date){
      let day = date.substring(0,3)
      let datum = date.substring(3, )
      if(day === 'PON') datum = weekDays[0] + datum
      if(day === 'UTO') datum = weekDays[1] + datum
      if(day === 'SRI') datum = weekDays[2] + datum
      if(day === 'ČET') datum = weekDays[3] + datum
      if(day === 'PET') datum = weekDays[4] + datum
      if(day === 'SUB') datum = weekDays[5] + datum
      if(day === 'NED') datum = weekDays[6] + datum
      return datum
    }

    recognizeProf(prof){// loop trough predavac - compare key with value of obj
      let pred = ''
      if(prof === undefined){
        return console.log('Error --> EMPTY TEACHER FIELD')
      }
      for(const [key, value] of Object.entries(predavaci)) {
      //  console.log( key === prof, key, prof,  typeof key, typeof prof, value) za provjeru
        if(key === prof){       
          let pred = value
          return pred
        }
        if(prof.length > 2){
          var profesori = prof.split('+')
          
          for(let p=0 ; p<= profesori.length-1; p++){
            pred = (pred + profesori[p].toString()) 
            pred = pred + ' '
          }
          return pred.toString()
        }
      }

      return pred.toString()
    }
    
    
  }

module.exports = TecajPredavac