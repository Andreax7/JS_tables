
import predavaci from './predavacObj.js'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

class TecajGrupa {

    constructor(date, time, title, prof, location ) {
      this.date = this.dateFormat(date)
      this.time = time
      this.title = title
      this.prof = this.recognizeProf(prof)
      this.location = location
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
      for (let [key, value] of Object.entries(predavaci)){
        if(key === prof){
          pred = value
          return pred
        }
      }
      return pred
    }
  
  
}

 export default TecajGrupa