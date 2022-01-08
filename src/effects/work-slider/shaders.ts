// Shaders for work sliding effect

// Taken from https://github.com/conorbailey90/rgb-split-distortion-scroll-effect
// I couldnt figure out how to use glsl files directly so this is my ugly way

export var vertexShader = `

uniform sampler2D uTexture;
uniform vec2 uOffset;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
   position.x = position.x + (sin(uv.y * M_PI) * offset.x);
   position.y = position.y + (sin(uv.x * M_PI) * offset.y);
   return position;
}

void main() {
   vUv = uv;
   vec3 newPosition = deformationCurve(position, uv, uOffset);
   gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}

`;


export var fragmentShader = `

uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset;
uniform vec2 uMeshSize;
uniform vec2 uImgSize;
varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {

   float centeredX = ((uv.x - (uImgSize.x / uImgSize.y / 2.0)) * uMeshSize.x / uMeshSize.y) - uImgSize.x;
   vec2 pos = vec2(centeredX, uv.y);

   float r = texture2D(textureImage,pos + offset).r;
   vec2 gb = texture2D(textureImage,pos).gb;
   return vec3(r,gb);
}

void main() {
   vec3 color = rgbShift(uTexture, vUv, uOffset);
   gl_FragColor = vec4(color,uAlpha);
}

`