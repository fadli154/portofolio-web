import { Renderer, Program, Mesh, Triangle } from "ogl";
import gsap from "gsap";
import { env } from "../env";
import { scrollState } from "../scroll";
import { VERT, FRAG_FIELD } from "./shaders";

function parseColorToRGB(raw: string, fallback: [number, number, number]): [number, number, number] {
  const s = raw.trim();
  if (s.startsWith("#")) {
    const h = s.slice(1);
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    const n = parseInt(full, 16);
    if (!Number.isNaN(n)) {
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
  }
  return fallback;
}

function readTokenRGB(varName: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof document === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName);
  return val ? parseColorToRGB(val, fallback) : fallback;
}

let cleanup: (() => void) | null = null;

export function initGL(canvas?: HTMLCanvasElement | null) {
  destroyGL();
  if (typeof document === "undefined") return;
  if (env.reducedMotion || env.mobile) return;

  const target = canvas ?? document.querySelector<HTMLCanvasElement>("[data-gl]");
  if (!target) return;

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas: target,
      dpr: env.dpr,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
  } catch {
    return;
  }

  document.documentElement.classList.add("gl-on");

  const { gl } = renderer;
  const geometry = new Triangle(gl);

  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVelocity: { value: 0 },
    uMouse: { value: [0.5, 0.5] },
    uResolution: { value: [1, 1] },
    uBg: { value: readTokenRGB("--bg", [0.98, 0.98, 0.98]) },
    uInk: { value: readTokenRGB("--ink", [0.059, 0.09, 0.165]) },
    uAccent: { value: readTokenRGB("--accent", [0.145, 0.388, 0.922]) },
  };

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG_FIELD,
    uniforms,
  });

  const mesh = new Mesh(gl, { geometry, program });

  const resize = () => {
    const parent = target.parentElement;
    const w = parent?.clientWidth || target.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || target.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    target.style.width = "100%";
    target.style.height = "100%";
    uniforms.uResolution.value = [w, h];
    uniforms.uBg.value = readTokenRGB("--bg", [0.98, 0.98, 0.98]);
    uniforms.uInk.value = readTokenRGB("--ink", [0.059, 0.09, 0.165]);
    uniforms.uAccent.value = readTokenRGB("--accent", [0.145, 0.388, 0.922]);
  };
  resize();
  window.addEventListener("resize", resize);

  const themeObserver = new MutationObserver(() => {
    uniforms.uBg.value = readTokenRGB("--bg", [0.98, 0.98, 0.98]);
    uniforms.uInk.value = readTokenRGB("--ink", [0.059, 0.09, 0.165]);
    uniforms.uAccent.value = readTokenRGB("--accent", [0.145, 0.388, 0.922]);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const mouseTarget = { x: 0.5, y: 0.5 };
  const onMove = (e: MouseEvent) => {
    mouseTarget.x = e.clientX / Math.max(window.innerWidth, 1);
    mouseTarget.y = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry ? entry.isIntersecting : true;
    },
    { threshold: 0 }
  );
  io.observe(target);

  const tick = (time: number) => {
    if (!visible || document.hidden) return;
    uniforms.uTime.value = time;
    uniforms.uScroll.value = scrollState.progress;
    uniforms.uVelocity.value += (scrollState.velocity - uniforms.uVelocity.value) * 0.12;
    uniforms.uMouse.value[0] += (mouseTarget.x - uniforms.uMouse.value[0]) * 0.08;
    uniforms.uMouse.value[1] += (mouseTarget.y - uniforms.uMouse.value[1]) * 0.08;
    renderer.render({ scene: mesh });
  };
  gsap.ticker.add(tick);

  cleanup = () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMove);
    themeObserver.disconnect();
    io.disconnect();
    document.documentElement.classList.remove("gl-on");
  };
}

export function destroyGL() {
  cleanup?.();
  cleanup = null;
}
