# 可视化工作

目前已利用three.js完成模型的绘制，使用的是点着色而非面着色，已实现旋转，缩放，显示网格，预览图片等功能。

 | ![image.png](https://s2.loli.net/2022/08/14/XI81kpROj5FnYC6.png) | ![image.png](https://s2.loli.net/2022/08/14/YiKSeHMcUwkf8XL.png) |
 |:-----:|:-----:|
 | 图一：完整渲染图| 图二：网格图 |

模型数据json文件格式为
```json
{
    "metadata": {
        "version": 4,
        "type": "BufferGeometry"
    },
    "uuid": "AF2ADB07-FBC5-4BAE-AD60-123456789ABC",
    "type": "BufferGeometry",
    "data": {
        "attributes": {
            "position": {
                "itemSize": 3,
                "type": "Float32Array",
                "array": [ 2.3,4.5,1.4,... ]
            },
            "pressure": {
                "itemSize": 1,
                "type": "Float32Array",
                "array": [ 3.2, ... ]
            }
        },
        "index": {
            "type": "Uint16Array",
            "array": [ 1,2,3, ... ]
        }
    }
}
```

其中`metadata.version`为系统自加的版本控制量，`metadata.type`为加载的数据文件类型，在three.js的代码中，该值需要为`BufferGeometry`，`uuid`为[通用唯一识别码](https://baike.baidu.com/item/UUID/5921266)，`data.attributes.position`为模型的各个节点的坐标，坐标值的数据类型为Float32，一维数组`array`中每三个一组组成一个节点的坐标值，因此`itemSize`为3，`data.attributes.pressure`为各个节点的应力值，节点顺序与`position`中一致，`data.index`为各个三角形面片的三个顶点的索引，其索引值与`position`/`pressure`中节点顺序保持一致。
