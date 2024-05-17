#version 300 es

precision mediump float;

in vec2 vUV; // Input texture coordinates (UV) from vertex shader

uniform sampler2D uTexture; // The texture sampler

out vec4 fragColor; // Output color of the fragment

void main() {
    fragColor = texture(uTexture, vUV).bgra; // Sample the texture and set the fragment color
}
