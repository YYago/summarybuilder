# summarybuilder 目录生成器

主要应用于`gitbook`以及类似于它一样有`SUMMARY.md`的项目插件的小工具(目前只支持`.md`类型)，就两个用途：

1. 基于现有的 `SUMMARY.md` 中已列出的文件清单，批量创建它们（`已经存在的文件会忽略掉`）;

2. 基于现有的`.md`文件创建`SUMMARY.md`清单。
    > NOTE: 不会直接重写SUMMARY.md文件，会生成一个：`_summary.md`的文件到项目根目录下，需要手动调整顺序再复制并粘贴到你的项目的`SUMMARY.md`文件中。

3. 事实上，它可以用于存在 `.md` Markdown 文件的任何目录。

4. 引入`summarybuilder`模块，在项目的自定义任务(Task)或者事件(event)中使用。

NOTE: 

*  可能需要 node js V7.x 以上的版本或更高，旧版本的 `fs` 模块对路径要求必须是字符串，经常被半路翻沟(可能是我不会处理吧，也没注意node的更新说明，反正为了远离这恼人的问题已经升级node.js到新版本)。

* 已经默认排除的文件和文件夹(*仅作为命令运行时，模块引入时并没有排除任何文件*)：
    ```JSON
    [
        '!SUMMARY.md', 
        '!node_modules/**', 
        '!_summary.md'
    ]
    ```

* **在使用git进行add操作之前请删掉插件生成的文件或者将其写进`.gitignore`中排除**。 
    ```text
    # tmp files
    _summary.md
    .li.json
    ```

## changes in new version

### v1.4.0

怎么说呢！未经测试的代码不要急着发布!

在本次更新中：**另外加了两个接口，以便在自定义任务中使用，比如在gulp中使用，删掉之前版本提供的接口**。
> 之前的版本都有提及，但是实际使用可能就呵呵了，老实说，之前我都没测过......I'm so sorry！

- [x] 新增接口：`SBer_summary()` 支持自定义输入、输出文件。
- [x] 新增接口: `SBer_createMD()`支持自定义输入、输出文件，并且支持写入标题以外的内容。我认为你完全可以为这些Markdown文件批量加入某些相同的内容,比如: `[TOC]`标记。
- [x] 本版本仅改进`require('summarybuilder')`方式的用法接口，命令形式(*run as command with terminal* )的用法照旧，没有更新。

## Usage

> 如果有什么错误和遗漏还请大家指正。

### Install 安装

* 安装到你的项目中。

    `npm install --save summarybuilder`

* 全局安装

    `npm install -g summarybuilder`  推荐

### Commands 命令

command(命令)| description(说明)
-----------|-----------------
summary -c | 创建SUMMARY.md里列出的文件。
summary -b | 创建_summary.md 清单。
summary -b -t | 在创建_summary.md 中使用缩进。ps:这会让层次清晰些（默认按文件夹结构缩进）。
summary -b -t ignores... | `ignore...`排除掉一些你不想添加到_summary.md 中的文件。并且使用缩进。参数： ` -t ` 应该在排除文件之前。
summary -d | 删除垃圾文件( `./.li.json` 、` ./_summary.md`)。

> 如果是仅安装到项目下，那么命令可能需要添加前置 `node` 命令。全局则不需要（实际上 argv0 依旧是node ）。

#### Example( *run as command with terminal* )

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
> Note: 如果想只处理某一个文件下的文件，请先 cd 到那个文件夹再使用命令处理，这样可以省去写太多排除文件、文件夹的带来的苦恼。

### 引入`summarybuilder`模块

特意新增：`SBer_summary()` 和 `SBer_createMD()` 供使用。就是这名称前缀怎么看都觉得怪怪的......

#### Example（as a module）

> gulpfile.js:

```JavaScript
const sm = require('summarybuilder');
const gulp = require('gulp');
const gulpfl = require('gulp-filelist');

// task for create files which listed in summary.
gulp.task('create', function () {
    sm.SBer_createMD("./test/a.txt", "By summarybuider");
});

// create a JSON file to list  all of Markdown files you wanted.
gulp.task('list', function () {
    gulp.src('test/**/*.md')
        .pipe(gulpfl('list.json'))
        .pipe(gulp.dest('test'));
});

// Add a watch task to run it when some file changed.
gulp.task('watcher', function () {

    gulp.watch('test/**/*.md', ['list']);

    gulp.watch('test/list.json', function () {
        sm.SBer_summary('./test/list.json', false, 'sm.txt'); 
    });
});
```

## API

从summarybuilder模块引入。

### 1. SBer_summary() *生成类似SUMMARY.md的文件*。

SBer_summary( jsonFileName, isIndent, outFileName )

* `jsonFileName`：type: *string*——The path of the JSON file.It is better to be created by the plugin: [gulp-filelist](https://www.npmjs.com/package/gulp-filelist).
JSON格式的列表文件路径 *example*：`allMDlist.json`:
    
    ```JSON
    [
    "./a/a.md",
    "./b/b.md"
    ]
    ```
    >NOTE:注意保留完整路径，以便读取。

* `isIndent`: type: *Boolean* ——Indent? If `true` will be indented.Must `true` or `false`.
【是否缩进？true 则缩进，没有默认值，必须定义.】

 * `outFileName`: type: *string*—— example: "a.md",Any you wanted if you sure it can be read.
 定义输出文件的路径。

### 2. SBer_createMD() *创建对应的markdown文件*。

SBer_createMD( summaryFilePath )，基于类似SUMMARY.md的列表创建对应的markdown文件。

* `summaryFilePath`:type: *string*——具有和*SUMMARY.md* 相同内容格式的文件的路径(当然，也可以直接用SUMMARY.md的路径)。

* `arguments[1]`: type: *string*——添加标题以外的内容，可以是Markdown的正文部分(*第一个`#`标记已经存在，如不是必须，最好不要重复加入*)。

    xxx.md
    ```Markdown
    * [TEST](./a/TA)
    ```
    xx.js:
    
    ```JavaScript
    // no content 仅写入标题
    SBer_createMD('./SUMMARY.md');

    // Add some content 加入额外的正文内容
    SBer_createMD('./SUMMARY.md','This is a test content!');

    ```
    result ( *If no error :<* )：

    ```Markdown
    # TEST

    This is a test content!
    ```

## Donate to author

![Donate to author](/static/zs.jpg)
QR code for WeChat

## Licence

[MIT](./LICENSE)