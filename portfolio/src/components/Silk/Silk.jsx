import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

float noise(vec2 texCoord) {
  float e = 2.71828182845904523536;
  vec2 r = e * sin(e * texCoord);
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float timeOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - timeOffset);

  float pattern = 0.6 +
    0.4 * sin(
      5.0 * (
        tex.x + tex.y +
        cos(3.0 * tex.x + 5.0 * tex.y) +
        0.02 * timeOffset
      ) +
      sin(20.0 * (tex.x + tex.y - 0.1 * timeOffset))
    );

  vec3 color = uColor * pattern - vec3(rnd / 15.0 * uNoiseIntensity);
  gl_FragColor = vec4(color, 1.0);
}
`

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1),
    })
    const gl = renderer.gl
    const canvas = gl.canvas
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uNoiseIntensity: { value: noiseIntensity },
        uColor: { value: new Float32Array(hexToRgb(color)) },
        uRotation: { value: rotation },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      renderer.setSize(
        Math.max(1, container.clientWidth),
        Math.max(1, container.clientHeight),
      )
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let frame = 0
    let visible = true
    let pageVisible = !document.hidden
    let lastRender = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frameInterval = 1000 / (reduceMotion ? 12 : 24)
    const start = performance.now()

    const render = (time) => {
      if (time - lastRender >= frameInterval) {
        program.uniforms.uTime.value = (time - start) * 0.0001
        renderer.render({ scene: mesh })
        lastRender = time
      }
      frame = requestAnimationFrame(render)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const resume = () => {
      if (visible && pageVisible && !frame) {
        frame = requestAnimationFrame(render)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? resume() : stop()
    }, { threshold: 0 })

    const onVisibilityChange = () => {
      pageVisible = !document.hidden
      pageVisible ? resume() : stop()
    }
    const onPageShow = () => {
      pageVisible = true
      resize()
      resume()
    }

    observer.observe(container)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pageshow', onPageShow)
    renderer.render({ scene: mesh })
    resume()

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', onPageShow)
      canvas.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [speed, scale, color, noiseIntensity, rotation])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
