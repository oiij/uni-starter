export type PosterText = {
  type: 'text'
  x: number
  y: number
  text: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: number
  lineHeight?: number
}

export type PosterImage = {
  type: 'image'
  x: number
  y: number
  width: number
  height: number
  url: string
  borderRadius?: number
}

export type PosterRect = {
  type: 'rect'
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  borderRadius?: number
}

export type PosterLine = {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  stroke?: string
  strokeWidth?: number
}

export type PosterRoundRect = {
  type: 'roundRect'
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  radius?: number
}

export type PosterElement = PosterText | PosterImage | PosterRect | PosterLine | PosterRoundRect

export type PosterSchema = {
  width: number
  height: number
  backgroundColor?: string
  elements: PosterElement[]
}

type PosterCanvasCtx = {
  fillStyle: string
  strokeStyle: string
  lineWidth: number
  font: string
  textAlign: CanvasTextAlign
  textBaseline: CanvasTextBaseline
  fillRect: (x: number, y: number, w: number, h: number) => void
  strokeRect: (x: number, y: number, w: number, h: number) => void
  fillText: (text: string, x: number, y: number, maxWidth?: number) => void
  measureText: (text: string) => TextMetrics
  beginPath: () => void
  closePath: () => void
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
  arcTo: (x1: number, y1: number, x2: number, y2: number, radius: number) => void
  fill: () => void
  stroke: () => void
  save: () => void
  restore: () => void
  clip: () => void
  drawImage: (image: any, x: number, y: number, w: number, h: number) => void
}
type Options = {
  manual?: boolean
}
export function usePosterGenerate(schema?: PosterSchema, options?: Options) {
  const { manual = false } = options ?? {}
  const loading = ref(false)
  const tempFilePath = ref<string>()
  /* ---- helpers ---- */

  function roundRectPath(ctx: PosterCanvasCtx, x: number, y: number, w: number, h: number, r: number) {
    r = Math.min(r, w / 2, h / 2, 999)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  }

  function drawText(ctx: PosterCanvasCtx, el: PosterText) {
    ctx.font = `${el.fontWeight ?? ''} ${el.fontSize || 14}px sans-serif`.trimStart()
    ctx.fillStyle = el.color || '#333'
    ctx.textAlign = el.textAlign || 'left'
    ctx.textBaseline = 'top'

    const text = String(el.text)
    const fontSize = el.fontSize || 14
    const lineHeight = el.lineHeight || Math.round(fontSize * 1.4)
    const maxWidth = el.maxWidth || 0

    const lines: string[] = []
    for (const paragraph of text.split('\n')) {
      if (maxWidth > 0) {
        let currentLine = ''
        for (const char of paragraph) {
          const testLine = currentLine + char
          if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine)
            currentLine = char
          }
          else {
            currentLine = testLine
          }
        }
        if (currentLine)
          lines.push(currentLine)
      }
      else {
        if (paragraph)
          lines.push(paragraph)
      }
    }

    lines.forEach((line, i) => {
      ctx.fillText(line, el.x, el.y + i * lineHeight)
    })
  }

  function drawRect(ctx: PosterCanvasCtx, el: PosterRect) {
    ctx.save()
    if (el.borderRadius && el.borderRadius > 0) {
      roundRectPath(ctx, el.x, el.y, el.width, el.height, el.borderRadius)
      if (el.fill) {
        ctx.fillStyle = el.fill
        ctx.fill()
      }
      if (el.stroke) {
        ctx.strokeStyle = el.stroke
        ctx.lineWidth = el.strokeWidth || 1
        ctx.stroke()
      }
    }
    else {
      if (el.fill) {
        ctx.fillStyle = el.fill
        ctx.fillRect(el.x, el.y, el.width, el.height)
      }
      if (el.stroke) {
        ctx.strokeStyle = el.stroke
        ctx.lineWidth = el.strokeWidth || 1
        ctx.strokeRect(el.x, el.y, el.width, el.height)
      }
    }
    ctx.restore()
  }

  function drawLine(ctx: PosterCanvasCtx, el: PosterLine) {
    ctx.beginPath()
    ctx.strokeStyle = el.stroke || '#333'
    ctx.lineWidth = el.strokeWidth || 1
    ctx.moveTo(el.x1, el.y1)
    ctx.lineTo(el.x2, el.y2)
    ctx.stroke()
  }

  function drawRoundRect(ctx: PosterCanvasCtx, el: PosterRoundRect) {
    ctx.save()
    roundRectPath(ctx, el.x, el.y, el.width, el.height, el.radius || 0)
    if (el.fill) {
      ctx.fillStyle = el.fill
      ctx.fill()
    }
    if (el.stroke) {
      ctx.strokeStyle = el.stroke
      ctx.lineWidth = el.strokeWidth || 1
      ctx.stroke()
    }
    ctx.restore()
  }

  async function drawImageElement(ctx: PosterCanvasCtx, el: PosterImage, canvas: any) {
    try {
      const info = await uni.getImageInfo({ src: el.url })
      const source = await new Promise<any>((resolve, reject) => {
        const img = canvas.createImage()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`Failed to load image: ${el.url}`))
        img.src = info.path
      })
      ctx.save()
      if (el.borderRadius && el.borderRadius > 0) {
        roundRectPath(ctx, el.x, el.y, el.width, el.height, el.borderRadius)
        ctx.clip()
      }
      ctx.drawImage(source, el.x, el.y, el.width, el.height)
      ctx.restore()
    }
    catch {}
  }

  async function generate(schema: PosterSchema) {
    loading.value = true
    try {
      const canvas: any = uni.createOffscreenCanvas({ type: '2d', width: schema.width, height: schema.height })
      const ctx = canvas.getContext('2d')!

      if (schema.backgroundColor) {
        ctx.fillStyle = schema.backgroundColor
        ctx.fillRect(0, 0, schema.width, schema.height)
      }

      for (const el of schema.elements) {
        switch (el.type) {
          case 'text':
            drawText(ctx as any, el)
            break
          case 'image':
            await drawImageElement(ctx as any, el, canvas)
            break
          case 'rect':
            drawRect(ctx as any, el)
            break
          case 'line':
            drawLine(ctx as any, el)
            break
          case 'roundRect':
            drawRoundRect(ctx as any, el)
            break
        }
      }

      const tempRes = await uni.canvasToTempFilePath({ canvas, canvasId: '', fileType: 'png' })
      tempFilePath.value = tempRes.tempFilePath
      return tempRes.tempFilePath
    }
    finally {
      loading.value = false
    }
  }
  if (!manual && schema) {
    generate(schema)
  }
  return { generate, loading, tempFilePath }
}
