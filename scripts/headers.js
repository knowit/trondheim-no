require("dotenv").config({ path: "../.env.production" })

const admin = require("firebase-admin")
const flamelink = require("flamelink/app")
require("flamelink/content")

const main = async () => {
  const credential = admin.credential.cert({
    projectId: process.env.GATSBY_FLAMELINK_PROJECT_ID,
    clientEmail: process.env.GATSBY_FLAMELINK_CLIENT_EMAIL,
    privateKey: process.env.GATSBY_FLAMELINK_PRIVATE_KEY.replace(/\\n/g, "\n"),
  })

  const firebaseApp = admin.initializeApp({
    credential,
    databaseURL: process.env.GATSBY_FLAMELINK_DATABASE_URL,
    storageBucket: process.env.GATSBY_FLAMELINK_STORAGE_BUCKET,
  })

  const locale = "no"
  const schemaKey = "studentArticle"

  app = flamelink({
    firebaseApp,
    locale,
    dbType: "cf",
    env: "production",
  })

  const content = await app.content.get({
    schemaKey,
    fields: ["content"],
  })

  for (const [entryId, value] of Object.entries(content)) {
    const oldContent = value.content
    const newContent = oldContent.replace(/<h3>|<\/h3>/g, (match) => {
      return match.replace('3', '2')
    })

    if (newContent != oldContent) {
      await app.content.update({
        schemaKey,
        entryId,
        data: {
          content: newContent
        }
      })
    }
    
  }
}

main().then(() => process.exit()).catch((err) => {
  console.error(err)
  process.exit(1)
})
