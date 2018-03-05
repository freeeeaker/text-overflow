function textOverflow (node, { str, addedStr, maxWidth, maxLine = 1, emptyLine = true }) {
  if (!node || node.nodeType !== 1) return
  node.innerHTML = ''
  str = str.replace(/^(\r?\n)+|(\r?\n)$/g, '')
  str = emptyLine ? str.replace(/(\r?\n){2,}/g, '<br><br>').replace(/\r?\n/g, '<br>') : str.replace(/(\r?\n)+/g, '<br>')

  var divNode = document.createElement('div')
  divNode.innerHTML = str

  var textNodesAndEmptyNodes = getTextNodesOrEmptyNodes(divNode)
  for(var i = 0; i < textNodesAndEmptyNodes.length; i++) {
    if (textNodesAndEmptyNodes[i].nodeType === 3) {
      wrapTextNode(textNodesAndEmptyNodes[i])
    }
  }

  var nodeHTML = divNode.innerHTML

  var pList = []
  var addWidth = 0
  var lineNum = 0
  var overflow = false
  var view = document.createElement('p')
  var span = document.createElement('span')
  var cloneNode = null
  var currentWidth = 0

  while(nodeHTML.length > 0) {
    var index = nodeHTML.indexOf('<br>')
    if (index !== -1) {
      if (index !== 0) {
        var str = nodeHTML.substring(0, index)
        pList.push(str)
      } else {
        pList.push('<br>')
      }
    } else {
      pList.push(nodeHTML)
      break
    }
    if (nodeHTML.slice(index) === '<br>') {
      pList.push('<br>')
      break
    }
    nodeHTML = nodeHTML.slice(index + 4)
  }

  span.innerHTML = addedStr
  view.appendChild(span)
  node.appendChild(view)
  addWidth = span.offsetWidth + getHorizontalMargin(span)
  node.removeChild(view)

  for (var i = 0; i < pList.length; i++) {
    var html = pList[i]
    if (html === '<br>') {
      lineNum++
      node.appendChild(document.createElement('br'))
    } else {
      var p = document.createElement('p')
      p.innerHTML = html
      node.appendChild(p)

      var allChildNodes = p.childNodes
      var lineWidth = 0
      var cloneP = document.createElement('p')

      node.appendChild(cloneP)
      lineNum++
      var flag = caculateLineNum(p)
      node.removeChild(p)
      if (flag) {
        break
      }
      if (lineNum === maxLine) {
        if (pList[i + 1]) {
          // console.log('case 2:', '当前段落只有一行，但是 还有下一段，则也需要补全')
          overflow = true
          break
        }
      } else if (lineNum === maxLine - 1) {
        if (pList[i+1] === '<br>') {
          if (pList[i+2]) {
            // console.log('case 3:', '第七行是空行, 第八行存在 补全')
            overflow = true
            break
          } 
        }
      }
    }
  }
  if (overflow) {
    if (currentWidth >= maxWidth) {
      while (cloneNode) {
        if (cloneNode.nodeName.toLowerCase() === 'x-node') {
          currentWidth -= cloneNode.offsetWidth
          cloneNode = getPreviousXNode(cloneNode)
          if (!cloneNode) break
          if (cloneNode.nextElementSibling) {
            cloneNode.parentNode.removeChild(cloneNode.nextElementSibling)
          } else if (cloneNode.parentNode.nextElementSibling) {
            cloneNode.parentNode.parentNode.removeChild(cloneNode.parentNode.nextElementSibling)
          }
          if (currentWidth < maxWidth) break
        } else {
          var nodeArr = [].slice.call(cloneNode.querySelectorAll('x-node'))
          var length = nodeArr.length
          while(length) {
            var currNode = nodeArr[length - 1]
            currentWidth -= currNode.offsetWidth
            currNode.parentNode.removeChild(currNode)
            length--
            if (currentWidth < maxWidth) break
          }
          cloneNode = cloneNode.previousElementSibling
          if (length === 0) cloneNode.parentNode.removeChild(cloneNode.nextElementSibling)
        }
      }
    }
    
    var p = node.querySelectorAll('p')
    var lastP = p[p.length - 1]
    lastP.innerHTML = lastP.innerHTML + addedStr
  }

  var xNodes = node.querySelectorAll('x-node')
  var pNodes = node.querySelectorAll('p')
  for (var i = 0; i < pNodes.length; i++) {
    var p = pNodes[i]
    var br = document.createElement('br')
    if (p.nextElementSibling) {
      p.parentNode.insertBefore(br, p.nextElementSibling)
    }
    unwrapNode(p)
  }
  for (var i = 0; i < xNodes.length; i++) {
    unwrapNode(xNodes[i])
  }
  node.normalize()

  function caculateLineNum (element, parentNode) {
    var childNodes = element.childNodes
    for (var i = 0; i < childNodes.length; i ++) {
      var childNode = childNodes[i]
      var nodeName = childNode.nodeName.toLowerCase()
      if (nodeName === 'x-node' || childNode.childNodes.length === 0) {
        cloneNode = childNode.cloneNode(true)
        if (parentNode) {
          parentNode.appendChild(cloneNode)
        } else {
          cloneP.appendChild(cloneNode)
        }
        lineWidth += childNode.offsetWidth + getHorizontalMargin(childNode)
        currentWidth = lineWidth + addWidth
        if (lineWidth >= maxWidth) {
          lineNum++
          lineWidth = childNode.offsetWidth
          if (lineNum > maxLine) {
            // console.log('case 1:', '段落不超过7段，行数文本超出7行')
            overflow = true
            return true
          }
        }
        // cloneNode.setAttribute('data-offset-width', lineWidth)
      } else {
        lineWidth += getHorizontalMargin(childNode)
        cloneNode = childNode.cloneNode(true)
        cloneNode.innerHTML = ''
        cloneP.appendChild(cloneNode)
        if(caculateLineNum(childNode, cloneNode)) return true
      }
    }
    return false
  }
}
function getPreviousXNode (xNode) {
  var previousNode = xNode.previousElementSibling
  if (previousNode) {
    return previousNode
 } else {
    previousNode = xNode.parentNode.previousElementSibling
    if (previousNode.nodeName.toLowerCase() === 'x-node') {
      return previousNode
    } else {
      var xNodes = previousNode.querySelectorAll('x-node')
      if (xNodes.length > 0) {
        return xNodes[xNodes.length - 1]
      } else {
        return getPreviousXNode(previousNode)
      }
   }
 }
 return null
}
function wrapTextNode (textNode) {
  var frag = document.createDocumentFragment()
  for(var string of textNode.nodeValue) {
    var span = document.createElement('x-node')
    span.innerHTML = string
    frag.appendChild(span)
  }
  textNode.parentNode.insertBefore(frag, textNode)
  textNode.parentNode.removeChild(textNode)
}
function unwrapNode (node) {
  var parentNode = node.parentNode
  while(node.childNodes.length > 0) {
    parentNode.insertBefore(node.childNodes[0], node)
  }
  node.parentNode.removeChild(node)
}
function getTextNodesOrEmptyNodes (node) {
  var nodeList = []
  for (var i=0; i<node.childNodes.length; i++) {
    var target = node.childNodes[i]
    if (target.childNodes.length > 0) {
      nodeList = nodeList.concat(getTextNodesOrEmptyNodes(target))
    } else {
      nodeList.push(target)
    }
  }
  return nodeList
}
function getHorizontalMargin (node) {
  let leftMargin = getComputedStyle(node).marginLeft
  let rightMargin = getComputedStyle(node).marginRight
  if (leftMargin === 'auto') leftMargin = 0
  if (rightMargin === 'auto') rightMargin = 0
  return parseFloat(leftMargin) + parseFloat(rightMargin)
}
module.exports = textOverflow