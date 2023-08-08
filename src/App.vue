<template>
  <!-- hover:cursor-pointer -->
  <!-- <div>已选择文件数: {{ selectedFileNum }}</div> -->
  <p class="text-left w-full max-w-6xl mb-3">
    <span class="text-red-500 align-sub">*</span>
    只能上传图片类型的文件 单次只能上传一个文件 且大小限制在 2MB 内
  </p>
  <div class="con " :class="isAbove ? 'on-above' : ''" ref="dragoverRef" @dragover="handle" @drop="handleDrop">
    <!-- {{ isAbove }} -->
    <input accept=".png,.jpg,.jpeg,.webp,.gif" type="file" class="hidden" ref="uploadInputRef"
      @change="handleSelectFileChange">
    <button class="bg-blue-500 rounded-md p-3 text-white" @click="handleClickUpload">选 择 上 传 文 件</button>
  </div>
  <div class="w-full max-w-6xl flex justify-between items-center">
    <div id="imagePreview" class="mt-5" v-hidden="imgValue.length">
      {{ imgValue }}
      <button ref="copyBtnRef" :data-clipboard-text="imgValue"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">复制</button>
    </div>


    <button :disabled="!(selectedFileNum)" :class="selectedFileNum ? 'bg-blue-600' : 'bg-gray-300 cursor-not-allowed'"
      class="mt-5 px-5 py-2 float-right bg-blue-600 border rounded-lg text-white" @click="handleUploadFile">上
      传</button>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue'
import { API_URL, MimeTypes, maxSize } from './config'
import axios from 'axios'
import Clipboard from 'clipboard';

const imgValue = ref<string>('')

const copyBtnRef = ref<HTMLButtonElement | null>(null)

const clipboard = ref()

onMounted(() => {
  if (copyBtnRef.value) {
    clipboard.value = new Clipboard(copyBtnRef.value)
    clipboard.value.on('success', (e: any) => {
      console.log('复制成功');
      alert('复制成功')
      e.clearSelection();
    });
    clipboard.value.on('error', () => {
      console.log('复制失败');
      alert('复制失败')
    });
  }
})


const dragoverRef = ref<HTMLDivElement | null>(null)

const formDatas = ref<FormData>(new FormData())

function isNumber(value: any) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

const selectedFileNum = ref<number>(0)

// 上传文件
const handleUploadFile = async () => {
  try {
    if (!formDatas.value.getAll('file').length) return
    const { data: res } = await axios({
      url: `${API_URL}/upload`,
      method: 'post',
      data: formDatas.value,
    })
    imgValue.value = res
    alert('上传文件成功')
  } catch (e) {
    console.log('e ----->', e)
    alert('上传文件失败')
  }
}

let timer = ref<number | null>()

let isAbove = ref<boolean>(false)

const handle = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation();

  timer.value && clearTimeout(timer.value)
  isAbove.value = true

  timer.value = setTimeout(() => {
    isAbove.value = false
  }, 100)
}

// 获取拖拽的进来的文件
const handleDrop = (event: DragEvent) => {
  // 每次选择新的文件 清空之前选择的 formData 对象
  formDatas.value = new FormData()

  event.preventDefault();

  const files = event.dataTransfer?.files;

  const selectFiles: File[] = []

  for (const key in files) {
    if (isNumber(Number(key))) selectFiles.push(files[Number(key)])
  }
  const isPass = validateSelectFile(selectFiles)
  if (!isPass) return
  console.log('通过 ----->',)
  selectFiles.forEach(file => {
    selectedFileNum.value++
    formDatas.value?.append('file', file)
  })

  // ImgMimeTypes.
  // Object.values()
}

const validateSelectFile = (files: File[]): Boolean => {
  if (!files.length) return false
  return files.every(file => {
    const typeIsPass = MimeTypes.includes(file.type)
    const sizeIsPass = file.size < maxSize
    if (!typeIsPass) alert('选择文件类型有误!')
    if (!sizeIsPass) alert('选择文件过大 请限制在 2Mb 内!')
    return (typeIsPass && sizeIsPass)
  })
}

const uploadInputRef = ref<HTMLInputElement | null>()

// 点击上传按钮
const handleClickUpload = () => {
  uploadInputRef.value?.click()
}

// 处理选中文件
const handleSelectFileChange = (e: Event) => {
  // 每次选择新的文件 清空之前选择的 formData 对象
  formDatas.value = new FormData()
  const target = e.target as HTMLInputElement
  if (!target.files?.length) return
  // 选中的为单个文件
  const isPass = validateSelectFile([...target.files])
  if (!isPass) return
  console.log('通过 ----->',)
  for (let i = 0; i < target.files.length; i++) {
    selectedFileNum.value++
    formDatas.value?.append('file', target.files[i])
  }
}

onUnmounted(() => {
  clipboard.value.destroy()
})

</script>

<style scoped lang='less'>
.con {
  @apply w-full h-5/6 max-w-6xl max-h-96;
  @apply flex justify-center items-center;
  // @apply bg-blue-500 text-white p-4;
  @apply border border-dashed border-gray-400 rounded-lg;
}

.con:hover {
  border-color: rgb(85, 85, 199);
}


.on-above {
  @apply border-4;
  @apply bg-gray-400 bg-opacity-10;
}



// .bgc {
//   width: 90%;
//   background: red;
// }
</style>