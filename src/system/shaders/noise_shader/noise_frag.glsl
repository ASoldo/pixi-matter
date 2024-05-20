#version 300 es

precision mediump float;

in vec2 vUVs;
uniform float limit;
uniform sampler2D noise;

out vec4 outColor;

void main() {
    float color = texture(noise, vUVs).r;
    color = step(limit, color);
    outColor = vec4(color, color, color, 0.0); // Ensure to set alpha to 1.0
}
