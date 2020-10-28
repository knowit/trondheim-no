import React from "react"
import { LoadScript } from "@react-google-maps/api"

export default ({ children }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.GATSBY_GOOGLE_API}>
      {children}
    </LoadScript>
  )
}
