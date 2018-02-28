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
### str: String
  容器节点中应该被插入的html文本
### addedStr: String
  需要被补全的html文本
### maxWidth: Number
  容器节点的最大宽度
### maxLine: Number
  允许的最大行数
### emptyLine:? Boolean
  是否允许有空行
