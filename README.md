# hawkeye [![Build Status](https://travis-ci.org/stormqx/hawkeye.svg?branch=master)](https://travis-ci.org/stormqx/hawkeye)

🦉👀Run scripts on git diff files

## About
[npm依赖管理那些事](https://github.com/stormqx/front-end-learning/issues/7)一文中描述了npm依赖管理方案的最佳实践。其中聊到了：

> 任何时候有人提交了 package.json, package-lock.json 更新后，团队其他成员应在 git pull 拉取更新后执行 npm install 脚本安装更新后的依赖包。

hawkeye的设计意图就是将这步操作自动化：通过比较git头来获取git diff files(`git diff-tree -r --name-only --no-commit-id HEAD@{1} HEAD`)，尝试匹配配置文件中声明的文件和命令。
实现方式参考了[lint-staged](https://github.com/okonet/lint-staged)。

## Installation

```
npm install --save-dev hawkeye
```

```
// package.json
{
  "hawkeye": {
    "package.json": "npm install"
  }
}
{
  "husky": {
    "hooks": {
      "post-merge": "hawkeye"
    }
  }
}
```

hawkeye一般和[husky](https://github.com/typicode/husky)配合着使用，借助husky改造git钩子的能力，允许你在不同的时机做你想做的事情。所以请保证`package.json`的依赖中安装(`npm install --save-dev`)了hawkeye和[husky](https://github.com/typicode/husky)。

## Command line flags

```
$ npx hawkeye --help
Usage: hawkeye [options]

Options:
  -V, --version  output the version number
  -d, --debug    Enable debug mode
  -h, --help     output usage information
```

## Configuration
hawkeye支持多种方式编辑配置文件：

* `hawkeye` object in your package.json
* `.hawkeyerc` file in JSON/JS/YML format
* `hawkeye.config.js` file in JS format

关于format的更多细节可以查看[cosmiconfig](https://github.com/davidtheclark/cosmiconfig)。

配置文件为Object形式，其中key为用于匹配文件的glob pattern，value为匹配成功后执行的命令。hawkeye使用[micromatch](https://github.com/micromatch/micromatch)匹配glob pattern。

`.hawkeyerc.json`配置例子：

```
{
  "package.json": "your-cmd"
}
```

## flow chart
![hawkeye](https://user-images.githubusercontent.com/10650818/60398579-a061c700-9b8c-11e9-8b41-03089d17566f.jpg)

## Changelog

## TODO

- [✓] debug mode
- [ ] unit test
- [✓] travis.ci
- [ ] codecov
- [ ] changelog
- [✓] npm publish
- [ ] TypeScript
- [ ] validating config
- [ ] windows support

## License

MIT
