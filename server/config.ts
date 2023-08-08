import { normalize } from 'path'

export const PORT = 3001

export const HOST_NAME = process.env.NODE_ENV === 'production' ? 'https://api.peng1203.cn' : 'http://127.0.0.1:' + PORT


export const PATH = process.env.NODE_ENV === 'production' ? '/var/upload' : normalize('C:\\练习时长30个月\\upload')

export const MimeTypes = [
  'image/jpeg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/svg+xml',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
]

// 上传文件大小 4兆
export const maxSize = 1024 * 1024 * 4