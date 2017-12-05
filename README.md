# summarybuilder 目录生成器

主要应用于`gitbook`以及类似于它一样有`SUMMARY.md`的项目插件的小工具(目前只支持`.md`(.html)或者类型文件的处理)，就两个用途：

1. 基于现有的 `SUMMARY.md` 中已列出的文件清单，批量创建它们（`已经存在的文件会忽略掉`）;
    > NOTE: 我测试了，确实不会重写已有文件，但是不确定会不会存在某些为知的情形导致重写已有文件（那将是很糟糕的事情）建议在项目以外的地方测试下。
2. 基于现有的`.md`文件创建`SUMMARY.md`清单。
    > NOTE: 不会直接重写SUMMARY.md文件（这样不科学），会生成一个：`_summary.md`的文件到项目根目录下，需要手动调整顺序再复制并粘贴到你的项目的`SUMMARY.md`文件中。

NOTE: 

*  可能需要 node js V7.x 以上的版本或更高，旧版本的 `fs` 模块对路径要求必须是字符串，经常被半路翻沟(可能是我不会处理吧，也没注意node的更新说明，反正为了远离这恼人的问题已经升级node.js到新版本)。

* 已经默认排除的文件和文件夹：
    ```
    ['!SUMMARY.md', '!node_modules/**', '!_summary.md']

    // 如果不能满足要求，可以通过

    summaryBuild() 进行配置。
    ```

## changes in new version

* [x] 支持缩进：像这样 `summary -b -t`。
* [x] `summary -b` 命令支持排除文件——以参数的方式。
* [x] 解决创建新的 markdown 文件时的报错中断问题(未能准确处理`fs`和`Path`模块导致)。
* [x] 解决删除垃圾文件时的报错中断问题(改成同步)。

## Usage

> 如果有什么错误和遗漏还请大家指正。thanks

### Install 安装

* 安装到你的项目中。

    `npm install --save-dev summarybuilder`
* 全局安装

    `npm install -g summarybuilder`

### Commands 命令

command(命令)| description(说明)
-----------|-----------------
summary -c | 创建SUMMARY.md里列出的文件。
summary -b | 创建_summary.md 清单。
summary -b -t | 在创建_summary.md 中使用缩进。ps:这会让层次清晰些（默认按文件夹结构缩进）。
summary -b [ignore] -t | `[ignore]`排除掉一些你不想添加到_summary.md 中的文件。并且使用缩进。 
summary -d | 删除垃圾文件( `./.li.json` 、` ./_summary.md`)。

> 如果是仅安装到项目下，那么命令可能需要添加前置 `node` 命令。全局则不需要（实际上 argv0 依旧是node ）。

## example

命令行参数中 `-c` 和 `-d`相对直接，我们来说说 `-b` 好了:

```
# 生成_summary.md 文件并缩进。
summary -b -t

# 生成_summary.md并排除掉不需要的文件。说明一下，为了兼顾 `gulp.src([...])` 参数格式，
# 在用命令行操作的时候现在只支持排除一次，即不支持 [... , ...] 的形式，只能是 [...]
summary -b [!/exc/**]

# 或者 
summary -b [!/exc/**] -t

# 像下面这样应该不会有什么作用：

summary -b [!/exc/**,!/abd/**]

# 还不知道怎么解决这个问题，以后再说吧。
```

>上面的这种情况可以通过下面的方式解决，我是这样想的。。。。

### 和 gulp.js 搭配

```
 module.exports={
    summaryBuild,
    summaryCreateFile,
    summaryDelete
} 
// 它们都是立即执行的，所以想要可控，可以使用gulp.task()来控制。

```

例如: 

```
var stool = require('summarybuilder');
    //......
gulp.task('buildSUMM',(cb){

    stool.summaryBuild(['!README.md','!others/**'],true);
});

// 这样应该不会立即执行了。当你执行 buildSUMM  任务的时候才会开始。
```

## Plugin functions

### 1. summaryBuild( ignore, inendt );

生成 _summary.md 配置

 * @param {array} ignore 数组格式,支持的格式和`gulp.src([...])`一样
 * @param {boolean} inendt 是否缩进,默认 `true`

### 2. summaryCreateFile(boolean);

创建 markdown 文件

 * @param {boolean} boolean 只能 `true`，其他的参数没有响应。 

### 3. summaryDelete(boolean);

删除垃圾文件

 * @param {boolean} boolean 只能 `true`，其他的参数没有响应。

## Licence

[MIT](./LICENSE)