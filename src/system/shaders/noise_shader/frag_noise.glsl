#version 300 es

precision mediump float;

in vec2 vUVs;
uniform float limit;
uniform sampler2D noise;
uniform vec3 color;

out vec4 outColor;

void main() {
    float tex = texture(noise, vUVs).r;
    tex = step(limit, tex);
    outColor = vec4(color * tex, tex); // Ensure to set alpha to 1.0
}
