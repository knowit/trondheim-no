/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/style/global.css"

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )
  if (answer === true) {
    window.location.reload()
  }
}

export const registerServiceWorker = () => true

// export const onClientEntry = () => {
//   window.onappinstalled = () => {
//     window.navigator.serviceWorker.controller.postMessage("onappinstalled")
//   }
// }