(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["textOverflow"] = factory();
	else
		root["textOverflow"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function textOverflow(node, _ref) {
  var str = _ref.str,
      addedStr = _ref.addedStr,
      maxWidth = _ref.maxWidth,
      _ref$maxLine = _ref.maxLine,
      maxLine = _ref$maxLine === undefined ? 1 : _ref$maxLine,
      _ref$emptyLine = _ref.emptyLine,
      emptyLine = _ref$emptyLine === undefined ? true : _ref$emptyLine;

  if (!node || node.nodeType !== 1) return;
  node.innerHTML = '';
  str = str.replace(/^(\r?\n)+|(\r?\n)$/g, '');
  str = emptyLine ? str.replace(/(\r?\n){2,}/g, '<br><br>').replace(/\r?\n/g, '<br>') : str.replace(/(\r?\n)+/g, '<br>');

  var divNode = document.createElement('div');
  divNode.innerHTML = str;

  var textNodesAndEmptyNodes = getTextNodesOrEmptyNodes(divNode);
  for (var i = 0; i < textNodesAndEmptyNodes.length; i++) {
    if (textNodesAndEmptyNodes[i].nodeType === 3) {
      wrapTextNode(textNodesAndEmptyNodes[i]);
    }
  }

  var nodeHTML = divNode.innerHTML;

  var pList = [];
  var addWidth = 0;
  var lineNum = 0;
  var overflow = false;
  var view = document.createElement('p');
  var span = document.createElement('span');
  var cloneNode = null;
  var currentWidth = 0;

  while (nodeHTML.length > 0) {
    var index = nodeHTML.indexOf('<br>');
    if (index !== -1) {
      if (index !== 0) {
        var str = nodeHTML.substring(0, index);
        pList.push(str);
      } else {
        pList.push('<br>');
      }
    } else {
      pList.push(nodeHTML);
      break;
    }
    if (nodeHTML.slice(index) === '<br>') {
      pList.push('<br>');
      break;
    }
    nodeHTML = nodeHTML.slice(index + 4);
  }

  span.innerHTML = addedStr;
  view.appendChild(span);
  node.appendChild(view);
  addWidth = span.offsetWidth + getHorizontalMargin(span);
  node.removeChild(view);

  for (var i = 0; i < pList.length; i++) {
    var html = pList[i];
    if (html === '<br>') {
      lineNum++;
      node.appendChild(document.createElement('br'));
    } else {
      var p = document.createElement('p');
      p.innerHTML = html;
      node.appendChild(p);

      var allChildNodes = p.childNodes;
      var lineWidth = 0;
      var cloneP = document.createElement('p');

      node.appendChild(cloneP);
      lineNum++;
      var flag = caculateLineNum(p);
      node.removeChild(p);
      if (flag) {
        break;
      }
      if (lineNum === maxLine) {
        if (pList[i + 1]) {
          // console.log('case 2:', '当前段落只有一行，但是 还有下一段，则也需要补全')
          overflow = true;
          break;
        }
      } else if (lineNum === maxLine - 1) {
        if (pList[i + 1] === '<br>') {
          if (pList[i + 2]) {
            // console.log('case 3:', '第七行是空行, 第八行存在 补全')
            overflow = true;
            break;
          }
        }
      }
    }
  }
  if (overflow) {
    if (currentWidth >= maxWidth) {
      while (cloneNode) {
        if (cloneNode.nodeName.toLowerCase() === 'x-node') {
          currentWidth -= cloneNode.offsetWidth;
          cloneNode = cloneNode.previousElementSibling || cloneNode.parentNode.previousElementSibling;
          cloneNode.parentNode.removeChild(cloneNode.nextElementSibling);
          if (currentWidth < maxWidth) break;
        } else {
          var nodeArr = [].slice.call(cloneNode.querySelectorAll('x-node'));
          var length = nodeArr.length;
          while (length) {
            var currNode = nodeArr[length - 1];
            currentWidth -= currNode.offsetWidth;
            currNode.parentNode.removeChild(currNode);
            length--;
            if (currentWidth < maxWidth) break;
          }
          cloneNode = cloneNode.previousElementSibling;
          if (length === 0) cloneNode.parentNode.removeChild(cloneNode.nextElementSibling);
        }
      }
    }

    var p = node.querySelectorAll('p');
    var lastP = p[p.length - 1];
    lastP.innerHTML = lastP.innerHTML + addedStr;
  }

  var xNodes = node.querySelectorAll('x-node');
  var pNodes = node.querySelectorAll('p');
  for (var i = 0; i < pNodes.length; i++) {
    var p = pNodes[i];
    var br = document.createElement('br');
    if (p.nextElementSibling) {
      p.parentNode.insertBefore(br, p.nextElementSibling);
    }
    unwrapNode(p);
  }
  for (var i = 0; i < xNodes.length; i++) {
    unwrapNode(xNodes[i]);
  }
  node.normalize();

  function caculateLineNum(element, parentNode) {
    var childNodes = element.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      var childNode = childNodes[i];
      var nodeName = childNode.nodeName.toLowerCase();
      if (nodeName === 'x-node' || childNode.childNodes.length === 0) {
        cloneNode = childNode.cloneNode(true);
        if (parentNode) {
          parentNode.appendChild(cloneNode);
        } else {
          cloneP.appendChild(cloneNode);
        }
        lineWidth += childNode.offsetWidth + getHorizontalMargin(childNode);
        currentWidth = lineWidth + addWidth;
        if (lineWidth >= maxWidth) {
          lineNum++;
          lineWidth = childNode.offsetWidth;
          if (lineNum > maxLine) {
            // console.log('case 1:', '段落不超过7段，行数文本超出7行')
            overflow = true;
            return true;
          }
        }
        // cloneNode.setAttribute('data-offset-width', lineWidth)
      } else {
        lineWidth += getHorizontalMargin(childNode);
        cloneNode = childNode.cloneNode(true);
        cloneNode.innerHTML = '';
        cloneP.appendChild(cloneNode);
        if (caculateLineNum(childNode, cloneNode)) return true;
      }
    }
    return false;
  }
}

function wrapTextNode(textNode) {
  var frag = document.createDocumentFragment();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = textNode.nodeValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var string = _step.value;

      var span = document.createElement('x-node');
      span.innerHTML = string;
      frag.appendChild(span);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  textNode.parentNode.insertBefore(frag, textNode);
  textNode.parentNode.removeChild(textNode);
}
function unwrapNode(node) {
  var parentNode = node.parentNode;
  while (node.childNodes.length > 0) {
    parentNode.insertBefore(node.childNodes[0], node);
  }
  node.parentNode.removeChild(node);
}
function getTextNodesOrEmptyNodes(node) {
  var nodeList = [];
  for (var i = 0; i < node.childNodes.length; i++) {
    var target = node.childNodes[i];
    if (target.childNodes.length > 0) {
      nodeList = nodeList.concat(getTextNodesOrEmptyNodes(target));
    } else {
      nodeList.push(target);
    }
  }
  return nodeList;
}
function getHorizontalMargin(node) {
  var leftMargin = getComputedStyle(node).marginLeft;
  var rightMargin = getComputedStyle(node).marginRight;
  if (leftMargin === 'auto') leftMargin = 0;
  if (rightMargin === 'auto') rightMargin = 0;
  return parseFloat(leftMargin) + parseFloat(rightMargin);
}
exports.default = textOverflow;

/***/ })
/******/ ]);
});