// import dotenv from "dotenv";
import fs from 'fs'
import fetch from 'node-fetch'

// dotenv.config({ path: ".env.local" });

// https://docs.google.com/spreadsheets/d/1G517vrRqq8_QoNUvmW6DD2xwdCPZTYykKWKxj6B7VHQ/edit#gid=0
const SHEET_ID = '1G517vrRqq8_QoNUvmW6DD2xwdCPZTYykKWKxj6B7VHQ'
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/es?key=AIzaSyCEvnRRutDAWD2SfQpva1Gtm8FwYoq428g`
const FOLDER_PATH = 'src/assets/locales'

let body

console.log('\nFetching localizations from Google Sheets')
try {
  const response = await fetch(SHEET_URL)
  body = await response.json()
} catch (error) {
  console.error(error)
}

if (!body || !body.values || !body.values.length) {
  console.warn('No localizations found')
  process.exit()
}

// first row is the column headers
// each row is then the key and it's translations
const [header, ...localizations] = body.values // split the header row off
const [, ...languageKeys] = header // split the key column off

console.log(`Found potential localizations for: `, languageKeys.join(', '))

// prepare the locales object
const locales = languageKeys.map((lang) => {
  return { [lang]: {} }
})

localizations.forEach((translations) => {
  const [key, ...rest] = translations // split the localisation key from the translations

  // if the number of translations in this row is less than the number of languages in the header the array will be short
  // this fills the remaining array elements so we can print "" in th output file for the language without this translation
  if (rest.length < languageKeys.length) {
    const fillerArray = new Array(languageKeys.length - rest.length).fill('')
    rest.push(...fillerArray)
  }

  rest.forEach((text, index) => {
    /* 
      this is horrible, I'm so sorry, it:
      - gets the current locale with index
      - grabs the key for the language from the header row to access the language code property (log the locales object to see the empty structure)
      - sets the localization key as the object key
      - sets the text as the key value
      if this language doesn't have a localization but later language does then it will be empty, hence the length check
    */
    locales[index][languageKeys[index]][key] = text
  })
})

if (fs.existsSync(FOLDER_PATH)) {
  console.log('Locales folder exists already, deleting')
  fs.rmSync(FOLDER_PATH, { recursive: true, force: true })
}

console.log('\nCreating locales folder')
fs.mkdirSync(FOLDER_PATH)

locales.forEach((lang) => {
  const langKey = Object.keys(lang)[0]
  console.log(`Creating ${langKey} localization`)
  fs.mkdirSync(`${FOLDER_PATH}/${langKey}`)
  fs.writeFileSync(`${FOLDER_PATH}/${langKey}/common.json`, JSON.stringify(lang[langKey], null, 2))
})

console.log('\nFinished making localizations')
