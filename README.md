# JS_tables

Program for timetables for teachers and participants - FROM COMMON XLSX TIMETABLE CONVERTED IN JSON FORMAT
Written in Node js with packages.

This program uses objects with custom made properties from json file, and generates docx document with data from json file.
package.json contains used dependencies that can be install after initializing node folder.
1. Initializing and instaling dependencies commands:
  npm init
  npm install

2. Add folders: raspored_nast, raspored_grupe   --> in this folder you can see generated docx files after running the program
3. predavaciObj.js object was removed due to protection of personal data. Object contains a key-value string pairs where
    key is first letter of name and firstname, and
    value is fullname and lastname, eg.: export default const predavacObj = {'NL':'Name Lastname', 'JD':'John Doe'}

4. run the program with npm run dev
