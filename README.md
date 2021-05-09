# Kikoeru

练习日语数字听力

> Voiced by https://CoeFont.studio

## How to build

本程序使用 go embed 打包为单个二进制可执行文件，所以需要 go 版本 > 1.16

先到 webapp 目录下构建 WebUI

```bash
cd webapp
npm install
npm run build
```

然后构建 go 程序

```bash
go build -ldflags "-w -s" kikoeru/cmd
```
