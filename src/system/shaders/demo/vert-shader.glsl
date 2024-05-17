#version 300 es

in vec2 aPosition; // Input vertex position
in vec2 aUV; // Input texture coordinates (UV)

out vec2 vUV; // Output texture coordinates (UV) to fragment shader

uniform mat3 uProjectionMatrix; // Projection matrix
uniform mat3 uWorldTransformMatrix; // World transform matrix
uniform mat3 uTransformMatrix; // Model transform matrix

void main() {
    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix; // Combine matrices
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0); // Transform position
    vUV = aUV; // Pass UV to fragment shader
}
