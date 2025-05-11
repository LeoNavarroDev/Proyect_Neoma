// Variables globales y de tiempo
let N = 50000;
let fbWide, fbHigh;
let oldPos, newPos;
let updateShdr, drawShdr;
let b = 1;
let canvas;

// Tiempo activo y duración del fade (en segundos)
let activeTime = 2; // tiempo en que las partículas se muestran a pleno rendimiento
let fadeTime = 2; // tiempo durante el cual las partículas se desvanecen

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("heroe-bg");
  let gl = this._renderer.GL;
  gl.clearColor(0, 0, 0, 0);

  updateShdr = createShader(vsUpdate, fsUpdate);
  // Nota: agregamos el uniforme 'fade' en el shader de dibujo
  drawShdr = createShader(vsDraw, fsDraw);

  fbWide = 1024;
  fbHigh = ceil(N / fbWide);
  let fbOptions = {
    format: FLOAT,
    depth: false,
    antialias: false,
    density: 1,
    width: fbWide,
    height: fbHigh,
  };
  oldPos = createFramebuffer(fbOptions);
  newPos = createFramebuffer(fbOptions);
  oldPos.loadPixels();
  for (let i = 0; i < N; i++) {
    oldPos.pixels[4 * i] = random(-1, 1);
    oldPos.pixels[4 * i + 1] = random(-1, 1);
    oldPos.pixels[4 * i + 2] = (2.0 * i) / N - 1;
    oldPos.pixels[4 * i + 3] = 1.0;
  }
  oldPos.updatePixels();
}

function windowResized() {
  let canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
}

function draw() {
  let t = frameCount / 60.0;

  // Calculamos el factor de fade:
  // Si t < activeTime => fade = 1;
  // Si t entre activeTime y activeTime+fadeTime => fade decae linealmente hasta 0;
  // Si t mayor, fade = 0.
  let fade = 1.0;
  if (t > activeTime) {
    fade = max(1.0 - (t - activeTime) / fadeTime, 0.0);
  }

  b = 0.14 + 0.06 * sin((TAU * t) / 37.018);

  newPos.begin();
  updateShdr.bindShader();
  updateShdr.setUniform("b", b);
  updateShdr.setUniform("data", oldPos);
  updateShdr.bindTextures();
  let gl = newPos.gl;
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  updateShdr.unbindTextures();
  updateShdr.unbindShader();
  newPos.end();

  camera(0, 0, -3, 0, 0.1, 0, 0, 1, 0);
  perspective(PI / 3, (1.0 * width) / height, 1, 10);
  rotateX(0.5);
  rotateY(TAU * 0.05 * t);

  clear();
  gl = this._renderer.GL;
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendEquation(gl.MAX);
  gl.lineWidth(0.5);
  drawShdr.bindShader();
  // Enviamos las texturas y uniformes al shader de dibujo
  drawShdr.setUniform("dataA", oldPos);
  drawShdr.setUniform("dataB", newPos);
  drawShdr.setUniform("N", N);
  drawShdr.setUniform("b", b);
  drawShdr.setUniform("fade", fade); // factor de desvanecimiento
  drawShdr.bindTextures();
  gl.drawArrays(gl.LINES, 0, 2 * N);
  gl.disable(gl.BLEND);
  drawShdr.unbindTextures();
  drawShdr.unbindShader();

  let temp = oldPos;
  oldPos = newPos;
  newPos = temp;
}

// Shaders de actualización (sin cambios)
let vsUpdate = `#version 300 es
precision highp float;
precision highp int;
void main() {
  gl_Position = vec4(4*ivec2(gl_VertexID & 1, gl_VertexID & 2) - 1, 0., 1.);
}
`;

let fsUpdate = `#version 300 es
precision highp float;
uniform sampler2D data;
uniform float b;
out vec4 fragColor;
void main() {
  ivec2 res = textureSize(data, 0);
  vec3 pos = texelFetch(data, ivec2(gl_FragCoord.xy), 0).xyz;
  for (int i = 0; i < 12; i++) {
    pos += 1./128. * (sin(pos.yzx) - b * pos);
  }
  fragColor = vec4(pos, 1.);
}
`;

// Vertex shader de dibujo (sin cambios)
let vsDraw = `#version 300 es
precision highp float;
precision highp int;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D dataA;
uniform sampler2D dataB;
uniform int N;
uniform float b;
out vec4 vColor;

vec3 auroraColors(float t) {
  vec3 c1 = vec3(0.0, 0.5, 0.6);
  vec3 c2 = vec3(0.3, 0.4, 0.9);
  vec3 c3 = vec3(0.7, 0.2, 0.8);
  vec3 c4 = vec3(0.9, 0.4, 0.5);
  float p1 = smoothstep(0.0, 0.25, t);
  float p2 = smoothstep(0.25, 0.5, t);
  float p3 = smoothstep(0.5, 0.75, t);
  float p4 = smoothstep(0.75, 1.0, t);
  vec3 color = mix(c1, c2, p1);
  color = mix(color, c3, p2);
  color = mix(color, c4, p3);
  return color;
}

void main() {
  ivec2 res = textureSize(dataA, 0);
  int idx = gl_VertexID / 2;
  ivec2 ij = ivec2(idx % res.x, idx / res.x);
  vec4 p0 = texelFetch(dataA, ij, 0);
  vec4 p1 = texelFetch(dataB, ij, 0);
  vec4 p = ((gl_VertexID & 1) > 0) ? p0 : p1;
  p.xyz *= 1.6 * b;
  p = uModelViewMatrix * p;
  gl_Position = uProjectionMatrix * p;
  
  float u = float(gl_VertexID) / float(N);
  vec3 baseColor = auroraColors(u);
  float brightness = pow(clamp((4.5 + p.z) / 2.5, 0.0, 1.0), 2.0) * 0.7;
  float shimmer = sin(u * 100.0 + float(idx) * 0.01) * 0.15 + 0.85;
  vec3 finalColor = baseColor * brightness * shimmer;
  vColor = vec4(finalColor, 1.0);
}
`;

// Fragment shader de dibujo (se añade el uniforme 'fade')
let fsDraw = `#version 300 es
precision highp float;
in vec4 vColor;
uniform float fade;
out vec4 fragColor;
void main() {
  fragColor = vec4(vColor.rgb * fade, fade);
}
`;
