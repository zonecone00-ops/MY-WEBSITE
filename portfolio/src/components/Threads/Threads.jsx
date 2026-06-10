import { useEffect, useRef } from 'react'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

const int u_line_count = 28;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hashX = fract(Pt * (1.0 / 951.135664));
  vec4 hashY = fract(Pt * (1.0 / 642.949883));
  vec4 gradX = hashX - 0.49999;
  vec4 gradY = hashY - 0.49999;
  vec4 grad = inversesqrt(gradX * gradX + gradY * gradY)
    * (gradX * Pf.xzxz + gradY * Pf.yyww);
  grad *= 1.4142135623730950;
  vec2 blend = Pf.xy * Pf.xy * Pf.xy * (Pf.xy * (Pf.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
  return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, vec2 mouse, float time, float amplitude, float distance) {
  float splitPoint = 0.1 + perc * 0.4;
  float amplitudeNormal = smoothstep(splitPoint, 0.7, st.x);
  float finalAmplitude = amplitudeNormal * 0.5 * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);
  float scaledTime = time / 10.0 + (mouse.x - 0.5);
  float blur = smoothstep(splitPoint, splitPoint + 0.05, st.x) * perc;
  float xnoise = mix(
    Perlin2D(vec2(scaledTime, st.x + perc) * 2.5),
    Perlin2D(vec2(scaledTime, st.x + scaledTime) * 3.5) / 1.5,
    st.x * 0.3
  );
  float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;
  float start = smoothstep(y + width / 2.0 + u_line_blur * pixel(1.0, iResolution.xy) * blur, y, st.y);
  float end = smoothstep(y, y - width / 2.0 - u_line_blur * pixel(1.0, iResolution.xy) * blur, st.y);
  return clamp((start - end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))), 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float strength = 1.0;
  for (int i = 0; i < u_line_count; i++) {
    float p = float(i) / float(u_line_count);
    strength *= 1.0 - lineFn(
      uv,
      u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
      p,
      uMouse,
      iTime,
      uAmplitude,
      uDistance
    );
  }
  float colorValue = 1.0 - strength;
  gl_FragColor = vec4(uColor * colorValue, colorValue);
}
`

export default function Threads({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  className = '',
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.1),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    container.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(1, 1, 1) },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const width = Math.max(1, container.clientWidth)
      const height = Math.max(1, container.clientHeight)
      renderer.setSize(width, height)
      program.uniforms.iResolution.value.set(width, height, width / height)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let currentMouse = [0.5, 0.5]
    let targetMouse = [0.5, 0.5]
    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect()
      targetMouse = [
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      ]
    }
    const onMouseLeave = () => {
      targetMouse = [0.5, 0.5]
    }

    if (enableMouseInteraction) {
      container.addEventListener('mousemove', onMouseMove)
      container.addEventListener('mouseleave', onMouseLeave)
    }

    let frame = 0
    let visible = true
    let pageVisible = !document.hidden
    let lastRender = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frameInterval = 1000 / (reduceMotion ? 12 : 30)
    const render = (time) => {
      if (time - lastRender >= frameInterval) {
        currentMouse[0] += 0.08 * (targetMouse[0] - currentMouse[0])
        currentMouse[1] += 0.08 * (targetMouse[1] - currentMouse[1])
        program.uniforms.uMouse.value[0] = currentMouse[0]
        program.uniforms.uMouse.value[1] = currentMouse[1]
        program.uniforms.iTime.value = time * 0.001
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
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? resume() : stop()
    }, { threshold: 0 })
    visibilityObserver.observe(container)
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
    renderer.render({ scene: mesh })
    resume()

    return () => {
      stop()
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', onPageShow)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      gl.canvas.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [color, amplitude, distance, enableMouseInteraction])

  return <div ref={containerRef} className={`threads-container ${className}`.trim()} />
}
