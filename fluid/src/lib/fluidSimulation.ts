import { FluidConfig } from '../types';

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface Pointer {
  id: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  dx: number;
  dy: number;
  down: boolean;
  moved: boolean;
  color: ColorRGB;
}

function hsvToRgb(h: number, s: number, v: number): ColorRGB {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r, g, b };
}

function hexToRgb(hex: string): ColorRGB {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return { r, g, b };
}

class Program {
  program: WebGLProgram | null = null;
  uniforms: Record<string, WebGLUniformLocation> = {};

  constructor(private gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.bindAttribLocation(prog, 0, 'aPosition');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    this.program = prog;
    const numUniforms = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(prog, i);
      if (info) {
        const loc = gl.getUniformLocation(prog, info.name);
        if (loc) this.uniforms[info.name] = loc;
      }
    }
  }

  bind() {
    if (this.program) this.gl.useProgram(this.program);
  }
}

class DisplayMaterial {
  programs: Record<string, WebGLProgram> = {};
  activeProgram: WebGLProgram | null = null;
  uniforms: Record<string, WebGLUniformLocation> = {};

  constructor(
    private gl: WebGLRenderingContext | WebGL2RenderingContext,
    private vertexShader: WebGLShader,
    private fragmentShaderSource: string,
    private compileShaderFn: (type: number, src: string, defs?: string[]) => WebGLShader
  ) {}

  setKeywords(keywords: string[]) {
    const key = keywords.sort().join('|');
    if (!this.programs[key]) {
      const frag = this.compileShaderFn(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
      const prog = this.gl.createProgram();
      if (prog) {
        this.gl.attachShader(prog, this.vertexShader);
        this.gl.attachShader(prog, frag);
        this.gl.bindAttribLocation(prog, 0, 'aPosition');
        this.gl.linkProgram(prog);
        if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
          console.error(this.gl.getProgramInfoLog(prog));
        } else {
          this.programs[key] = prog;
        }
      }
    }
    const prog = this.programs[key];
    if (prog && prog !== this.activeProgram) {
      this.activeProgram = prog;
      this.uniforms = {};
      const numUniforms = this.gl.getProgramParameter(prog, this.gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < numUniforms; i++) {
        const info = this.gl.getActiveUniform(prog, i);
        if (info) {
          const loc = this.gl.getUniformLocation(prog, info.name);
          if (loc) this.uniforms[info.name] = loc;
        }
      }
    }
  }

  bind() {
    if (this.activeProgram) this.gl.useProgram(this.activeProgram);
  }
}

export class FluidSimulation {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private isWebGL2: boolean = false;
  private ext: {
    formatRGBA: { internalFormat: number; format: number };
    formatRG: { internalFormat: number; format: number };
    formatR: { internalFormat: number; format: number };
    halfFloatTexType: number;
    supportLinearFiltering: boolean;
  };

  private densityFBO!: DoubleFBO;
  private velocityFBO!: DoubleFBO;
  private divergenceFBO!: FBO;
  private curlFBO!: FBO;
  private pressureFBO!: DoubleFBO;

  private clearProgram!: Program;
  private splatProgram!: Program;
  private advectionProgram!: Program;
  private divergenceProgram!: Program;
  private curlProgram!: Program;
  private vorticityProgram!: Program;
  private pressureProgram!: Program;
  private gradSubtractProgram!: Program;
  private displayMaterial!: DisplayMaterial;

  private pointers: Pointer[] = [];
  private colorUpdateTimer: number = 0;
  private ambientTimer: number = 0;
  private isDestroyed: boolean = false;
  private animationFrameId: number | null = null;
  private lastUpdateTime: number = Date.now();

  constructor(
    private canvas: HTMLCanvasElement,
    public config: FluidConfig
  ) {
    const glParams = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    const ctx = (canvas.getContext('webgl2', glParams) ||
      canvas.getContext('webgl', glParams) ||
      canvas.getContext('experimental-webgl', glParams)) as (WebGLRenderingContext | WebGL2RenderingContext) | null;

    if (!ctx) {
      throw new Error('WebGL is not supported in this browser.');
    }
    this.gl = ctx;
    this.isWebGL2 = 'drawBuffers' in ctx;

    let halfFloatTexType = 0;
    let supportLinearFiltering = false;

    if (this.isWebGL2) {
      const gl2 = ctx as WebGL2RenderingContext;
      gl2.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = !!gl2.getExtension('OES_texture_float_linear');
      halfFloatTexType = gl2.HALF_FLOAT;
    } else {
      const halfFloatExt = ctx.getExtension('OES_texture_half_float');
      supportLinearFiltering = !!ctx.getExtension('OES_texture_half_float_linear');
      halfFloatTexType = (halfFloatExt && (halfFloatExt as any).HALF_FLOAT_OES) || 0;
    }

    this.ext = this.initFormats(halfFloatTexType, supportLinearFiltering);
    this.initShaders();
    this.initFramebuffers();
    this.initPointers();
    this.bindEvents();
    this.startLoop();
  }

  private initFormats(halfFloatTexType: number, supportLinearFiltering: boolean) {
    const gl = this.gl;

    const checkFormatSupport = (internalFormat: number, format: number, type: number): boolean => {
      try {
        const texture = gl.createTexture();
        if (!texture) return false;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

        const fbo = gl.createFramebuffer();
        if (!fbo) {
          gl.deleteTexture(texture);
          return false;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(fbo);
        return status === gl.FRAMEBUFFER_COMPLETE;
      } catch {
        return false;
      }
    };

    let formatRGBA: { internalFormat: number; format: number };
    let formatRG: { internalFormat: number; format: number };
    let formatR: { internalFormat: number; format: number };

    if (this.isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      if (halfFloatTexType && checkFormatSupport(gl2.RGBA16F, gl2.RGBA, halfFloatTexType)) {
        formatRGBA = { internalFormat: gl2.RGBA16F, format: gl2.RGBA };
        formatRG = checkFormatSupport(gl2.RG16F, gl2.RG, halfFloatTexType)
          ? { internalFormat: gl2.RG16F, format: gl2.RG }
          : formatRGBA;
        formatR = checkFormatSupport(gl2.R16F, gl2.RED, halfFloatTexType)
          ? { internalFormat: gl2.R16F, format: gl2.RED }
          : formatRGBA;
      } else {
        // Fallback to RGBA8 unsigned byte
        halfFloatTexType = gl.UNSIGNED_BYTE;
        formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
      }
    } else {
      if (halfFloatTexType && checkFormatSupport(gl.RGBA, gl.RGBA, halfFloatTexType)) {
        formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
      } else {
        halfFloatTexType = gl.UNSIGNED_BYTE;
        formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
      }
    }

    return {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    };
  }

  private compileShader(type: number, source: string, keywords?: string[]): WebGLShader {
    const gl = this.gl;
    let fullSource = '';
    if (keywords && keywords.length > 0) {
      for (const kw of keywords) {
        fullSource += `#define ${kw}\n`;
      }
    }
    fullSource += source;
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    gl.shaderSource(shader, fullSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  private initShaders() {
    const gl = this.gl;

    const baseVertexShaderSource = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const clearShaderSource = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `;

    const splatShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `;

    const divergenceShaderSource = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShaderSource = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const pressureShaderSource = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShaderSource = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

    const vertShader = this.compileShader(gl.VERTEX_SHADER, baseVertexShaderSource);

    this.clearProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, clearShaderSource));
    this.splatProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, splatShaderSource));
    this.advectionProgram = new Program(
      gl,
      vertShader,
      this.compileShader(
        gl.FRAGMENT_SHADER,
        advectionShaderSource,
        this.ext.supportLinearFiltering ? [] : ['MANUAL_FILTERING']
      )
    );
    this.divergenceProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource));
    this.curlProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, curlShaderSource));
    this.vorticityProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource));
    this.pressureProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, pressureShaderSource));
    this.gradSubtractProgram = new Program(gl, vertShader, this.compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource));

    this.displayMaterial = new DisplayMaterial(
      gl,
      vertShader,
      displayShaderSource,
      (type, src, defs) => this.compileShader(type, src, defs)
    );

    // Quad geometry
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
  }

  private deleteFBO(fbo?: FBO | null) {
    if (!fbo) return;
    try {
      this.gl.deleteTexture(fbo.texture);
      this.gl.deleteFramebuffer(fbo.fbo);
    } catch (e) {
      console.warn('Error deleting FBO:', e);
    }
  }

  private deleteDoubleFBO(dfbo?: DoubleFBO | null) {
    if (!dfbo) return;
    this.deleteFBO(dfbo.read);
    this.deleteFBO(dfbo.write);
  }

  private createFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): FBO {
    const gl = this.gl;
    const safeW = Math.max(Math.floor(w), 1);
    const safeH = Math.max(Math.floor(h), 1);

    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    if (!texture) throw new Error('Failed to create texture');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, safeW, safeH, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    if (!fbo) throw new Error('Failed to create FBO');
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, safeW, safeH);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: safeW,
      height: safeH,
      texelSizeX: 1.0 / safeW,
      texelSizeY: 1.0 / safeH,
      attach: (id: number) => {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  private createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): DoubleFBO {
    let fbo1 = this.createFBO(w, h, internalFormat, format, type, filter);
    let fbo2 = this.createFBO(w, h, internalFormat, format, type, filter);

    return {
      width: fbo1.width,
      height: fbo1.height,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  private getResolution(res: number) {
    let w = Math.max(this.gl.drawingBufferWidth || this.canvas.width || 1, 1);
    let h = Math.max(this.gl.drawingBufferHeight || this.canvas.height || 1, 1);
    let aspect = w / h || 1;
    let a = aspect < 1 ? 1 / aspect : aspect;
    let minD = Math.max(Math.round(res), 1);
    let maxD = Math.max(Math.round(res * a), 1);
    return w > h ? { width: maxD, height: minD } : { width: minD, height: maxD };
  }

  public initFramebuffers() {
    const gl = this.gl;
    const simRes = this.getResolution(this.config.simResolution);
    const dyeRes = this.getResolution(this.config.dyeResolution);

    // Clean up previously allocated FBOs to prevent GPU memory leaks
    this.deleteDoubleFBO(this.densityFBO);
    this.deleteDoubleFBO(this.velocityFBO);
    this.deleteFBO(this.divergenceFBO);
    this.deleteFBO(this.curlFBO);
    this.deleteDoubleFBO(this.pressureFBO);

    const type = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const rg = this.ext.formatRG;
    const r = this.ext.formatR;
    const filter = this.ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);
    this.densityFBO = this.createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, type, filter);
    this.velocityFBO = this.createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, type, filter);
    this.divergenceFBO = this.createFBO(simRes.width, simRes.height, r.internalFormat, r.format, type, gl.NEAREST);
    this.curlFBO = this.createFBO(simRes.width, simRes.height, r.internalFormat, r.format, type, gl.NEAREST);
    this.pressureFBO = this.createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, type, gl.NEAREST);

    this.updateKeywords();
  }

  public updateKeywords() {
    const keywords: string[] = [];
    if (this.config.shading) keywords.push('SHADING');
    this.displayMaterial.setKeywords(keywords);
  }

  private initPointers() {
    this.pointers = [
      {
        id: -1,
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        dx: 0,
        dy: 0,
        down: false,
        moved: false,
        color: this.generateColor(),
      },
    ];
  }

  public generateColor(): ColorRGB {
    const mode = this.config.colorMode;
    if (mode === 'rainbow') {
      const c = hsvToRgb(Math.random(), 0.9, 1.0);
      return { r: c.r * 0.16, g: c.g * 0.16, b: c.b * 0.16 };
    }
    if (mode === 'neon') {
      const palette = [
        { r: 0.0, g: 0.94, b: 1.0 }, // Cyan
        { r: 1.0, g: 0.0, b: 0.47 }, // Pink
        { r: 0.47, g: 0.16, b: 0.8 }, // Purple
        { r: 0.0, g: 1.0, b: 0.6 },  // Neon mint
      ];
      const pick = palette[Math.floor(Math.random() * palette.length)];
      return { r: pick.r * 0.18, g: pick.g * 0.18, b: pick.b * 0.18 };
    }
    if (mode === 'chrome') {
      const v = 0.12 + Math.random() * 0.08;
      return { r: v * 1.05, g: v * 1.1, b: v * 1.25 };
    }
    if (mode === 'cosmic') {
      const palette = [
        { r: 0.35, g: 0.1, b: 0.95 },
        { r: 0.65, g: 0.1, b: 0.85 },
        { r: 0.1, g: 0.35, b: 0.95 },
      ];
      const pick = palette[Math.floor(Math.random() * palette.length)];
      return { r: pick.r * 0.16, g: pick.g * 0.16, b: pick.b * 0.16 };
    }
    if (mode === 'fire') {
      const palette = [
        { r: 1.0, g: 0.25, b: 0.0 }, // Orange-red
        { r: 1.0, g: 0.6, b: 0.0 },  // Gold
        { r: 1.0, g: 0.1, b: 0.2 },  // Crimson
      ];
      const pick = palette[Math.floor(Math.random() * palette.length)];
      return { r: pick.r * 0.18, g: pick.g * 0.18, b: pick.b * 0.18 };
    }
    if (mode === 'emerald') {
      const palette = [
        { r: 0.05, g: 0.95, b: 0.5 },
        { r: 0.02, g: 0.75, b: 0.8 },
        { r: 0.4, g: 1.0, b: 0.2 },
      ];
      const pick = palette[Math.floor(Math.random() * palette.length)];
      return { r: pick.r * 0.16, g: pick.g * 0.16, b: pick.b * 0.16 };
    }
    if (mode === 'smoke') {
      const v = 0.1 + Math.random() * 0.08;
      return { r: v, g: v, b: v };
    }
    if (mode === 'custom') {
      const base = hexToRgb(this.config.customColor);
      return { r: base.r * 0.18, g: base.g * 0.18, b: base.b * 0.18 };
    }
    return { r: 0.15, g: 0.1, b: 0.2 };
  }

  private blit(fbo: FBO | null, clear: boolean = false) {
    const gl = this.gl;
    if (fbo) {
      gl.viewport(0, 0, fbo.width, fbo.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    if (clear) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  public splat(x: number, y: number, dx: number, dy: number, color: ColorRGB, radiusMultiplier: number = 1.0) {
    const gl = this.gl;
    const aspect = this.canvas.width / this.canvas.height;
    let radius = (this.config.splatRadius / 100) * radiusMultiplier;
    if (aspect > 1) radius *= aspect;

    // Splat velocity
    this.splatProgram.bind();
    if (this.splatProgram.uniforms.uTarget) {
      gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocityFBO.read.attach(0));
    }
    if (this.splatProgram.uniforms.aspectRatio) {
      gl.uniform1f(this.splatProgram.uniforms.aspectRatio, aspect);
    }
    if (this.splatProgram.uniforms.point) {
      gl.uniform2f(this.splatProgram.uniforms.point, x, y);
    }
    if (this.splatProgram.uniforms.color) {
      gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0.0);
    }
    if (this.splatProgram.uniforms.radius) {
      gl.uniform1f(this.splatProgram.uniforms.radius, radius);
    }
    this.blit(this.velocityFBO.write);
    this.velocityFBO.swap();

    // Splat dye
    if (this.splatProgram.uniforms.uTarget) {
      gl.uniform1i(this.splatProgram.uniforms.uTarget, this.densityFBO.read.attach(0));
    }
    if (this.splatProgram.uniforms.color) {
      gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
    }
    this.blit(this.densityFBO.write);
    this.densityFBO.swap();
  }

  public triggerBurst(count: number = 5, centerX?: number, centerY?: number) {
    const cx = centerX !== undefined ? centerX : 0.3 + Math.random() * 0.4;
    const cy = centerY !== undefined ? centerY : 0.3 + Math.random() * 0.4;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1200 + Math.random() * 1500;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const c = this.generateColor();
      c.r *= 5.0;
      c.g *= 5.0;
      c.b *= 5.0;
      const px = Math.min(Math.max(cx + (Math.random() - 0.5) * 0.05, 0.05), 0.95);
      const py = Math.min(Math.max(cy + (Math.random() - 0.5) * 0.05, 0.05), 0.95);
      this.splat(px, py, dx, dy, c, 1.8 + Math.random() * 0.8);
    }
  }

  public clear() {
    const gl = this.gl;
    this.clearProgram.bind();
    gl.uniform1i(this.clearProgram.uniforms.uTexture, this.densityFBO.read.attach(0));
    gl.uniform1f(this.clearProgram.uniforms.value, 0.0);
    this.blit(this.densityFBO.write);
    this.densityFBO.swap();

    gl.uniform1i(this.clearProgram.uniforms.uTexture, this.velocityFBO.read.attach(0));
    gl.uniform1f(this.clearProgram.uniforms.value, 0.0);
    this.blit(this.velocityFBO.write);
    this.velocityFBO.swap();
  }

  private step(dt: number) {
    const gl = this.gl;
    const cfg = this.config;

    // Ambient procedural liquid drifting when enabled
    if (cfg.ambientMotion) {
      this.ambientTimer += dt * 0.8;
      if (Math.sin(this.ambientTimer * 2) > 0.95) {
        const ax = 0.5 + 0.35 * Math.sin(this.ambientTimer * 1.3);
        const ay = 0.5 + 0.35 * Math.cos(this.ambientTimer * 0.9);
        const adx = Math.cos(this.ambientTimer * 2.5) * 120;
        const ady = Math.sin(this.ambientTimer * 1.8) * 120;
        const ac = this.generateColor();
        this.splat(ax, ay, adx, ady, ac, 0.9);
      }
    }

    // Process pointer movement
    this.colorUpdateTimer += dt * cfg.colorUpdateSpeed;
    if (this.colorUpdateTimer >= 1.0) {
      this.colorUpdateTimer = 0;
      for (const p of this.pointers) {
        p.color = this.generateColor();
      }
    }

    for (const p of this.pointers) {
      if (p.moved) {
        p.moved = false;
        const force = cfg.splatForce;
        this.splat(p.x, p.y, p.dx * force, p.dy * force, p.color);
      }
    }

    gl.disable(gl.BLEND);

    // 1. Curl / Vorticity Confinement
    this.curlProgram.bind();
    gl.uniform2f(this.curlProgram.uniforms.texelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocityFBO.read.attach(0));
    this.blit(this.curlFBO);

    this.vorticityProgram.bind();
    gl.uniform2f(this.vorticityProgram.uniforms.texelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocityFBO.read.attach(0));
    gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curlFBO.attach(1));
    gl.uniform1f(this.vorticityProgram.uniforms.curl, cfg.curl);
    gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(this.velocityFBO.write);
    this.velocityFBO.swap();

    // 2. Divergence
    this.divergenceProgram.bind();
    gl.uniform2f(this.divergenceProgram.uniforms.texelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocityFBO.read.attach(0));
    this.blit(this.divergenceFBO);

    // 3. Clear / init pressure
    this.clearProgram.bind();
    gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressureFBO.read.attach(0));
    gl.uniform1f(this.clearProgram.uniforms.value, cfg.pressure);
    this.blit(this.pressureFBO.write);
    this.pressureFBO.swap();

    // 4. Pressure Jacobi Solver
    this.pressureProgram.bind();
    gl.uniform2f(this.pressureProgram.uniforms.texelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergenceFBO.attach(0));
    for (let i = 0; i < cfg.pressureIterations; i++) {
      gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressureFBO.read.attach(1));
      this.blit(this.pressureFBO.write);
      this.pressureFBO.swap();
    }

    // 5. Gradient Subtract (Project velocity)
    this.gradSubtractProgram.bind();
    gl.uniform2f(this.gradSubtractProgram.uniforms.texelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    gl.uniform1i(this.gradSubtractProgram.uniforms.uPressure, this.pressureFBO.read.attach(0));
    gl.uniform1i(this.gradSubtractProgram.uniforms.uVelocity, this.velocityFBO.read.attach(1));
    this.blit(this.velocityFBO.write);
    this.velocityFBO.swap();

    // 6. Advect Velocity
    this.advectionProgram.bind();
    gl.uniform2f(this.advectionProgram.uniforms.texelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    if (!this.ext.supportLinearFiltering && this.advectionProgram.uniforms.dyeTexelSize) {
      gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.velocityFBO.texelSizeX, this.velocityFBO.texelSizeY);
    }
    const velTex = this.velocityFBO.read.attach(0);
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velTex);
    gl.uniform1i(this.advectionProgram.uniforms.uSource, velTex);
    gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    gl.uniform1f(this.advectionProgram.uniforms.dissipation, cfg.velocityDissipation);
    this.blit(this.velocityFBO.write);
    this.velocityFBO.swap();

    // 7. Advect Dye / Density
    if (!this.ext.supportLinearFiltering && this.advectionProgram.uniforms.dyeTexelSize) {
      gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.densityFBO.texelSizeX, this.densityFBO.texelSizeY);
    }
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocityFBO.read.attach(0));
    gl.uniform1i(this.advectionProgram.uniforms.uSource, this.densityFBO.read.attach(1));
    gl.uniform1f(this.advectionProgram.uniforms.dissipation, cfg.densityDissipation);
    this.blit(this.densityFBO.write);
    this.densityFBO.swap();
  }

  private render() {
    const gl = this.gl;
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    this.displayMaterial.bind();
    if (this.config.shading && this.displayMaterial.uniforms.texelSize) {
      gl.uniform2f(
        this.displayMaterial.uniforms.texelSize,
        1.0 / gl.drawingBufferWidth,
        1.0 / gl.drawingBufferHeight
      );
    }
    if (this.displayMaterial.uniforms.uTexture) {
      gl.uniform1i(this.displayMaterial.uniforms.uTexture, this.densityFBO.read.attach(0));
    }
    this.blit(null, false);
  }

  private updatePointerDown(id: number, clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height;

    let p = this.pointers.find((ptr) => ptr.id === id);
    if (!p) {
      p = {
        id,
        x,
        y,
        prevX: x,
        prevY: y,
        dx: 0,
        dy: 0,
        down: true,
        moved: false,
        color: this.generateColor(),
      };
      this.pointers.push(p);
    } else {
      p.down = true;
      p.moved = false;
      p.x = x;
      p.y = y;
      p.prevX = x;
      p.prevY = y;
      p.dx = 0;
      p.dy = 0;
      p.color = this.generateColor();
    }

    if (this.config.clickSplat) {
      const burstColor = this.generateColor();
      burstColor.r *= 8.0;
      burstColor.g *= 8.0;
      burstColor.b *= 8.0;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1200;
      this.splat(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, burstColor, 1.8);
    }
  }

  private updatePointerMove(id: number, clientX: number, clientY: number) {
    if (!this.config.hoverSplat) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height;

    let p = this.pointers.find((ptr) => ptr.id === id);
    if (!p) {
      p = {
        id,
        x,
        y,
        prevX: x,
        prevY: y,
        dx: 0,
        dy: 0,
        down: false,
        moved: true,
        color: this.generateColor(),
      };
      this.pointers.push(p);
    } else {
      p.prevX = p.x;
      p.prevY = p.y;
      p.x = x;
      p.y = y;

      const aspect = rect.width / rect.height;
      let dx = p.x - p.prevX;
      let dy = p.y - p.prevY;
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;

      p.dx = dx;
      p.dy = dy;
      p.moved = Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001;
    }
  }

  private updatePointerUp(id: number) {
    const p = this.pointers.find((ptr) => ptr.id === id);
    if (p) p.down = false;
  }

  private onPointerDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement)?.closest?.('#fluid-controls-panel, #framer-export-modal')) return;
    this.updatePointerDown(e.pointerId, e.clientX, e.clientY);
  };

  private onPointerMove = (e: PointerEvent) => {
    if ((e.target as HTMLElement)?.closest?.('#fluid-controls-panel, #framer-export-modal')) return;
    this.updatePointerMove(e.pointerId, e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent) => {
    this.updatePointerUp(e.pointerId);
  };

  private onTouchStart = (e: TouchEvent) => {
    if ((e.target as HTMLElement)?.closest?.('#fluid-controls-panel, #framer-export-modal')) return;
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      this.updatePointerDown(t.identifier, t.clientX, t.clientY);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if ((e.target as HTMLElement)?.closest?.('#fluid-controls-panel, #framer-export-modal')) return;
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      this.updatePointerMove(t.identifier, t.clientX, t.clientY);
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      this.updatePointerUp(t.identifier);
    }
  };

  private bindEvents() {
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', this.onTouchEnd, { passive: true });
  }

  private unbindEvents() {
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);

    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
  }

  public resize() {
    const width = Math.max(this.canvas.clientWidth || window.innerWidth || 1, 1);
    const height = Math.max(this.canvas.clientHeight || window.innerHeight || 1, 1);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.initFramebuffers();
    }
  }

  private startLoop() {
    const loop = () => {
      if (this.isDestroyed) return;
      const now = Date.now();
      let dt = (now - this.lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.033);
      this.lastUpdateTime = now;

      this.step(dt);
      this.render();

      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.unbindEvents();

    // Clean up GPU textures and framebuffers cleanly
    this.deleteDoubleFBO(this.densityFBO);
    this.deleteDoubleFBO(this.velocityFBO);
    this.deleteFBO(this.divergenceFBO);
    this.deleteFBO(this.curlFBO);
    this.deleteDoubleFBO(this.pressureFBO);
  }
}
