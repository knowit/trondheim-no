exports.onPostBuild = async (args, _ref3) => {

  const fs = require('fs')
  const workboxBuild = require('workbox-build');

  // NOTE: This should be run *AFTER* all your assets are built
  // This will return a Promise
  console.log("Building sw...")
  await (workboxBuild.injectManifest({
    swSrc: './static/sw-temp.js',
    swDest: './public/sw-temp.js',
    globDirectory: 'public',
    globPatterns: [
      '**/*',
    ]
  }).then(({ count, size, warnings }) => {
    console.log("Build sw complete.")
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  }));

  const { PWAManifest } = await require('./public/sw-temp.js')
  const sw = await fs.readFileSync('public/sw.js', 'utf8')

  var precacheFiles = []
  var discardedFiles = []
  PWAManifest.map(file => {
    if (!sw.includes(`"url": "${file.url}"`)) {
      precacheFiles.push(file)
    }
    else {
      discardedFiles.push(file)
    }
  })

  await fs.writeFileSync('public/sw.js', sw.replace('self.__WB_MANIFEST',
    `[${precacheFiles.map(file => `\n${JSON.stringify(file)}`)}]`))

  console.log(`Ignored files for additional PWA: \n${discardedFiles.map(file => `\n${JSON.stringify(file)}`)}`)

}