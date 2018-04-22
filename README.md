# summarybuilder 目录生成器

主要应用于`gitbook`以及类似于它一样有`SUMMARY.md`的项目插件的小工具(目前只支持`.md`类型)，就两个用途：

1. 基于现有的 `SUMMARY.md` 中已列出的文件清单，批量创建它们（`已经存在的文件会忽略掉`）;

2. 基于现有的`.md`文件创建`SUMMARY.md`清单。
    > NOTE: 不会直接重写SUMMARY.md文件，会生成一个：`_summary.md`的文件到项目根目录下，需要手动调整顺序再复制并粘贴到你的项目的`SUMMARY.md`文件中。

3. 事实上，它可以用于存在 `.md` Markdown 文件的任何目录。引入`summarybuilder`模块，在项目的自定义任务(Task)或者事件(event)中使用。

    NOTE: 

    * 已经默认排除的文件和文件夹(*仅作为命令运行时，模块引入时并没有排除任何文件*)：
    ```JSON
    [
        '!SUMMARY.md', 
        '!node_modules/**', 
        '!_summary.md'
    ]
    ```

    * **在使用 git 进行add操作之前请删掉插件生成的文件或者将其写进`.gitignore`中排除**。 
    ```text
    # tmp files
    _summary.md
    .li.json
    ```

## Changes in new version

V 1.4.2 ：

* fix errors，修复错误
* exports SBer_summaryMDs() ,example：
    ```js
    //...
    SBer_summaryMDs(['-t','./**/*.md','!Docs/**/*.md','!README.md']);

    // '-t' means indent, If you don't want it to be indented. just like this :
    SBer_summaryMDs(['./**/*.md','!Docs/**/*.md','!README.md']);
    ```
    It is very troublesome to provide a similar List.json to control which `.md` files can be added to `SUMMARY.md`, so this API is a supplement. You can generate `_summary.md`. selectively, as in an example.

    提供一个类似List.json 来控制哪些`.md`文件可以加入到`SUMMARY.md` ，这会很麻烦，因此这个API算是一个补充。你可以像例子中那样有选择性地生成`_summary.md`.

## Install 安装

* 安装到你的项目中。

    `npm install --save summarybuilder`

* 全局安装

    `npm install -g summarybuilder`  推荐

## Commands 命令

command(命令)| description(说明)
-------------|-----------------
summary -c | 创建SUMMARY.md里列出的文件，已存在的文件会跳过。<br>Create files that are listed in SUMMARY.md, and existing files will skip.
summary -b | 生成_summary.md 文件。Generate the file'_summary.md' .
summary -b -t | 在创建_summary.md 中使用缩进。ps:这会让层次清晰些（默认按文件夹结构缩进）。<br>Use indentation in the creation of _summary.md. Ps: this will make the level clearer (default by folder structure indent).
summary  -b  -t [ignores] | `[ignore]`排除掉一些你不想添加到_summary.md 中的文件并且使用缩进。<br>Exclude files that you do not want to add to _summary.md and use indentation.example：<br><pre>summary -b -t '!docs/foo/*.md'<br># Exclude multiple:<br>`summary -b -t '!/exc/**' !test/**/.md' '!one/two/*.md`</pre>**Note:** <br>`!`符号使用BASH时可能会造成歧义。应该在它周围使用`'` 或者 `"`。<br>"!" maybe cause ambiguity When using bash. should use `'` or `"` around it.
summary -d | 删除垃圾文件( `./.li.json` 、` ./_summary.md`)。<br>Delete files(`./.li.json` 、` ./_summary.md`)

> 如果是仅安装到项目下，那么命令可能需要添加前置 `node` 命令。全局则不需要（实际上 argv0 依旧是node ）。

### Example( *run as command with terminal* ) 命令示例：

命令行参数中 `-c` 和 `-d`相对直接，我们来说说 `-b` 好了:

```
# 生成_summary.md 文件并缩进(不排除任何文件)。
# The _summary.md file is generated and indented (does not exclude any files).

summary -b -t

# 生成_summary.md并排除掉不需要的文件。
# 说明一下，为了兼顾 `gulp.src([...])` 参数格式，
# 在用命令行操作的时候要排除多个文件夹(文件)用空格隔开,
# "!"符号貌似可能导致bash歧义而报错中断运行，需要用“'”符号或者’“‘符号包裹起来：

# Generate _summary.md and exclude unnecessary files. 
# Explain that in order to take into account the `gulp.src([...])` parameter format, 
# to exclude multiple folders (files) separated by spaces when using command line operations,
# the "!" symbol may appear to cause bash ambiguity. 
# The error interrupted operation needs to be wrapped with the ['] or the ["] :

summary -b '!/exc/**'

# 或者  or

summary -b -t "!/exc/**"

# 排除多个文件/文件夹(不同的文件、文件夹用空格隔开)：
# Exclude multiple files/folders (different files, folders separated by spaces):

summary -b -t '!/exc/**' '!test/**' '!one/two/xx.md'

```
> Note: 如果想只处理某一个文件下的文件，请先 cd 到那个文件夹再使用命令处理，这样可以省去写太多排除文件、文件夹的带来的苦恼。

### 引入`summarybuilder`模块 

#### Example（as a module）

> gulpfile.js:

```js
const sm = require('summarybuilder');
const gulp = require('gulp');
const gulpfl = require('gulp-filelist');

//The gulp task to create files which listed in SUMMARY.md(or another file has same format like SUMMARY.md)

gulp.task('create', function () {
    sm.SBer_createMD("./SUMMARY.md", "By summarybuider");
});

// Create a JSON file to list  all of Markdown files that you wanted to add to SUMMARY.md.

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

//... maybe, need a JSON file is bad idea. we want easier method.
sm.SBer_summaryMDs(['-t','./**/*.md','!Docs/**/*.md','!README.md']);

// '-t' means indent, If you don't want it to be indented. just like this:
sm.SBer_summaryMDs(['./**/*.md','!Docs/**/*.md','!README.md']);
```
----

## API

### 1. SBer_summary() *生成类似SUMMARY.md的文件*。

`SBer_summary( jsonFileName, isIndent, outFileName )`

* `jsonFileName`：type: *string OR Array*——The path of the JSON file.It is better to be created by the plugin: [gulp-filelist](https://www.npmjs.com/package/gulp-filelist). Or like this: 

    ```js
    SBer_summary(["a.md","b/a.md"],true,"mySummary.md")

    // Note: Wildcard paths are not supported and must be a specific array of markdown file paths.
    // 注意： 不支持通配符路径，必须是具体的文章路径数组。
    ```

    JSON格式的列表文件路径 *example*：`allMDlist.json`:（NOTE: 注意保留完整路径，以便读取。）
    
    ```JSON
    [
    "./a/a.md",
    "./b/b.md"
    ]
    ```

* `isIndent`: type: *Boolean* ——Indent? If `true` will be indented.Must `true` or `false`.
【是否缩进？`true` 则缩进，没有默认值，必须定义.】

 * `outFileName`: type: *string*—— example: "a.md",Any you wanted if you sure it can be read.
 定义输出文件的路径。

Example:
 ```js
 const sm = require('summarybuilder');

 const mdFiles = [
     'a.md',
     'b.md',
     'test/x/y/z.md'
 ]

sm.SBer_summary(mdFiles,true,'_summary.md');

// or like this

sm.SBer_summary(['a.md','b.md','test/x/y/z.md'],true,'_sm.md');
 ```

----

### 2. SBer_createMD() *创建对应的markdown文件*。

`SBer_createMD( summaryFilePath )`，基于类似SUMMARY.md的列表创建对应的markdown文件。

* `summaryFilePath`:type: *string*——具有和*SUMMARY.md* 相同内容格式的文件的路径(当然，也可以直接用SUMMARY.md的路径)。

* `arguments[1]`: type: *string*——添加标题以外的内容，可以是Markdown的正文部分(*第一个`#`标记已经存在，如不是必须，最好不要重复加入*)。

    xxx.md
    ```Markdown
    * [TEST](./a/TA)
    ```
    xx.js:
    
    ```js
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

### 3. SBer_summaryMDs(array)

也许简单点会好用点。
easy-to-use

example：
```js
//...
SBer_summaryMDs(['-t','./**/*.md','!Docs/**/*.md','!README.md']);

// '-t' means indent, If you don't want it to be indented. just like this:
SBer_summaryMDs(['./**/*.md','!Docs/**/*.md','!README.md']);
```

## Donate to author

![Donate to author](/static/zs.jpg)
QR code for WeChat

## Licence

[MIT](./LICENSE)