import React from "react"
import "../style/layout.css"
import { Helmet } from "react-helmet"
import { Link, graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import BurgerMenu from "../components/menu.js"
import Footer from "../components/footer.js"

export default ({ children, locale, localizedPaths }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      localization: flamelinkLayoutLocalizationContent(
        flamelink_locale: { eq: "no" }
      ) {
        id
        ...LocalizationFragment
      }
      navbar: allFlamelinkNavbarContent {
        edges {
          node {
            id
            flamelink_locale
            navbarText
            logo {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 120, quality: 70) {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                    presentationWidth
                    presentationHeight
                    originalImg
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  // const [query, setQuery] = useState("")
  // const localization = data.localization.translations
  const navbar = data.navbar.edges
    .map((node) => node.node)
    .find((node) => node.flamelink_locale === locale)

  // const search = getLocalWord(localization, "search", locale)
  // const searchInput = getLocalWord(localization, "searchInput", locale)
  const Navigation = () => {
    return (
      <header className="navigation-container">
        <div className="navigation-content-container">
          <BurgerMenu locale={locale} localizedPaths={localizedPaths} />

          <div className="logo-container">
            <Link
              id="trondheimno-link"
              to={locale === "no" ? "/" : `/${locale.split("-")[0]}/`}
            >
              <div className="logo-text">{navbar.navbarText}</div>

              <div className="logo">
                <Img
                  fluid={navbar.logo[0].localFile.childImageSharp.fluid}
                  alt="Trondheim logo"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <div id="layout-container">
      <Helmet title="Trondheim.no">
        <html lang={locale} />
        <meta
          name="description"
          content="The official website for Trondheim."
        />
        <script
          async
          src="https://siteimproveanalytics.com/js/siteanalyze_6002236.js"
        ></script>
      </Helmet>
      <Navigation id="navbar" />
      <main id="children-container">{children}</main>
      <footer id="footer-container">
        <Footer locale={locale} localization={data.localization.translations} />
      </footer>
    </div>
  )
}
