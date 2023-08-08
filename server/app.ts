import express, { Request, Response, } from "express";
import { HOST_NAME, MimeTypes, PATH, PORT, maxSize } from "./config";
import cors from 'cors'
import fileType from 'file-type'
import multer from 'multer'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs'

const app = express()

declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

// 磁盘存储引擎
const diskStorage = multer.diskStorage({
  // 保存目录
  destination(req: Request, file: any, cb: any) {
    const d = new Date()
    const YYYY = d.getFullYear() + ''
    const MM = (d.getMonth() + 1) + ''
    const DD = d.getDate() + ''

    const filePath = path.join(`${YYYY}-${MM}`, DD)
    // 根据日期动态创建 多级目录
    const savePath = path.join(`${PATH}`, filePath)

    if (!fs.existsSync(savePath)) {
      try {
        fs.mkdirSync(savePath, { recursive: true })
        cb(null, savePath);
      } catch (e) {
        console.log('目录创建失败 ----->',)
        cb(null, PATH);
      }
    } else {
      cb(null, savePath);
    }

  },
  // 文件名称
  filename: function (req: Request, file: any, cb: any) {
    cb(null, nanoid(10) + path.extname(file.originalname));
  },
});

const upload = multer({
  dest: PATH,
  storage: diskStorage,
  limits: {
    fileSize: maxSize,
    files: 1
  }
})


app.use('/static', express.static(PATH))
app.use(cors())

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req?.file) return res.send('文件不能为空')
  if (!MimeTypes.includes(req.file.mimetype)) return res.send('上传文件类型有误')
  // 获取文件相对路径
  const relativePath = path.relative(PATH, req.file.path).replace(/\\/g, '/')

  res.send(HOST_NAME + '/static' + '/' + relativePath)
})

app.listen(PORT, () => {
  console.log('服务运行在 ----->',`${HOST_NAME}`)
})