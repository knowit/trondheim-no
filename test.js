
const fetch = require('node-fetch');
const trdEventsUrl = "https://europe-west3-byportal-218506.cloudfunctions.net/trd-events-fetch"

const fetchTrdEvents = (req, res) => {
  console.log(`Retrieving trd-events...`)
  fetch(trdEventsUrl).then(res => res.json()).then(data => {
    console.log(data.body)
  })
}

fetchTrdEvents()

exports.fetchTrdEvents = fetchTrdEvents