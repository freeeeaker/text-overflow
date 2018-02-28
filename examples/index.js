var app = document.getElementById('app')
var app1 = document.getElementById('app1')
var origin = document.getElementById('origin')
var node = document.getElementById('node')
var add = document.getElementById('add')
var remove = document.getElementById('remove')

var str = 'aaa阿斯<mention id="sfd">@蒂芬阿斯蒂芬</mention>阿斯蒂芬阿斯蒂芬asd发1234567890$\n' 
        + 'bbb阿斯蒂芬阿斯蒂$\n'
        + '芬阿<a href="javascript:;"><span class="c"></span>斯蒂芬阿斯end</a>\n'
        + '\n'
        + '\n'
        + '\n'
        + '蒂芬阿斯蒂芬瑟瑟阿道夫阿as😆😆😆d发斯蒂芬撒$\n'
        + '旦法阿斯<span class="c"></span>什么什么😆😆😆😆😆😆\n'
        + 'ddd<mention id="sfd">@蒂芬阿112😆😆😆</mention>$\n'
        + '\n'
        + '\n'
        + '阿斯蒂芬阿1<mention>斯蒂芬😆😆😆阿阿'

origin.innerHTML = str

var maxWidth  = 360

textOverflow({ 
  node: app,
  str,
  addedStr: '...<a href="javascript:;">点击查看全文</a>',
  maxLine: 7,
  maxWidth,
  emptyLine: true
})

textOverflow({ 
  node: app1,
  str,
  addedStr: '...<a href="javascript:;">点击查看全文</a>',
  maxLine: 7,
  maxWidth,
  emptyLine: false
})

var userList = [
  '哎哎哎',
  '不不不',
  // '嘎嘎嘎',
  // '嘿嘿嘿',
  '😆😆😆',
  '😎😎😎',
  'xixixixi',
  '吼 吼 吼',
  'enenen',
  'gogogo',
  '哦哦哦'
];

textOverflow({
  node,
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
  textOverflow({
    node,
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
  textOverflow({
    node,
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