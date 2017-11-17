# summarybuilder 目录生成器

主要应用于`gitbook`以及类似于它的一样有`SUMMARY.md`的项目插件的小工具(目前只支持`.md`类型文件的处理)，就两个用途：

1. 基于现有的 `SUMMARY.md` 中已列出的文件清单，批量创建它们（`已经存在的文件会忽略掉`）;
    > NOTE: 我测试了，确实不会重写已有文件，但是不确定会不会存在某些为知的情形导致重写已有文件（那将是很糟糕的事情）建议在项目以外的地方测试下。
2. 基于现有的`.md`文件创建`SUMMARY.md`清单。
    > NOTE: 不会直接重写SUMMARY.md文件（这样不科学），会生成一个：`_summary.md`的文件到项目根目录下，需要手动调整顺序、缩进之后再复制并粘贴到你的项目的`SUMMARY.md`文件中。

## Usage

### Install 安装

* 安装到你的项目中。

    `npm install --save-dev summarybuilder`
* 全局安装

    `npm install -g summarybuilder`

### Commands 命令

command(命令)| description(说明)
-----------|-----------------
summary -c | 创建SUMMARY.md里列出的文件。
summary -b | 创建_summary.md 清单。
summary -d | 删除垃圾文件( `./.li.json` 、` ./_summary.md`)。