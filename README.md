# summarybuilder 目录生成器

> v1.3.1

主要应用于`gitbook`以及类似于它一样有`SUMMARY.md`的项目插件的小工具(目前只支持`.md`类型)，就两个用途：

1. 基于现有的 `SUMMARY.md` 中已列出的文件清单，批量创建它们（`已经存在的文件会忽略掉`）;

2. 基于现有的`.md`文件创建`SUMMARY.md`清单。
    > NOTE: 不会直接重写SUMMARY.md文件（这样不科学），会生成一个：`_summary.md`的文件到项目根目录下，需要手动调整顺序再复制并粘贴到你的项目的`SUMMARY.md`文件中。

3. 事实上，它可以用于存在 `.md` Markdown 文件的任何目录。

NOTE: 

*  可能需要 node js V7.x 以上的版本或更高，旧版本的 `fs` 模块对路径要求必须是字符串，经常被半路翻沟(可能是我不会处理吧，也没注意node的更新说明，反正为了远离这恼人的问题已经升级node.js到新版本)。

* 已经默认排除的文件和文件夹：
    ```
    ['!SUMMARY.md', '!node_modules/**', '!_summary.md']

    // 如果不能满足要求，可以通过

    summaryBuilder() 进行配置。
    ```

* **在使用git进行push之前请删掉插件生成的文件或者将其写进`.gitignore`中排除**。 
    ```
    # tmp files
    _summary.md
    .li.json
    ```

## changes in new version

### v1.3.1

* [x] 修复windows 平台路径生成不完整问题（带根目录前缀时）。

###  v1.3 

* [x] 解决filepath 存在多级目录时生成文章会报错。
  >可能在不同的系统会有报错的可能性吧，如果发现还请告知。
* [x] 解决排除文件无效问题。

###  v1.2

* [x] 修复不能排除多个文件问题
* [x] `-t` 参数需前置，排在排除文件之前。

###  v1.1.1
* [x] 支持缩进：像这样 `summary -b -t`。
* [x] `summary -b` 命令支持排除文件——以参数的方式。
* [x] 解决创建新的 markdown 文件时的报错中断问题(未能准确处理`fs`和`Path`模块导致)。
* [x] 解决删除垃圾文件时的报错中断问题(改成同步)。

## Usage

> 如果有什么错误和遗漏还请大家指正。Thanks

### Install 安装

* 安装到你的项目中。

    `npm install summarybuilder --save -dev`
* 全局安装

    `npm install summarybuilder -g`     推荐

### Commands 命令

command(命令)| description(说明)
-----------|-----------------
summary -c | 创建SUMMARY.md里列出的文件。
summary -b | 创建_summary.md 清单。
summary -b -t | 在创建_summary.md 中使用缩进。ps:这会让层次清晰些（默认按文件夹结构缩进）。
summary -b -t ignores... | `ignore...`排除掉一些你不想添加到_summary.md 中的文件。并且使用缩进。 `** -t **` 应该在排除文件之前。
summary -d | 删除垃圾文件( `./.li.json` 、` ./_summary.md`)。

> 如果是仅安装到项目下，那么命令可能需要添加前置 `node` 命令。全局则不需要（实际上 argv0 依旧是node ）。

## example

命令行参数中 `-c` 和 `-d`相对直接，我们来说说 `-b` 好了:

```
# 生成_summary.md 文件并缩进。

summary -b -t

# 生成_summary.md并排除掉不需要的文件。说明一下，为了兼顾 `gulp.src([...])` 参数格式，
# 在用命令行操作的时候要排除多个文件夹(文件)用空格隔开：

summary -b !/exc/**

# 或者 

summary -b -t !/exc/**

# 排除多个文件/文件夹(不同的文件、文件夹用空格隔开)：

summary -b -t !/exc/** !test/** !one/two/xx.md

```

>上面的这种情况可以通过下面的方式解决，我是这样想的。。。。

### 和 gulp.js 搭配

```
//...

gulp.task('builderSumm',()=>{
    summaryBuilder(...),
});

// 想要可控，可以使用gulp.task()来控制。

```

## Plugin function

### 1. summaryBuilder(arr);

生成 _summary.md 文件

 * @param {array} arr 数组 ['-b','-t','!exc/**','!exc1/...'],'-b'是必须的，其他的随意按需设置。

### 2. getFileHeader();

获取文件的标题。
 * @param {string} FilePath 文件路径，仅支持`.md`。
 * @param {string} filetype 文件类型

### 3. createFiles();
创建Markdown 文件，需要当前目录存在SUMMARY.md 文件。参数只能是`true`

## Licence

[MIT](./LICENSE)