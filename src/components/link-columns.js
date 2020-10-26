import React from "react"
import ReactDOMHelper from "../helpers/react-dom-helper"
import { Link } from "gatsby"
import Img from "gatsby-image"

const LinkColumns = ({ linkColumns, columnsBackgroundImage, type }) => {
  const Column = ({ node }) => {
    const Content = () => ReactDOMHelper.parseToReact(node.content)

    const Ref = ({ children, tabable }) => {
      if (node.linkType === "url") {
        return (
          <a
            tabIndex={tabable ? "0" : "-1"}
            className={`${type}-column-link`}
            href={node.link.path}
          >
            {children}
          </a>
        )
      } else if (node.linkType !== "none") {
        return (
          <Link
            tabIndex={tabable ? "0" : "-1"}
            className={`${type}-column-link`}
            to={node.link.path}
          >
            {children}
          </Link>
        )
      } else return children
    }

    console.log(node.icon)

    return (
      <div className={`${type}-column-item-container`}>
        <div className={`${type}-column-image-container`}>
          <Ref>
            {node.icon.length ? (
              <Img
                className={`${type}-column-image`}
                fixed={node.icon[0].childImageSharp.fixed}
                alt="thumbnail"
              />
            ) : null}
          </Ref>
        </div>
        <div className={`${type}-column-info-container`}>
          <h3>
            <Ref tabable="true">{node.title}</Ref>
          </h3>
          <h4>
            <Ref>
              <Content />
            </Ref>
          </h4>
        </div>
      </div>
    )
  }

  const backgroundStyle = {
    backgroundImage: `url(${columnsBackgroundImage[0].localFile.childImageSharp.fluid.src})`,
  }

  var index = 0

  return (
    <div id={`${type}-columns-container`} style={backgroundStyle}>
      <div id={`${type}-columns-overlay`}>
        {linkColumns.map((node) => {
          return <Column key={index++} node={node} />
        })}
      </div>
    </div>
  )
}

export default LinkColumns

export const _fragment = graphql`
  fragment LinkColumnFragment on LinkColumn {
    title
    subtitle
    linkType
    link {
      title
      subtitle
      path
    }
    content
    icon {
      name
      childImageSharp {
        fixed(height: 56, quality: 70) {
          ...GatsbyImageSharpFixed_noBase64
        }
      }
    }
  }
`
