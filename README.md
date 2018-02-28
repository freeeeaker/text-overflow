# textOverflow
A small library to split text and add additional words under the condition of Specified lines
## how to use
``` javascript
const textOverflow = require('text-overflow')
textOverflow(options)
```
## options
### node: node
  容器节点，需要被文本截断的元素
  a container node which the html will be cutted
### str: String
  容器节点中应该被插入的html文本
  the html which should be inserted to the container node
### addedStr: String
  需要被补全的html文本
  the html which should be added to the origin html
### maxWidth: Number
  容器节点的最大宽度
  the max width of the container node
### maxLine: Number
  允许的最大行数
  the max line number
### emptyLine:? Boolean
  是否允许有空行
  is empty line should be allowed
## caution
  
