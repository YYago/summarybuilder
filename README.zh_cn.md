# 目录生成器

主要应用于`gitbook`以及类似于它一样有`SUMMARY.md`的项目插件的小工具(目前只支持`.md`类型)，就两个用途：

1. 基于现有的 `SUMMARY.md` 中已列出的文件清单，批量创建它们（`已经存在的文件会忽略掉`）;

2. 基于现有的`.md`文件创建`SUMMARY.md`清单。
    > 不会直接重写SUMMARY.md文件，会生成一个：`_summary.md`的文件到项目根目录下，需要手动调整顺序再复制并粘贴到你的项目的`SUMMARY.md`文件中。

3. 事实上，它可以用于存在 `.md` 文件的任何目录。也可以引入`summarybuilder`模块到项目的自定义任务(gulp Task)中使用。

注意：

* 已经默认排除的文件和文件夹(*仅作为命令运行时，模块引入时并没有排除任何文件*) 
    ```JSON
    [
        '!SUMMARY.md', 
        '!node_modules/**', 
        '!_summary.md'
    ]
    ```
* **在使用 git 进行add操作之前请删掉插件生成的文件或者将其写进`.gitignore`中排除。**
    ```
    # tmp files
    _summary.md
    .li.json
    ```

## 新版本

#### V1.4.5

* 修复在`SUMMARY.md`文件中因存在类似`* [example(new)](docs/example.md)`条目在创建时会变成`new]docs/example.md`的情形。

>**注意**：这个 BUG 虽基本修复但并不是完全能避免其触发，当出现这样的情形时还是会触发：`* [hello[the](world)](htw.md)`，即便这种写法不能被正常的渲染出来（渲染结果不是：`hello[the](world)`，我们把它看作 Markdown 语法错误好了），但若存在依旧会被强行渲染（并不会因为“错误”而终止，它依旧有效，哪怕不是我们想要的）。因此，你不应该在 `SUMMARY.md` 文件目录清单中以及其他 ".md" 文件的标题中使用这种会引发冲突的写法。

#### v 1.4.4

* 使用严格模式

#### V 1.4.3 ：

* 已经存在于 `SUMMARY.md` 的条目将不会再在  `_summary.md` 文件中出现。省去重复手动调整顺序的麻烦。
* 修正标题出现多余前缀空格的问题。

## 安装

* 安装到你的项目中。

    `npm install --save summarybuilder`

* 全局安装

    `npm install -g summarybuilder`  推荐

## 使用

命令| 说明
-------------|-----------------
summary -c | 创建SUMMARY.md里列出的文件，已存在的文件会跳过。
summary -b | 生成_summary.md 文件。
summary -b -t | 在创建_summary.md 中使用缩进。ps:这会让层次清晰些（默认按文件夹结构缩进）。
summary  -b  -t [ignores] | `[ignore]`排除掉一些你不想添加到_summary.md 中的文件并且使用缩进。example：<br><pre>summary -b -t '!docs/foo/*.md'<br># Exclude multiple:<br>`summary -b -t '!/exc/**' !test/**/.md' '!one/two/*.md`</pre>**Note:** <br>`!`符号在使用BASH时可能会造成歧义。应该在参数周围使用`'` 或者 `"`。
summary -d | 删除垃圾文件( `./.li.json` 、` ./_summary.md`)。

### 1. Example( *作为命令在终端使用* ) 命令示例：

命令行参数中 `-c` 和 `-d`相对直接，我们来说说 `-b` 好了:

```
# 生成_summary.md 文件并缩进(不排除任何文件)。

summary -b -t

# 生成_summary.md并排除掉不需要的文件。
# 说明一下，为了兼顾 `gulp.src([...])` 参数格式，
# 在用命令行操作的时候要排除多个文件夹(文件)用空格隔开,
# "!"符号貌似可能导致bash歧义而报错中断运行，需要用“'”符号或者’“‘符号包裹起来：

summary -b '!/exc/**'

# 或者

summary -b -t "!/exc/**"

# 排除多个文件/文件夹(不同的文件、文件夹用空格隔开)：

summary -b -t '!/exc/**' '!test/**' '!one/two/xx.md'

```
> Tips: 如果想只处理某一个文件下的文件，请先 cd 到那个文件夹再使用命令处理，这样可以省去写太多排除文件、文件夹的带来的苦恼。

## 2. 在自己的项目中引入`summarybuilder`模块

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
        sm.SBer_summary('./test/list.json', false, 'sm.txt'); // The contens of sm.txt is same as SUMMARY.md
    });
});

// ---------- v1.4.2 -------------------
// maybe, need a JSON file is bad idea. we need easier method.
sm.SBer_summaryMDs(['-t','./**/*.md','!Docs/**/*.md','!README.md']);

// '-t' means indent, If you don't want it to be indented. just like this:
sm.SBer_summaryMDs(['./**/*.md','!Docs/**/*.md','!README.md']);

// maybe you need gulp task.
gulp.task('summary',()=>{
    sm.SBer_summaryMDs(['-t','./**/*.md','!Docs/**/*.md','!README.md']);
    console.log('Task: summary done');
});

// The files '_summary.md' and '.li.json' wuld be created after you run the task.
```
----

## API

### 1. SBer_summary() *生成类似SUMMARY.md的文件*。

`SBer_summary( jsonFileName, isIndent, outFileName )`

* `jsonFileName`：type: *string OR Array*——The path of the JSON file. It is better to be created by the plugin: [gulp-filelist](https://www.npmjs.com/package/gulp-filelist). Or like this: 

    ```js
    SBer_summary(["a.md","b/a.md"],true,"mySummary.md")

    // 注意： 不支持通配符路径，必须是具体的文章路径数组。
    ```

    JSON格式的列表文件路径 *example*：`allMDlist.json`:（NOTE: 注意保留完整路径，以便读取。）
    
    ```JSON
    [
    "./a/a.md",
    "./b/b.md"
    ]
    ```

* `isIndent`: type: *Boolean* ——是否缩进？`true` 则缩进，没有默认值，必须定义。

 * `outFileName`: type: *string*—— 定义输出文件的路径。

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

`SBer_createMD( summaryFilePath )`，基于类似 `SUMMARY.md` 的列表创建对应的markdown文件。

* `summaryFilePath`:type: *string*——具有和 `SUMMARY.md` 相同内容格式的文件的路径(当然，也可以直接用SUMMARY.md的路径)。

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
----

### 3. SBer_summaryMDs(array)

也许简单点会好用点。

**Note: 确保所给的值不会触发“Missing positive glob” ，即确保有文件能被匹配到并进入pipe()流。否则会报错并退出进程。**

example：
```js
//...
SBer_summaryMDs(['-t','./**/*.md','!Docs/**/*.md','!README.md']);

// '-t' means indent, If you don't want it to be indented. just like this:
SBer_summaryMDs(['./**/*.md','!Docs/**/*.md','!README.md']);

// You can use it like this:
SBer_summaryMDs(['-t']);

// But like this will report error:
//     以下两种写法都会报错：
//          使用了gulp.src()的原因，gulp.src(['!README.md']) 并不能匹配到任何文件。
// 因此，必须保证所给的参数能匹配到你想要的文件。

SBer_summaryMDs(['!README.md']);
// or 
SBer_summaryMDs(['-t','!README.md']);
```

### `SBer_summaryMDs(array)`与 `SBer_summary( jsonFileName, isIndent, outFileName )`的区别：

The difference between `SBer_summaryMDs(array)` and `SBer_summary( jsonFileName, isIndent, outFileName )`:

* SBer_summaryMDs(array) 支持通配符路径而  SBer_summary()不支持。
* SBer_summaryMDs(array) 可以免去使用`gulp-filelist`模块生成JSON文件的麻烦。

## Donate to author

很多时候我们会把简单的事情做得非常复杂，希望它适合你！

![Donate to author](/static/zs.jpg)

## Licence

[MIT](./LICENSE)