const mediaUrl =
  "https://firebasestorage.googleapis.com/v0/b/byportal-218506.appspot.com/o/flamelink%2Fmedia%2F"

const faultyUrl =
  "failed to process https://firebasestorage.googleapis.com/v0/b/byportal-218506.appspot.com/o/flamelink%2Fmedia%2FSpongdal_260x210mm_300dpi-31.jpg?alt=media"

function getImgTag(filename, alt, other = null) {
  const src = `${mediaUrl}${encodeURI(filename)}?alt=media`
  if (src === faultyUrl) {
    console.log(filename ? filename : "filename undefined")
    console.log(alt ? alt : "alt undefined")
    console.log(other ? other : "")
  }
  return `<img src=\"${mediaUrl}${encodeURI(
    filename
  )}?alt=media\" alt=\"${alt}\" />`
}

class HtmlParser {
  static concatText(introtext, fulltext, images) {
    var val = ""

    var frontImage = null
    var alt = ""

    if (images.image_fulltext) {
      var array = images.image_fulltext.split(`/`)
      frontImage = array[array.length - 1]
      alt = images.image_fulltext_alt
    }

    if (!frontImage) {
      var array = images.image_introtext
        ? images.image_introtext.split(`/`)
        : null
      frontImage = array ? array[array.length - 1] : null
      alt = images.image_introtext_alt ? images.image_introtext_alt : alt
    }

    if (frontImage) {
      const src = `${mediaUrl}${frontImage}?alt=media`
      if (src === faultyUrl) {
        console.log(introtext)
        console.log(fulltext)
        console.log(images)
      }
      val += `<p><img src=\"${mediaUrl}${frontImage}?alt=media\" alt=\"${alt}\"></img></p>`
    }

    val += this.fixImages(introtext)
    val += this.fixImages(fulltext)
    return val
  }

  static fixImages(inputString) {
    const regexp = /<img([\w\W]+?)\/>/g
    var imgTags = regexp.exec(inputString)

    var result = inputString

    while (imgTags) {
      const line = imgTags[0]

      const srcRegexp = /src\s*=\s*"(.+?)"/
      const altRegexp = /alt\s*=\s*"(.+?)"/

      var path = ""
      var alt = ""

      const src = srcRegexp.exec(line)

      if (src) {
        var array = src[1].split(`/`)
        path = array[array.length - 1]
      }

      const a = altRegexp.exec(line)

      if (a) {
        alt = a[1]
      }
      result = result.replace(line, getImgTag(path, alt, inputString))
      imgTags = regexp.exec(inputString)
    }
    return result
  }

  static getContactInfo(content, language) {
    const imgRegExp = /<img\s*(?:class\s*\=\s*[\'\"](.*?)[\'\"].*?\s*|src\s*\=\s*[\'\"](.*?)[\'\"].*?\s*|alt\s*\=\s*[\'\"](.*?)[\'\"].*?\s*|width\s*\=\s*[\'\"](.*?)[\'\"].*?\s*|height\s*\=\s*[\'\"](.*?)[\'\"].*?\s*)+.*?>/g
    const newlineRegExp = /\r?\n/

    const emailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
      .source
    const phoneRegex = /href=\"tel:([^\"]*)\"(.*)/g.source
    const pTagRegex = /<\s*p[^>]*>(.*?)<\s*\/\s*p>/g.source
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
      .source
    const titleRegex = /<a\s+[^>]*?title="([^"]*)"/g.source
    const aTagRegex = /<a [^>]+>(.*?)<\/a>/g.source

    var phone = ""
    var email = ""
    var address = ""
    var webUrl = ""
    var webTitle = ""

    const htmlArray = content.replace(imgRegExp, "").split(newlineRegExp)

    const startLabel = language === "no" ? "kontaktinfo" : "contact"
    const phoneLabel = language === "no" ? "telefon:" : "phone:"
    const emailLabel1 = "post:"
    const emailLabel2 = "mail:"
    const addressLabel = language === "no" ? "adresse:" : "address:"

    var start = false
    var error = false
    var i = 0

    var errors = []
    var removedLines = []

    function regex(regex, line) {
      return new RegExp(regex).exec(line)
    }

    function errorLine(line, label = "None") {
      error = true
      errors.push(`[${label}]: ${line}`)
      return ""
    }

    function getPTagContent(line, splitLabel) {
      removedLines.push(line)
      const tag = regex(pTagRegex, line)
      return tag
        ? tag[1].replace(splitLabel, "").trim()
        : errorLine(line, "P-tag content")
    }

    function getPhoneNumber(line) {
      if (line.includes(`<a`)) {
        const phoneTag = regex(phoneRegex, line.toLowerCase())
        return phoneTag ? phoneTag[1] : errorLine(line, "Phone")
      } else {
        const splitLabel = language === "no" ? "Telefon:" : "Phone:"
        return getPTagContent(line, splitLabel)
      }
    }

    function getEmailAddress(line) {
      const tag = regex(emailRegex, line.toLowerCase())
      return tag ? tag[0] : errorLine(line, "E-mail")
    }

    function isWebsite(line) {
      const tag = regex(urlRegex, line)
      if (tag != null) {
        return true
      }
      return false
    }

    function getWebsiteTitle(line) {
      if (line.includes(`title=`)) {
        const tag = regex(titleRegex, line)
        return tag ? tag[1] : errorLine(line, "Website title")
      } else {
        const tag = regex(aTagRegex, line)
        return tag ? tag[1] : errorLine(line, "Website title")
      }
    }

    function getWebsiteUrl(line) {
      const tag = regex(urlRegex, line.replace(`/#!/`, "/"))
      var other = ""

      if (!tag) {
        const content = getPTagContent(line.replace(`/#!/`, "/"), "")
        if (isWebsite(content)) {
          other = errorLine(line, "Website URL")
        }
      }
      return tag ? tag[0] : other
    }

    while (i < htmlArray.length) {
      const line = htmlArray[i++]
      if (line.toLowerCase().includes(startLabel)) {
        removedLines.push(line)
        start = true
      } else if (start) {
        if (line.toLowerCase().includes(phoneLabel)) {
          removedLines.push(line)
          phone = getPhoneNumber(line)
        }

        if (
          line.toLowerCase().includes(emailLabel1) ||
          line.toLowerCase().includes(emailLabel2)
        ) {
          removedLines.push(line)
          email = getEmailAddress(line)
        }

        if (line.toLowerCase().includes(addressLabel)) {
          removedLines.push(line)
          const splitLabel = language === "no" ? "Adresse:" : "Address:"
          address = getPTagContent(line, splitLabel)
        }

        if (isWebsite(line)) {
          removedLines.push(line)
          webTitle = getWebsiteTitle(line)
          webUrl = getWebsiteUrl(line)
        }
      }
    }

    if (error) {
      errors.map((line) => {
        console.log("\x1b[33m%s\x1b[0m", `\nWarning: Failed to parse ${line}`)
      })
    }

    return {
      result: {
        telephoneNumber: phone,
        emailAddress: email,
        linkToWebsite: webUrl,
        textToShow: webTitle,
      },
      address: address,
      removedLines: removedLines,
    }
  }

  static getOpeningHours(content, language) {
    const htmlArray = content.split(/\r?\n/)
    const startLabel = language === "no" ? "åpningstider" : "opening hours"
    const stopLabel = language === "no" ? "kontaktinfo" : "contact"
    var read = false

    var removedLines = []

    var result = ""

    var i = 0
    while (i < htmlArray.length) {
      const line = htmlArray[i++]

      if (line.toLowerCase().includes(startLabel)) {
        removedLines.push(line)
        read = true
      } else if (line.toLowerCase().includes(stopLabel)) {
        read = false
        removedLines.push(line)
        break
      } else if (read) {
        result += line
        removedLines.push(line)
      }
    }

    return {
      result: result,
      removedLines: removedLines,
    }
  }

  static removeLines(content, linesToRemove) {
    const htmlArray = content.split(/\r?\n/)
    var remaining = content
    var i = 0
    while (i < linesToRemove.length) {
      const line = linesToRemove[i++]
      remaining = remaining.replace(line, "")
    }
    return remaining.length > 0 ? remaining : ""
  }
}

module.exports = { HtmlParser }
