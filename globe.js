/* Globo LA 27 (rescatado de la web anterior, 24/11): textura NASA Black Marble (dominio público), rutas desde Barcelona. Sin dependencias. */
(function(){
var self={};
function initGlobe() {
    const cg = document.querySelector('[data-role="globe"]');
    const cr = document.querySelector('[data-role="routes"]');
    if (!cg || !cr) return;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const RAD = Math.PI / 180;
    const HUB = [41.39, 2.17]; // Barcelona
    const CITIES = [[52.52, 13.40], [50.94, 6.96], [48.21, 16.37], [48.86, 2.35], [51.51, -0.13], [45.46, 9.19], [52.37, 4.90], [40.42, -3.70], [47.37, 8.54], [48.14, 11.58], [59.33, 18.07], [38.72, -9.14],
      [41.90, 12.50], [52.23, 21.01], [50.08, 14.44], [53.35, -6.26], [55.68, 12.57], [47.50, 19.04], [37.98, 23.73], [60.17, 24.94], [53.55, 9.99], [50.85, 4.35]];
    const vec = (lat, lon) => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];
    const slerp = (p, q, t) => {
      const d = Math.acos(Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])), sn = Math.sin(d) || 1;
      const k1 = Math.sin((1 - t) * d) / sn, k2 = Math.sin(t * d) / sn;
      return [p[0] * k1 + q[0] * k2, p[1] * k1 + q[1] * k2, p[2] * k1 + q[2] * k2];
    };
    const hub = vec(HUB[0], HUB[1]);
    const arcs = CITIES.map((c, i) => { const to = vec(c[0], c[1]); return { to, off: (i * 0.618034) % 1, d: Math.acos(Math.min(1, hub[0] * to[0] + hub[1] * to[1] + hub[2] * to[2])) }; });
    const TILT = 40 * RAD; // Europa mirando al frente
    const RADIO = 0.45;    // radio del globo respecto al lado menor del lienzo

    // ---- WebGL: esfera trazada por píxel sobre un cuadrado, textura NASA Black Marble (dominio público)
    const gl = cg.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
    let prog = null, uni = {}, texOk = false;
    if (gl) {
      const vs = 'attribute vec2 p; varying vec2 v; void main(){ v = p; gl_Position = vec4(p, 0.0, 1.0); }';
      const fs = [
        'precision highp float; varying vec2 v; uniform sampler2D tex; uniform float yaw, tilt, rad, aspect, ok;',
        'void main(){',
        '  vec2 q = vec2(v.x * aspect, v.y) / rad;',
        '  float r2 = dot(q, q);',
        '  vec3 atm = vec3(0.55, 0.04, 0.035);',
        '  if (r2 > 1.0) {',
        '    float d = sqrt(r2) - 1.0;',
        '    float g = exp(-d * 16.0) * 0.32;',
        '    gl_FragColor = vec4(atm * g, g); return;',
        '  }',
        '  float z = sqrt(1.0 - r2);',
        '  float ct = cos(tilt), st = sin(tilt), cy = cos(yaw), sy = sin(yaw);',
        '  float y = q.y * ct + z * st; float z1 = -q.y * st + z * ct;',
        '  float x = q.x * cy - z1 * sy; float zz = q.x * sy + z1 * cy;',
        '  float lat = asin(clamp(y, -1.0, 1.0)); float lon = atan(x, zz);',
        '  vec2 uv = vec2((lon + 3.14159265) / 6.2831853, 0.5 - lat / 3.14159265);',
        '  vec3 c = ok > 0.5 ? texture2D(tex, uv).rgb : vec3(0.05, 0.05, 0.1);',
        '  float lights = smoothstep(0.16, 0.62, max(c.r, c.g) - c.b * 0.35);',
        '  float land = smoothstep(0.07, 0.30, c.b) * (1.0 - lights);',
        '  vec3 col = vec3(0.022, 0.010, 0.012);',
        '  col += land * vec3(0.13, 0.085, 0.085);',
        '  col += lights * vec3(0.95, 0.16, 0.10) * 1.25;',
        '  col += pow(lights, 3.0) * vec3(1.0, 0.72, 0.55) * 0.7;',
        '  vec3 n = vec3(q, z);',
        '  float dif = clamp(dot(n, normalize(vec3(-0.45, 0.5, 0.75))), 0.0, 1.0);',
        '  col *= 0.35 + 0.85 * dif;',
        '  float fr = pow(1.0 - z, 3.0);',
        '  col += atm * fr * 0.55;',
        '  float edge = smoothstep(1.0, 0.985, sqrt(r2));',
        '  gl_FragColor = vec4(col * edge, edge);',
        '}'].join('\n');
      const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; } return o; };
      const v1 = sh(gl.VERTEX_SHADER, vs), f1 = sh(gl.FRAGMENT_SHADER, fs);
      if (v1 && f1) {
        prog = gl.createProgram(); gl.attachShader(prog, v1); gl.attachShader(prog, f1); gl.linkProgram(prog);
        gl.useProgram(prog);
        const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        ['yaw', 'tilt', 'rad', 'aspect', 'ok'].forEach((k) => { uni[k] = gl.getUniformLocation(prog, k); });
        const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 10, 20, 255]));
        const img = new Image();
        img.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          texOk = true; if (quieto) draw(0);
        };
        img.src = '/assets/globe/tierra-noche.jpg';
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      } else { prog = null; }
    }

    const ctx = cr.getContext('2d');
    let w, h, dpr, R, cx, cy;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cg.width = cr.width = Math.round(cg.clientWidth * dpr);
      h = cg.height = cr.height = Math.round(cg.clientHeight * dpr);
      R = Math.min(w, h) * RADIO; cx = w / 2; cy = h / 2;
      if (gl) gl.viewport(0, 0, w, h);
    };
    size();
    window.addEventListener('resize', size); window.addEventListener('load', size);

    const t0 = performance.now();
    // Rendimiento (12/11): el globo gira ~1 grado/s, así que basta redibujar la esfera a ~12 fps (idéntico a la vista);
    // las rutas siguen a 60 fps. Y nada se dibuja mientras el globo no está en pantalla.
    let visible = true, ultGlobo = -1e9;
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(cg);
    const draw = (now) => {
      if (!visible && !quieto) { self._animGlobe = requestAnimationFrame(draw); return; }
      const t = ((now || t0) - t0) / 1000;
      const yaw = -(8 + Math.sin(t * 0.08) * 16) * RAD;
      // globo
      if (gl && prog && (quieto || !now || now - ultGlobo > 80)) {
        ultGlobo = now || 0;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uni.yaw, yaw); gl.uniform1f(uni.tilt, TILT);
        gl.uniform1f(uni.rad, (R * 2) / h); gl.uniform1f(uni.aspect, w / h); gl.uniform1f(uni.ok, texOk ? 1 : 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      // rutas desde Barcelona (misma rotación que el globo)
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), ct = Math.cos(TILT), st = Math.sin(TILT);
      const rot = (p) => {
        const x1 = p[0] * cyw + p[2] * syw, z1 = -p[0] * syw + p[2] * cyw;
        const y2 = p[1] * ct - z1 * st, z2 = p[1] * st + z1 * ct;
        return [cx + x1 * R, cy - y2 * R, z2];
      };
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      // Cada arco: viaja con aceleración suave, deja una estela que se apaga y hace un destello al llegar.
      const CICLO = 5.2, VIAJE = 0.46;
      const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      const punto = (a, f) => {
        const v = slerp(hub, a.to, f), lift = 1 + Math.sin(f * Math.PI) * (0.03 + a.d * 0.42);
        return rot([v[0] * lift, v[1] * lift, v[2] * lift]);
      };
      arcs.forEach((a) => {
        const fase = quieto ? 0.7 : (((t + a.off * CICLO) % CICLO) / CICLO);
        const viajando = fase < VIAJE;
        const cabeza = viajando ? ease(fase / VIAJE) : 1;
        // desvanecido del arco completo cuando ya ha llegado
        const resto = viajando ? 1 : Math.max(0, 1 - (fase - VIAJE) / (1 - VIAJE));
        // estela: desde (cabeza - 0.45) hasta la cabeza, con muchos pasos para que no haya saltos
        const cola = viajando ? Math.max(0, cabeza - 0.45) : 0;
        const pasos = 36;
        for (let k = 0; k < pasos; k++) {
          const f1 = cola + (cabeza - cola) * (k / pasos), f2 = cola + (cabeza - cola) * ((k + 1) / pasos);
          const p1 = punto(a, f1), p2 = punto(a, f2);
          if (p1[2] < 0 || p2[2] < 0) continue;
          const u = (k + 1) / pasos; // 0 en la cola, 1 en la cabeza
          const al = viajando ? (0.05 + 0.75 * u * u) : 0.22 * resto;
          if (al < 0.01) continue;
          ctx.strokeStyle = 'rgba(255,110,100,' + al.toFixed(3) + ')';
          ctx.lineWidth = (viajando ? 0.8 + 0.9 * u : 1) * dpr;
          ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
        }
        if (viajando) {
          const h = punto(a, cabeza);
          if (h[2] > 0) {
            const g = ctx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 7 * dpr);
            g.addColorStop(0, 'rgba(255,235,228,0.95)'); g.addColorStop(0.35, 'rgba(255,90,80,0.55)'); g.addColorStop(1, 'rgba(255,60,50,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h[0], h[1], 7 * dpr, 0, Math.PI * 2); ctx.fill();
          }
        } else {
          const e = punto(a, 1);
          if (e[2] > 0) {
            const k = (fase - VIAJE) / (1 - VIAJE); // 0 → 1 tras la llegada
            if (k < 0.5) {
              const r = (3 + k * 2 * 14) * dpr;
              ctx.strokeStyle = 'rgba(255,100,90,' + (0.7 * (1 - k * 2)).toFixed(3) + ')';
              ctx.lineWidth = 1.2 * dpr; ctx.beginPath(); ctx.arc(e[0], e[1], r, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.fillStyle = 'rgba(255,225,215,' + (0.9 * resto).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(e[0], e[1], 1.6 * dpr, 0, Math.PI * 2); ctx.fill();
          }
        }
      });
      const hb = rot(hub);
      const pulse = quieto ? 0.5 : (t * 0.5) % 1;
      ctx.strokeStyle = 'rgba(220,38,38,' + (0.8 * (1 - pulse)).toFixed(3) + ')';
      ctx.lineWidth = 1.3 * dpr; ctx.beginPath(); ctx.arc(hb[0], hb[1], (4 + pulse * 18) * dpr, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgb(220,38,38)'; ctx.beginPath(); ctx.arc(hb[0], hb[1], 3.2 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hb[0], hb[1], 1.2 * dpr, 0, Math.PI * 2); ctx.fill();
      if (!quieto) self._animGlobe = requestAnimationFrame(draw);
    };
    draw();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initGlobe);}else{initGlobe();}
})();
