// GLSL shaders for work scroller warping effect
// Modified versions of the shaders from https://github.com/conorbailey90/rgb-split-distortion-scroll-effect

export const vertexShader = `

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


export function fragmentShader() {

   const horizontal = `
      float centeredX = ((uv.x) * (uMeshSize.x / uMeshSize.y)) - ((uImgSize.x / uImgSize.y) / 2.0) + 0.5;
      vec2 pos = vec2(centeredX, uv.y);
   `;

   const vertical = `
      float centeredY = ((uv.y) * (uMeshSize.y / uMeshSize.x)) - ((uImgSize.y / uImgSize.x) / 2.0) + 0.5;
      vec2 pos = vec2(uv.x, centeredY);
   `;

   function addPosition(fragment: string) {
      return `
         uniform sampler2D uTexture;
         uniform float uAlpha;
         uniform vec2 uOffset;
         uniform vec2 uMeshSize;
         uniform vec2 uImgSize;
         varying vec2 vUv;

         vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
            ${fragment}
            
            float r = texture2D(textureImage,pos + offset).r;
            vec2 gb = texture2D(textureImage,pos).gb;
            return vec3(r,gb);
         }

         void main() {
            vec3 color = rgbShift(uTexture, vUv, uOffset);
            gl_FragColor = vec4(color,uAlpha);
         }
      `
   }

   return {
      horizontal: addPosition(horizontal),
      vertical: addPosition(vertical)
   }
}