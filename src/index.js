import textOverflow from './text-overflow.js'

var app = document.getElementById('app')
var app1 = document.getElementById('app1')
var origin = document.getElementById('origin')
var node = document.getElementById('node')
var add = document.getElementById('add')
var remove = document.getElementById('remove')

var str = 'this is the first paragraph<mention id="sfd">@github</mention>, it not only has plain text\n' 
        + 'this is the second paragraph，break line by \\n\n'
        + 'this is the third<a href="https://github.com"><span class="c"></span>github.com</a>, width padding and margin\n'
        + '\n'
        + '\n'
        + '\n'
        + 'this is the fourth\n'
        + 'you can use emoji<span class="c"></span>😆😆😆😆😆😆😆😆\n'
        + '😆😆😆😆'

// origin.innerHTML = str

var maxWidth  = 360

textOverflow(app, { 
  str,
  addedStr: '...<a href="javascript:;">more</a>',
  maxLine: 7,
  maxWidth,
  emptyLine: true
})

textOverflow(app1, { 
  str,
  addedStr: '...<a href="javascript:;">more</a>',
  maxLine: 7,
  maxWidth,
  emptyLine: false
})

var userList = [
  '点击有变化哦',
  // '嘎嘎嘎',
  // '嘿嘿嘿',
  '😆😆😆',
  '😎😎😎',
  'click it',
  '吼 吼 吼',
  'enenen',
  'gogogo',
  '哦哦哦'
];

textOverflow(node, {
  str: convertUserListToHTML(userList),
  addedStr: `等${userList.length}觉得很赞`,
  maxLine: 2,
  maxWidth
})

var num = 0

add.onclick = function () {
  num++
  userList.push(`哟哟哟${num}`)
  var str = convertUserListToHTML(userList)
  textOverflow(node, {
    str,
    addedStr: `等${userList.length}人觉得很赞`,
    maxLine: 2,
    maxWidth
  })
}

remove.onclick = function () {
  if (num <= 0) return
  num--
  userList.pop()
  var str = convertUserListToHTML(userList)
  textOverflow(node, {
    str,
    addedStr: `等${userList.length}人觉得很赞`,
    maxLine: 2,
    maxWidth
  })
}

function convertUserListToHTML (array) {
  var html = ''
  for (var i = 0; i < array.length; i++) {
    if (i === array.length - 1) {
      html += `<a href="#">${array[i]}</a>`
    } else {
      html += `<a href="#">${array[i]}</a>,`
    }
  }
  return html
}