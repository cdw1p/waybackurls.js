const { argv } = require('yargs')
const fetch = require('node-fetch')
const fs = require('fs')

const getAllData = async (domain) => {
  let url = `http://web.archive.org/cdx/search/cdx?url=${domain}/*&output=json&collapse=urlkey`
  return await fetch(url)
    .then(res => res.json())
    .then(response => response)
    .catch(error => error.message)
}

const checkDomain = (domain) => {
  if (/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g.test(domain)) {
    return true
  } else {
    return false
  }
}

const writeResult = (data, output) => {
  data.slice(1).map(items => {
    fs.appendFileSync(`./${output}`, `${items}\n`)
  })
}

(async () => {
  try {
    if (argv.d || argv.o) {
      if (await checkDomain(argv.d)) {
        const responseData = await getAllData(argv.d)
        if (responseData.length > 0) {
          const loopData = responseData.map(data => data[2])
          await writeResult(loopData, argv.o)
          console.log(`Process complete! file saved on ${argv.o}`)
        } else {
          console.log('No data available.')
        }
      } else {
        console.log('Please enter valid domain.')
      }
    } else {
      console.log('Invalid format usage.\nUsage: node index --d <domain> -o <filename>')
    }
  } catch (error) {
    console.log(error)
  }
})()