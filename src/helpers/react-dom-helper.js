var React = require("react")
var HtmlToReact = require("html-to-react")
var HtmlToReactParser = require("html-to-react").Parser
var ReactDOMServer = require("react-dom/server")

class HtmlNode {
  constructor(type, props = {}) {
    this.children = []
    this.type = type
    this.props = props
    this.level = 0
  }

  addChild(htmlNode) {
    this.children.push(htmlNode)
  }

  getChildCount() {
    return this.children.length
  }
  getChildren() {
    return this.children
  }

  setLevel(level) {
    this.level = level
  }

  getLevel() {
    return this.level
  }
  getType() {
    return this.type
  }
  isType(type) {
    return this.type === type
  }

  toString() {
    var string = `Level ${this.level}:`

    if (this.props.text) {
      string = `${string} ${this.props.text}`
    } else {
      string = `${string} \ttype: ${this.type}\tprops${JSON.stringify(
        this.props
      )}`
    }
    return string
  }
}

class ReactDOMHelper {
  static getTextContentFromHtml(htmlInput) {
    function getText(htmlNode) {
      var text = ""
      if (htmlNode.isType("text")) {
        text += htmlNode.props.text ? htmlNode.props.text : ""
      }

      htmlNode.getChildren().map((childNode) => {
        text += getText(childNode)
        return childNode
      })

      return text
    }

    const root = new HtmlNode("div")
    const element = this.parseToReact(htmlInput)

    React.Children.map(element, (child) => {
      const childNode = this.buildHtmlTree(child)
      if (childNode) {
        root.addChild(childNode)
      }
    })

    return getText(root)
  }

  static buildHtmlTree(element, level = 1) {
    if (element.props) {
      const childNode = new HtmlNode(element.type, element.props)
      childNode.setLevel(level)

      if (element.props.children) {
        React.Children.map(element.props.children, (child) => {
          const grandChild = this.buildHtmlTree(child, level + 1)
          if (grandChild) {
            childNode.addChild(grandChild)
          }
        })
      }

      return childNode
    } else if (typeof element === "string") {
      const childNode = new HtmlNode("text", { text: element })
      childNode.setLevel(level)
      return childNode
    } else {
      return null
    }
  }

  static createReactComponent(
    htmlNode,
    transformImg,
    index = 0,
    transformIframe
  ) {
    const voidElements = [
      "area",
      "base",
      "basefont",
      "bgsound",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "image",
      "input",
      "isindex",
      "keygen",
      "link",
      "menuitem",
      "meta",
      "nextid",
      "param",
      "source",
      "track",
      "wbr",
    ]

    if (htmlNode.isType("img")) {
      return transformImg(htmlNode.props, index)
    } else if (voidElements.includes(htmlNode.getType())) {
      return React.createElement(
        htmlNode.getType(),
        {
          ...htmlNode.props,
          key: index,
        },
        null
      )
    } else if (htmlNode.isType("text")) {
      return htmlNode.props.text
    } else if (htmlNode.isType("iframe")) {
      return transformIframe(htmlNode, index)
    } else {
      var children = []

      var childIndex = 0

      htmlNode.getChildren().map((child) => {
        children.push(
          this.createReactComponent(
            child,
            transformImg,
            childIndex,
            transformIframe
          )
        )
        childIndex += 1
        return child
      })

      var attribs = { key: index }
      if (htmlNode.props.href) {
        attribs.href = htmlNode.props.href
      }
      if (htmlNode.type === "p") {
        attribs.className = "pdiv"
      }
      if (htmlNode.props.width) {
        attribs.width = htmlNode.props.width
      }
      if (htmlNode.props.height) {
        attribs.width = htmlNode.props.height
      }
      if (htmlNode.props.id) {
        attribs.id = htmlNode.props.id
      }

      return React.createElement(
        htmlNode.type === "p" ? "div" : htmlNode.type,
        attribs,
        children
      )
    }
  }

  static buildReactComponent(htmlInput, transformImg, transformIframe) {
    const root = new HtmlNode("div")
    root.props = { id: "html-content-container" }
    const element = this.parseToReact(htmlInput)

    React.Children.map(element, (child) => {
      const childNode = this.buildHtmlTree(child)
      if (childNode) {
        root.addChild(childNode)
      }
    })

    const reactElement = this.createReactComponent(
      root,
      transformImg,
      0,
      transformIframe
    )

    return reactElement
  }

  static isType(node, type) {
    if (node.type === "tag") {
      return node.tagName === type
    } else {
      return false
    }
  }

  static hasChildOfType(node, type) {
    if (node.childNodes != null) {
      var hasChildType = false
      var i = 0
      while (i < node.childNodes.length && !hasChildType) {
        const child = node.childNodes[i]
        if (this.isType(child, type)) {
          hasChildType = true
        } else {
          hasChildType = this.hasChildOfType(child, type)
        }
        i += 1
      }
      return hasChildType
    } else {
      return false
    }
  }

  static hasParentOfType(node, type) {
    if (node.parent == null) {
      return false
    } else {
      if (this.isType(node.parent, type)) {
        return true
      } else {
        return this.hasParentOfType(node.parent, type)
      }
    }
  }

  static parseToReact(htmlInput) {
    var htmlToReactParser = new HtmlToReactParser()
    return htmlToReactParser.parse(htmlInput)
  }

  static renderToHtml(reactComponent) {
    return ReactDOMServer.renderToStaticMarkup(reactComponent)
  }

  static processNodes(htmlInput, shouldProcess, process) {
    var isValidNode = function () {
      return true
    }

    var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React)

    var processingInstructions = [
      {
        replaceChildren: true,
        // Custom <h1> processing
        shouldProcessNode: function (node) {
          return shouldProcess(node)
        },
        processNode: function (node, children, index) {
          return process(node, children)
        },
      },
      {
        // Anything else
        shouldProcessNode: function (node) {
          return true
        },
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ]

    var htmlToReactParser = new HtmlToReactParser()

    var reactComponent = htmlToReactParser.parseWithInstructions(
      htmlInput,
      isValidNode,
      processingInstructions
    )

    return reactComponent
  }

  static buildReactElement(node) {}
}

export default ReactDOMHelper
