
var React = require('react');
var HtmlToReact = require('html-to-react');
var HtmlToReactParser = require('html-to-react').Parser;
var ReactDOMServer = require('react-dom/server');

class ReactDOMHelper {

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

  static createReactTextElement(text, index) {
    return React.createElement('div', { key: index, }, text)
  }

  static createReactElementOfType(node, type, index, processChild) {

    var children = []

    if (node.childNodes) {
      node.childNodes.map(child => {

        if (child.type === 'tag') {
          children.push(
            processChild(child, children.length)
          )
        }
      })
    }

    return React.createElement(type, { key: index, }, children)

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