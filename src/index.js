var app = document.getElementById('app')
var str = '阿斯蒂芬阿斯蒂芬阿斯蒂芬阿斯蒂芬asd发送的发斯蒂芬阿斯蒂芬\n' 
        + 'asdfasd阿斯蒂芬阿斯蒂芬阿斯蒂芬阿斯蒂芬阿斯蒂芬瑟瑟阿道夫阿asd发斯蒂芬撒'
        + '旦法阿斯<span class="c"></span>蒂芬阿斯蒂芬asd发斯蒂芬阿斯\n蒂芬阿斯蒂芬asd发送地方撒地方撒旦法阿斯'
        + '蒂芬阿斯蒂芬斯蒂芬阿斯蒂芬阿斯蒂\n芬阿斯蒂芬阿斯蒂芬阿斯蒂芬发抖'
        + '阿斯蒂芬阿斯蒂芬阿斯蒂芬asd发撒旦法a阿斯蒂芬阿斯蒂芬阿斯蒂芬安抚d'
        + '<span class="c"></span>一二三四五六七八九十金木水火土阴阳'

textOverflow({ node: app, str, insertString: '...<a href="javascript:;">全文</a>' })


function textOverflow ({ node, str, insertString, maxWidth = 510, maxLine = 7, onOverflow }) {
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
  span.innerHTML = insertString
  view.appendChild(span)
  node.appendChild(view)
  addWidth = span.offsetWidth
  node.removeChild(view)
  
  for (var i = 0; i < pList.length; i++) {
    var html = pList[i]
    if (html ==='<br>') {
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

      for (var j = 0; j < allChildNodes.length; j++) {
        var pChildNode = allChildNodes[j]
        var tagName = pChildNode.nodeName.toLowerCase()
        if ( tagName === 'letter' || pChildNode.childNodes.length === 0) {
          // 位于普通span文本中
          var cloneNode = pChildNode.cloneNode(true)
          cloneP.appendChild(cloneNode)

          lineWidth += pChildNode.offsetWidth
          if (lineWidth > maxWidth) {
            lineNum++
            if (lineNum > maxLine) {
              // 行数超过了最大行数
              console.log('------over1----', lineNum, maxLine)
              node.removeChild(p)
              resizeNode(cloneNode, lineWidth + addWidth, maxWidth, onOverflow)
              return insertStringToNode(node, insertString)
            }
            lineWidth = pChildNode.offsetWidth
          }
        } else {
          // 位于a标签 mention 标签里面
          var childNodes = pChildNode.childNodes
          var cloneNode = document.createElement(tagName)
          cloneP.appendChild(cloneNode)

          for(var k = 0; k < childNodes.length; k++) {
            lineWidth += childNodes[k].offsetWidth
            cloneNode.appendChild(childNodes[k].cloneNode(true))
            if (lineWidth > maxWidth) {
              lineNum++
              if (lineNum > maxLine) {
                console.log('------over2----', lineNum)
                // 刚好是a标签 或者 mention里面超出了
                node.removeChild(p)
                resizeNode(cloneNode, lineWidth + addWidth, maxWidth, onOverflow)
                return insertStringToNode(node, insertString)
              }
              lineWidth = childNodes[k].offsetWidth
            }
          }
        }
      }
      node.removeChild(p)
      if (lineNum === maxLine) {
        // 行数目前等于最大行数了
        if (lineWidth >= maxWidth) {
          // 如果当前段落有多行， 则需要补全...
          console.log('-----over3----', lineWidth < maxWidth)
          resizeNode(cloneNode, lineWidth + addWidth, maxWidth, onOverflow)
          return insertStringToNode(node, insertString)
        } else {
          // 如果当前当前段落只有一行，但是 还有下一段，则也需要补全。
          if (pList[i + 1]) {
            console.log('-----over4----', lineWidth < maxWidth)
            resizeNode(cloneNode, lineWidth + addWidth, maxWidth, onOverflow)
            return insertStringToNode(node, insertString)
          }
        }
      } else if (lineNum === maxLine - 1) {
        // 如果当前行数是倒数第二行， 但是后两段是空行。 需要补全
        if (pList[i+1] === '<br>') {
          if (pList[i+2]) {
            console.log('-----over5----第七行是空行')
            resizeNode(cloneNode, lineWidth + addWidth, maxWidth, onOverflow)
            return insertStringToNode(node, insertString)
          } 
        }
      }
    }
  }
  // 清楚所有包裹文本的span
  var allSpan = node.querySelectorAll('span')
  for (var i=0;i<allSpan.length;i++) {
    if (!allSpan[i].className) {
      unwrapNode(allSpan[i])
    }
  }
  node.normalize()
  onOverflow && onOverflow(false)
  
  function caculateLineNum (node, lineWidth, tagName) {
    var childNodes = node.childNodes
    for (var i = 0; i < childNodes.length; i ++) {
      var childNode = childNodes[i]
      var nodeName = childNode.nodeName.toLowerCase()
      if (nodeName === 'letter' || childNode.childNodes.length === 0) {
        var cloneNode = childNode.cloneNode(true)
        cloneP.appendChild(cloneNode)

        lineWidth += childNode.offsetWidth
        if (lineWidth > maxWidth) {
          lineNum++
          if (lineNum > maxLine) {
            console.log('------over1----', lineNum, maxLine)
            node.removeChild(p)
            resizeNode(cloneNode, lineWidth + addWidth, maxWidth, onOverflow)
            return insertStringToNode(node, insertString)
          }
          lineWidth = childNode.offsetWidth
        }
      } else {
        var cloneNode = document.createElement(tagName)
        cloneP.appendChild(cloneNode)
        caculateLineNum(childNode, lineWidth, tagName)
      }
    }
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
    var allSpan = node.querySelectorAll('span')
    for (var i=0;i<allSpan.length;i++) {
      if (!allSpan[i].className) {
        unwrapNode(allSpan[i])
      }
    }
    node.normalize()
    return node.innerHTML
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