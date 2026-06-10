import { useEffect, useRef } from 'react'

export default function ShapeGrid({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  shape = 'square',
  hoverTrailAmount = 0,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const offset = { x: 0, y: 0 }
    let hoveredCell = null
    let trail = []
    const opacities = new Map()
    let animationFrame = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.max(1, Math.floor(canvas.offsetWidth * ratio))
      canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const drawShape = (x, y, size, flip = false) => {
      context.beginPath()

      if (shape === 'circle') {
        context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
      } else if (shape === 'triangle') {
        if (flip) {
          context.moveTo(x + size / 2, y + size)
          context.lineTo(x + size, y)
          context.lineTo(x, y)
        } else {
          context.moveTo(x + size / 2, y)
          context.lineTo(x + size, y + size)
          context.lineTo(x, y + size)
        }
        context.closePath()
      } else if (shape === 'hexagon') {
        const centerX = x + size / 2
        const centerY = y + size / 2
        for (let index = 0; index < 6; index += 1) {
          const angle = (Math.PI / 3) * index
          const pointX = centerX + (size / 2) * Math.cos(angle)
          const pointY = centerY + (size / 2) * Math.sin(angle)
          if (index === 0) context.moveTo(pointX, pointY)
          else context.lineTo(pointX, pointY)
        }
        context.closePath()
      } else {
        context.rect(x, y, size, size)
      }
    }

    const updateOpacities = () => {
      const targets = new Map()
      if (hoveredCell) targets.set(`${hoveredCell.x},${hoveredCell.y}`, 1)
      trail.forEach((cell, index) => {
        targets.set(`${cell.x},${cell.y}`, (trail.length - index) / (trail.length + 1))
      })

      targets.forEach((_, key) => {
        if (!opacities.has(key)) opacities.set(key, 0)
      })

      opacities.forEach((opacity, key) => {
        const next = opacity + ((targets.get(key) || 0) - opacity) * 0.15
        if (next < 0.005) opacities.delete(key)
        else opacities.set(key, next)
      })
    }

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      context.clearRect(0, 0, width, height)

      const offsetX = ((offset.x % squareSize) + squareSize) % squareSize
      const offsetY = ((offset.y % squareSize) + squareSize) % squareSize
      const columns = Math.ceil(width / squareSize) + 3
      const rows = Math.ceil(height / squareSize) + 3

      for (let column = -2; column < columns; column += 1) {
        for (let row = -2; row < rows; row += 1) {
          const x = column * squareSize + offsetX
          const y = row * squareSize + offsetY
          const opacity = opacities.get(`${column},${row}`)

          if (opacity) {
            context.globalAlpha = opacity
            drawShape(x, y, squareSize, (column + row) % 2 !== 0)
            context.fillStyle = hoverFillColor
            context.fill()
            context.globalAlpha = 1
          }

          drawShape(x, y, squareSize, (column + row) % 2 !== 0)
          context.strokeStyle = borderColor
          context.lineWidth = 1
          context.stroke()
        }
      }
    }

    let visible = true
    let pageVisible = !document.hidden
    let lastRender = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frameInterval = 1000 / (reduceMotion ? 12 : 30)

    const animate = (time) => {
      if (time - lastRender >= frameInterval) {
        const step = Math.max(speed, 0.1) * 2
        if (direction === 'right' || direction === 'diagonal') offset.x -= step
        if (direction === 'left') offset.x += step
        if (direction === 'up' || direction === 'diagonal') offset.y += step
        if (direction === 'down') offset.y -= step
        updateOpacities()
        draw()
        lastRender = time
      }
      animationFrame = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const resume = () => {
      if (visible && pageVisible && !animationFrame) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const setHoveredCell = (event) => {
      const rect = canvas.getBoundingClientRect()
      const offsetX = ((offset.x % squareSize) + squareSize) % squareSize
      const offsetY = ((offset.y % squareSize) + squareSize) % squareSize
      const next = {
        x: Math.floor((event.clientX - rect.left - offsetX) / squareSize),
        y: Math.floor((event.clientY - rect.top - offsetY) / squareSize),
      }

      if (!hoveredCell || hoveredCell.x !== next.x || hoveredCell.y !== next.y) {
        if (hoveredCell && hoverTrailAmount > 0) {
          trail = [hoveredCell, ...trail].slice(0, hoverTrailAmount)
        }
        hoveredCell = next
      }
    }

    const clearHoveredCell = () => {
      if (hoveredCell && hoverTrailAmount > 0) {
        trail = [hoveredCell, ...trail].slice(0, hoverTrailAmount)
      }
      hoveredCell = null
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? resume() : stop()
    }, { threshold: 0 })
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    canvas.addEventListener('mousemove', setHoveredCell)
    canvas.addEventListener('mouseleave', clearHoveredCell)
    const onVisibilityChange = () => {
      pageVisible = !document.hidden
      pageVisible ? resume() : stop()
    }
    const onPageShow = () => {
      pageVisible = true
      resize()
      resume()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pageshow', onPageShow)
    resize()
    draw()
    resume()

    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', onPageShow)
      canvas.removeEventListener('mousemove', setHoveredCell)
      canvas.removeEventListener('mouseleave', clearHoveredCell)
    }
  }, [direction, speed, borderColor, squareSize, hoverFillColor, shape, hoverTrailAmount])

  return <canvas ref={canvasRef} className={`shapegrid-canvas ${className}`.trim()} />
}
