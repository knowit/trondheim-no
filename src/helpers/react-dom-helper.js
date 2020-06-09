
var React = require('react');
var HtmlToReact = require('html-to-react');
var HtmlToReactParser = require('html-to-react').Parser;
var ReactDOMServer = require('react-dom/server');

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
  isType(type) {
    return this.type === type
  }

  toString() {
    var string = `Level ${this.level}:`

    if (this.props.text) {
      string = `${string} ${this.props.text}`
    }
    else {
      string = `${string} \ttype: ${this.type}\tprops${JSON.stringify(this.props)}`
    }
    return string
  }

  print() {
    console.log(this.toString())
    this.children.map(child => {
      child.print()
    })
  }

}

class ReactDOMHelper {


  static printChildren(element) {
    if (element.props) {
      if (element.props.children) {
        React.Children.map(element.props.children, (child) => {
          this.printChildren(child)
        })
      }
      else {

      }
    }
    else if (typeof element === 'string') {
      console.log(element)
    }
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

    }
    else if (typeof element === 'string') {
      const childNode = new HtmlNode('text', { text: element })
      childNode.setLevel(level)
      return childNode
    }
    else {
      return null
    }
  }

  static createReactComponent(htmlNode, transformImg, index = 0) {

    if (htmlNode.isType('img')) {
      return transformImg(htmlNode.props, index)
    }

    else if (htmlNode.isType('text')) {
      return React.createElement('div', { key: index }, htmlNode.props.text)
    }

    else {
      var children = []

      var childIndex = 0

      htmlNode.getChildren().map(child => {
        children.push(
          this.createReactComponent(child, transformImg, childIndex)
        )
        childIndex += 1
      })

      return React.createElement(
        (htmlNode.type === 'p') ? 'div' : htmlNode.type, { key: index, }, children)
    }
  }


  static buildReactComponent(htmlInput, transformImg) {

    const root = new HtmlNode('div')
    const element = this.parseToReact(htmlInput)


    React.Children.map(element, (child) => {
      const childNode = this.buildHtmlTree(child)
      if (childNode) {
        root.addChild(childNode)
      }
    })

    const reactElement = this.createReactComponent(root, transformImg)

    return reactElement

  }

  static isType(node, type) {
    if (node.type == 'tag') {
      return node.tagName == type
    }
    else {
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
        }
        else {
          hasChildType = this.hasChildOfType(child, type)
        }
        i += 1
      }
      return hasChildType
    }
    else {
      return false
    }
  }

  static hasParentOfType(node, type) {
    if (node.parent == null) {
      return false
    }
    else {
      if (this.isType(node.parent, type)) {
        return true
      }
      else {
        return this.hasParentOfType(node.parent, type)
      }
    }
  }

  static parseToReact(htmlInput) {

    var htmlToReactParser = new HtmlToReactParser();
    return htmlToReactParser.parse(htmlInput)
  }

  static renderToHtml(reactComponent) {
    return ReactDOMServer.renderToStaticMarkup(reactComponent)
  }

  static processNodes(htmlInput, shouldProcess, process) {

    var isValidNode = function () {
      return true;
    }

    var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React)

    var processingInstructions = [
      {
        replaceChildren: true,
        // Custom <h1> processing
        shouldProcessNode: function (node) {
          return shouldProcess(node);
        },
        processNode: function (node, children, index) {
          return process(node, children);
        }
      },
      {
        // Anything else
        shouldProcessNode: function (node) {
          return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
      }
    ];

    var htmlToReactParser = new HtmlToReactParser()

    var reactComponent = htmlToReactParser.parseWithInstructions(htmlInput, isValidNode,
      processingInstructions);

    return reactComponent
  }

  static buildReactElement(node) {

  }


}

export default ReactDOMHelper