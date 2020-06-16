
var admin = require('firebase-admin')

var flamelink = require('flamelink/app');
require('flamelink/content');
require('flamelink/storage');
require('flamelink/settings');

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert("C:/Users/levis/OneDrive/Skrivebord/trondheimno-demo-firebase-adminsdk-ew8t0-6e0ef688fb.json"),
    databaseURL: 'https://trondheimno-demo.firebaseio.com',
    storageBucket: 'trondheimno-demo.appspot.com'
})

var firestore = firebaseApp.firestore();

const app = flamelink({
    firebaseApp,
    locale: 'no',
    dbType: 'cf'
})

const enApp = flamelink({
    firebaseApp,
    locale: 'en-US',
    dbType: 'cf'
})

const slugify = require('slugify');
const fetch = require('node-fetch');

var rawno = require("./inputs/raw-no.json");
var rawen = require("./inputs/raw-en.json");

var norData = rawno[2].data;
var engData = rawen[2].data;

const JSONkeys = ["images", "urls", "attribs", "metadata"]

var catids = require("./inputs/categories.json");

//state : -2 => testing, 0 => disabled

// Parse JSON object within the JSON of the raw data

for (let i = 0; i < norData.length; i++) {
    const element = norData[i];
    for (let j = 0; j < JSONkeys.length; j++) {
        const key = JSONkeys[j];
        element[key] = JSON.parse(element[key]);
    }
    element.catid = element.catid.split(",")[0];
}

for (let i = 0; i < engData.length; i++) {
    const element = engData[i];
    for (let j = 0; j < JSONkeys.length; j++) {
        const key = JSONkeys[j];
        element[key] = JSON.parse(element[key]);
    }
    element.catid = element.catid.split(",")[0];
}

function isSameCategory(norCat, engCat) {
    var possibleCategories = catids.filter(val => val.no == norCat);
    var compatible = false;
    possibleCategories.forEach(cat => {
        if (cat.en == engCat) {
            compatible = true;
        }
    });
    return compatible;
}

function shouldBeKept(article, language) {
    if (article.state < 1) return false;

    if (language == "no") {
        if (["-1", "2", "12", "28", "90", "81"].includes(article.catid)) return false;
    }
    if (language == "en") {
        if (["-1", "2", "28", "10", "33"].includes(article.catid)) return false;
    }

    return true;
}

var discardedData = [];

function cleanData(array, language) {

    var reducedArray = array.reduce(function (result, element) {
        if (shouldBeKept(element, language)) {
            result.push(element);
        } else {
            discardedData.push(element);
        }
        return result;
    }, []);

    if (language == "no") norData = reducedArray;
    if (language == "en") engData = reducedArray;
}

cleanData(norData, "no");
cleanData(engData, "en");

var commonData = [];
var errorData = [];
var noMatchData = [];


var counter = 0;
var errorCounter = 0;
var noEnglishCounter = 0;
norData.map((norVal) => {

    var nor_imgs = norVal.images;

    var innerCounter = 0;
    var matchFound = false;
    for (let index = 0; index < engData.length; index++) {
        const engVal = engData[index];
        var eng_imgs = engVal.images;
        if (
            isSameCategory(norVal.catid, engVal.catid) &&
            (norVal.title == engVal.title ||
                norVal.alias == engVal.alias ||
                (nor_imgs.image_intro && eng_imgs.image_intro && nor_imgs.image_intro.split("/").pop() == eng_imgs.image_intro.split("/").pop()) ||
                (nor_imgs.float_intro && eng_imgs.float_intro && nor_imgs.float_intro.split("/").pop() == eng_imgs.float_intro.split("/").pop()) ||
                (nor_imgs.image_fulltext && eng_imgs.image_fulltext && nor_imgs.image_fulltext.split("/").pop() == eng_imgs.image_fulltext.split("/").pop()) ||
                (nor_imgs.float_fulltext && eng_imgs.float_fulltext && nor_imgs.float_fulltext.split("/").pop() == eng_imgs.float_fulltext.split("/").pop()))
        ) {
            matchFound = true;
            commonData.push({ no: norVal, en: engVal });
            counter++;
            innerCounter++;
            if (innerCounter > 1) {
                errorCounter++;
                if (innerCounter == 2) errorData.push(commonData.pop());
                var prev = errorData.push(commonData.pop());
                prev = errorData[prev - 1];
            }
        }
    }
    if (!matchFound) {
        noEnglishCounter++;
        noMatchData.push(norVal);
    }
})

var norwegianNoMatch = JSON.parse(JSON.stringify(noMatchData));
var englishNoMatch = [];

engData.map((x) => {
    var matchFound = false;
    for (let index = 0; !matchFound && index < commonData.length; index++) {
        const element = commonData[index].en.id;
        if (x.id == element) {
            matchFound = true;
        }
    }
    if (!matchFound) {
        noMatchData.push(x);
        englishNoMatch.push(x);
    }
})

noMatchData = { no: norwegianNoMatch, en: englishNoMatch };

console.log("Found matches: " + commonData.length);
console.log("Found Errors: " + errorData.length);
console.log("No English version found: " + noEnglishCounter);
console.log("No Norwegian version found: " + (engData.length - (counter - errorCounter)));
console.log("No Match Found: " + (noMatchData.no.length + noMatchData.en.length));
console.log("Discarded Data: " + discardedData.length);

console.log("Total Norwegian Data: " + norData.length);
console.log("Total English Data: " + engData.length);

var fs = require('fs');
// fs.writeFile("./outputs/commonData.json",JSON.stringify(commonData),function(err){
//     if(err) {
//         console.log(err);
//     }
// });
// fs.writeFile("./outputs/errorData.json",JSON.stringify(errorData),function(err){
//     if(err) {
//         console.log(err);
//     }
// })
// fs.writeFile("./outputs/noMatchData.json",JSON.stringify(noMatchData),function(err){
//     if(err) {
//         console.log(err);
//     }
// })
// fs.writeFile("./outputs/discardedData.json",JSON.stringify(discardedData),function(err){
//     if(err) {
//         console.log(err);
//     }
// })


function fixImages(inputString) {
    return inputString.replace(/src=\"/g, "src=\"https://www.trondheim.no/")
}

function concatText(introtext, fulltext, images) {
    var val = "";
    if (images.image_intro) {
        val += "<p><img src=\"https://www.trondheim.no/" + images.image_intro + "\""
            + " alt=\"" + images.image_intro_alt + "\" /></p>"
    }
    val += fixImages(introtext);
    if (images.image_fulltext) {
        val += "<p><img src=\"https://www.trondheim.no/" + images.image_fulltext + "\""
            + " alt=\"" + images.image_fulltext_alt + "\" /></p>"
    }
    val += fixImages(fulltext);
    return val;
}

function getLatLong(xreference) {
    if (xreference && xreference != "") {
        return { latitude: xreference.split(",")[0], longitude: xreference.split(",")[1] }
    } else {
        return null;
    }
}

async function prepareCategoryReferences() {

    try {
        const noCategories = await app.content.get({ schemaKey: "listingPage" });
        const enCategories = await enApp.content.get({ schemaKey: "listingPage" });
        var noValues = Object.values(noCategories);
        var enValues = Object.values(enCategories);

        catids.forEach(element => {
            if (!(element.noSlug == "" || element.enSlug == "")) {
                var noCatID = noValues.filter(val => val.slug == element.noSlug);
                var enCatID = enValues.filter(val => val.slug == element.enSlug);

                element.noRef = firestore.collection('fl_content').doc(noCatID[0].id);
                element.enRef = firestore.collection('fl_content').doc(enCatID[0].id);
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function getCategoryRef(language, catNum) {
    if (language == "no") {
        var cats = catids.filter(val => val.no == catNum);
        if (!cats[0].noRef) return null;
        return cats[0].noRef;
    } else if (language == "en") {
        var cats = catids.filter(val => val.en == catNum);
        if (!cats[0].enRef) return null;
        return cats[0].enRef;
    } else {
        throw new error;
    }
}

async function getImageReference(imageString) {
    var files = await firestore.collection('fl_files').where('file', '==', imageString).get();
    var reference = [];
    if (!files.empty) {
        files.forEach(file => {
            if (reference.length === 0) {
                reference.push(firestore.collection('fl_files').doc(file.id));
            }
        })
    }
    return reference;
}

function stripPath(string) {
    var splitString = String(string).split("/");
    return splitString.pop();
}

async function getThumbnailReference(article) {

    if (article.images.image_intro) {
        return await getImageReference(stripPath(article.images.image_intro));
    } else if (article.images.image_fulltext) {
        return await getImageReference(stripPath(article.images.image_fulltext));
    } else {
        // Find first image in the text, and use that as thumbnail.
        let str;
        let strs = String(article.introtext).split("src=\"");
        if (strs.length > 1) {
            strs = strs[1].split("\"");
            (strs.length > 1) ? str = strs[0] : str = null;
        }
        if (str) {
            return await getImageReference(str);
        } else {
            return null;
        }
    }
}



function getContactInfo(content, language) {

    var phone = ''
    var email = ''
    var address = ''
    var webUrl = ''
    var webTitle = ''

    const htmlArray = content.split(/\r?\n/)

    const startLabel = (language === 'no') ? 'Kontaktinfo' : 'Contact'
    const phoneLabel = (language === 'no') ? 'Telefon:' : 'Phone:'
    const emailLabel = (language === 'no') ? 'post:' : 'mail:'
    const addressLabel = (language === 'no') ? 'Adresse:' : 'Address:'

    var start = false
    var error = false
    var i = 0

    var errors = []

    function errorLine(line) {
        error = true
        errors.push(line)
        return ''
    }

    function getPTagContent(line, splitLabel) {
        const tag = /<\s*p[^>]*>(.*?)<\s*\/\s*p>/g.exec(line)
        return tag ? tag[1].replace(splitLabel, '').trim() : errorLine(line)
    }

    function getPhoneNumber(line) {
        if (line.includes(`<a`)) {
            const phoneTag = /href=\"tel:([^\"]*)\"(.*)/g.exec(line)
            return phoneTag ? phoneTag[1] : errorLine(line)
        }
        else {
            const splitLabel = (language === 'no') ? 'Telefon:' : 'Phone:'
            return getPTagContent(line, splitLabel)
        }
    }

    function getEmailAddress(line) {
        const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        const tag = regex.exec(line)
        return tag ? tag : errorLine(line)
    }

    function isWebsite(line) {
        const result = (line.includes(`<a`) &&
            line.includes(`href`) &&
            !line.includes(`mailto:`) &&
            !line.includes(`tel:`))
        return result
    }

    function getWebsiteTitle(line) {
        if (line.includes(`title=`)) {
            const regex = /<a\s+[^>]*?title="([^"]*)"/
            const tag = regex.exec(line)
            return tag ? tag[1] : errorLine(line)
        }
        else {
            const regex = /<a [^>]+>(.*?)<\/a>/
            const tag = regex.exec(line)
            return tag ? tag[1] : errorLine(line)
        }
    }

    function getWebsiteUrl(line) {
        const regex = /<a\s+[^>]*?href="([^"]*)"/
        const tag = regex.exec(line)
        return tag ? tag[1] : errorLine(line)
    }


    while (i < htmlArray.length) {

        const line = htmlArray[i++]

        if (line.includes(startLabel)) {
            start = true
        }

        else if (start) {

            if (line.includes(phoneLabel)) {
                phone = getPhoneNumber(line)
            }

            if (line.includes(emailLabel)) {
                email = getEmailAddress(line)
            }

            if (line.includes(addressLabel)) {
                const splitLabel = (language === 'no') ? 'Adresse:' : 'Address:'
                address = getPTagContent(line, splitLabel)
            }

            if (isWebsite(line)) {
                webTitle = getWebsiteTitle(line)
                webUrl = getWebsiteUrl(line)
            }


        }
    }

    const result = {
        telephoneNumber: phone,
        emailAddress: email,
        linkToWebsite: webUrl,
        textToShow: webTitle,
        address: address,
    }

    if (error) {
        console.log(`\nError parsing lines: `)
        errors.map(line => {
            console.log(line)
        })
        console.log(`\n`)
    }

    return result
}

function getOpeningHours(content, language) {
    return ''
}


async function createArticles() {

    try {

        await prepareCategoryReferences();

        let articles = [];

        const startIndex = 502
        const quantity = 3

        //Create all articles with both Norwegian and English translations
        for (let i = startIndex; i < startIndex + quantity/*commonData.length*/; i++) {
            const element = commonData[i];

            await app.settings.setLocale('no');
            let noThumbnail = await getThumbnailReference(element.no);
            const content = await concatText(element.no.introtext, element.no.fulltext, element.no.images)
            const contact = await getContactInfo(content, 'no')
            const contactInfo = {
                telephoneNumber: contact.telephoneNumber,
                emailAddress: contact.emailAddress,
                linkToWebsite: contact.linkToWebsite,
                textToShow: contact.textToShow
            }
            const address = {
                address: contact.address,
                lat: 0,
                lng: 0
            }

            const norwegianArticle = await app.content.add(
                {
                    schemaKey: 'articleNew',
                    data: {
                        title: element.no.title,
                        slug: slugify(element.no.title).toLowerCase(),
                        thumbnail: noThumbnail,
                        parentContent: getCategoryRef("no", element.no.catid),
                        content: content,
                        openingHours: getOpeningHours(content, 'no'),
                        contactInfo: contactInfo,
                        address: address, //{ address: '', lat: 0, lng: 0 },
                        latLong: getLatLong(element.no.metadata.xreference),
                        tags: ['test-tag']
                    }
                })

            articles.push(norwegianArticle);

            await app.settings.setLocale('en-US');
            let enThumbnail = await getThumbnailReference(element.en);

            const contentEn = await concatText(element.en.introtext, element.en.fulltext, element.en.images)
            const contactEn = await getContactInfo(contentEn, 'en')
            const contactInfoEn = {
                telephoneNumber: contactEn.telephoneNumber,
                emailAddress: contactEn.emailAddress,
                linkToWebsite: contactEn.linkToWebsite,
                textToShow: contactEn.textToShow
            }
            const addressEn = {
                address: contactEn.address,
                lat: 0,
                lng: 0
            }

            const englishArticle = await app.content.add(
                {
                    schemaKey: 'articleNew',
                    entryId: norwegianArticle.id,
                    data: {
                        title: element.en.title,
                        slug: slugify(element.en.title).toLowerCase(),
                        thumbnail: enThumbnail,
                        parentContent: getCategoryRef("en", element.en.catid),
                        content: contentEn,
                        openingHours: getOpeningHours(contentEn, 'en'),
                        contactInfo: contactInfoEn,
                        address: addressEn,
                        latLong: getLatLong(element.en.metadata.xreference)
                    }
                })

            articles.push(englishArticle);

        }

        await app.settings.setLocale('no');
        for (let i = 0; i < 0/*noMatchData.no.length*/; i++) {
            const element = noMatchData.no[i];

            let thumbnail = await getThumbnailReference(element);

            const norwegianArticle = await app.content.add(
                {
                    schemaKey: 'articleNew',
                    data: {
                        title: element.title,
                        slug: slugify(element.title).toLowerCase(),
                        thumbnail: thumbnail,
                        parentContent: getCategoryRef("no", element.catid),
                        content: concatText(element.introtext, element.fulltext, element.images),
                        openingHours: '',
                        contactInfo: null,
                        address: { address: '', lat: 0, lng: 0 },
                        latLong: getLatLong(element.metadata.xreference)
                    }
                })

            articles.push(norwegianArticle);
        }

        await app.settings.setLocale('en-US');
        for (let i = 0; i < 0/*noMatchData.en.length*/; i++) {
            const element = noMatchData.en[i];

            let thumbnail = await getThumbnailReference(element);

            const englishArticle = await app.content.add(
                {
                    schemaKey: 'articleNew',
                    data: {
                        title: element.title,
                        slug: slugify(element.title).toLowerCase(),
                        thumbnail: thumbnail,
                        parentContent: getCategoryRef("en", element.catid),
                        content: concatText(element.introtext, element.fulltext, element.images),
                        openingHours: '',
                        contactInfo: null,
                        address: { address: '', lat: 0, lng: 0 },
                        latLong: getLatLong(element.metadata.xreference)
                    }
                })

            articles.push(englishArticle);
        }
        //console.log(articles);
    } catch (error) {
        console.error(error);
    }
}

createArticles();

async function readImage() {
    try {
        let image;
        // fetch("https://www.trondheim.no/images/severdig/baklandet900.png")
        // .then(res => res.blob())
        // .then((data) => {
        //     console.log(data)
        //     image = data;
        // });
        const test = await app.storage.getURL({
            fileId: '207SSfsVjEc0u0Br4A30',
            size: {
                width: 1080,
                height: 9999,
                quality: 1
            }
        })
        console.log(test)

        var reference = await firestore.collection('fl_files').doc("bybro900");
        console.log(reference);

        const fileObject = await app.storage.getFiles({ folderName: 'Root' })
        console.log(fileObject);
    } catch (error) {
        console.error(error);
    }
}

// readImage();

