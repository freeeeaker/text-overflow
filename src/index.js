var app = document.getElementById('app')
var str = 'aaa阿斯蒂芬阿斯蒂芬阿斯蒂芬阿斯蒂芬asd发送的发斯蒂芬阿斯蒂芬1234567890\n' 
        + 'bbb阿斯蒂芬阿斯蒂\n芬阿斯蒂芬阿斯\n蒂芬阿斯蒂芬瑟瑟阿道夫阿asd发斯蒂芬撒'
        + '旦法阿斯<span class="c"></span>蒂芬阿斯蒂芬asd发斯蒂芬阿斯\nccc蒂芬阿斯蒂芬asd发送地方撒地方撒旦法阿斯'
        + '蒂芬阿斯蒂芬斯蒂芬阿斯蒂芬阿斯蒂\nddd芬阿斯蒂芬阿斯蒂芬阿斯蒂芬发抖'
        + '阿斯蒂芬阿1<mention>斯蒂芬阿斯蒂芬asd发</mention>撒旦法a阿斯蒂芬阿斯蒂芬阿斯蒂芬安抚d'
        + '<span class="c"></span>一二三四五六七八九十金木水火土阴阳'

textOverflow({ node: app, str, addedStr: '...<a href="javascript:;">全文</a>' })


function textOverflow ({ node, str, addedStr, maxWidth = 510, maxLine = 7, onOverflow }) {
  if (!node) return
  node.innerHTML = ''

  str = str.replace(/^(\r?\n)+/g, '').replace(/\r?\n/g, '<br>')
  
  var divNode = document.createElement('div')
  divNode.innerHTML = str
  // 给所有文本包裹一个span
  wrapLetter(getTextNodesOrEmptyNodes(divNode))
  var nodeHTML = divNode.innerHTML

  var pList = []
  var addWidth = 0
  var lineNum = 0
  var lastP = null
  var overflow = false

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

  // 计算要插入的字符串的宽度
  var view = document.createElement('p')
  var span = document.createElement('span')
  var cloneNode = null
  var currentWidth = 0

  span.innerHTML = addedStr
  view.appendChild(span)
  node.appendChild(view)
  addWidth = span.offsetWidth
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
        // 行数目前等于最大行数了
        if (lineWidth >= maxWidth) {
          // 如果当前段落有多行， 则需要补全...
          console.log('-----over3----', lineWidth < maxWidth)
          overflow = true
          break
        } else {
          // 如果当前当前段落只有一行，但是 还有下一段，则也需要补全。
          if (pList[i + 1]) {
            console.log('-----over4----', lineWidth < maxWidth)
            overflow = true
            break
          }
        }
      } else if (lineNum === maxLine - 1) {
        // 如果当前行数是倒数第二行， 但是后两段是空行。 需要补全
        if (pList[i+1] === '<br>') {
          if (pList[i+2]) {
            console.log('-----over5----第七行是空行')
            overflow = true
            break
          } 
        }
      }
    }
  }

  if (overflow) {
    resizeNode(cloneNode, currentWidth, maxWidth, onOverflow)
    insertStringToNode(node, addedStr)
  }
  // 清楚所有包裹文本的span
  // var allSpan = node.querySelectorAll('letter')
  // for (var i=0;i<allSpan.length;i++) {
  //   if (!allSpan[i].className) {
  //     unwrapNode(allSpan[i])
  //   }
  // }
  node.normalize()

  function caculateLineNum (element, parentNode) {
    var childNodes = element.childNodes
    for (var i = 0; i < childNodes.length; i ++) {
      var childNode = childNodes[i]
      var nodeName = childNode.nodeName.toLowerCase()
      if (nodeName === 'letter' || childNode.childNodes.length === 0) {
        cloneNode = childNode.cloneNode(true)
        if (parentNode) {
          parentNode.appendChild(cloneNode)
        } else {
          cloneP.appendChild(cloneNode)
        }
        lineWidth += childNode.offsetWidth
        cloneNode.setAttribute('data-offset-width', lineWidth)
        if (lineWidth > maxWidth) {
          console.log('one more line')
          lineNum++
          currentWidth = lineWidth + addWidth
          lineWidth = childNode.offsetWidth
          if (lineNum > maxLine) {
            console.log('------over1----', lineNum, maxLine)
            overflow = true
            return true
          }
        }
      } else {
        cloneNode = document.createElement(nodeName)
        cloneP.appendChild(cloneNode)
        if(caculateLineNum(childNode, cloneNode)) return true
      }
    }
    return false
  }
  function resizeNode (node, width, maxWidth, onOverflow) {
    if (width < maxWidth) return onOverflow && onOverflow(true)
    while (node) {
      if (node.nodeName.toLowerCase() === 'letter') {
        width -= node.offsetWidth
        node = node.previousElementSibling
        node.parentNode.removeChild(node.nextElementSibling)
        if (width < maxWidth) return onOverflow && onOverflow(true)
      } else {
        var nodeArr = [].slice.call(node.querySelectorAll('letter'))
        var length = nodeArr.length
        while(length) {
          var currNode = nodeArr[length - 1]
          width -= currNode.offsetWidth
          currNode.parentNode.removeChild(currNode)
          length--
          if (width < maxWidth) return onOverflow && onOverflow(true)
        }
        node = node.previousElementSibling
        if (length === 0) node.parentNode.removeChild(node.nextElementSibling)
      }
    }
  }
  function insertStringToNode(node, insertString) {
    var p = node.querySelectorAll('p')
    var lastP = p[p.length - 1]
    lastP.innerHTML = lastP.innerHTML + insertString
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
    for (var i=0;i<node.childNodes.length;i++) {
      var target = node.childNodes[i]
      if (target.childNodes.length > 0) {
        nodeList = nodeList.concat(getTextNodesOrEmptyNodes(target))
      } else {
        nodeList.push(target)
      }
    }
    return nodeList
  }
  function wrapLetter (nodeList) {
    for(var i = 0; i < nodeList.length; i++) {
      if (nodeList[i].nodeType === 3) {
        var frag = document.createDocumentFragment()
        for(var string of nodeList[i].nodeValue) {
          var span = document.createElement('letter')
          span.innerHTML = string
          frag.appendChild(span)
        }
        nodeList[i].parentNode.insertBefore(frag, nodeList[i])
        nodeList[i].parentNode.removeChild(nodeList[i])
      }
    }
  }
}