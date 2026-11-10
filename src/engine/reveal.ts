import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { env } from "./env";

gsap.registerPlugin(ScrollTrigger);

export function splitElement(el: HTMLElement): { lines: HTMLElement[]; words: HTMLElement[] } {
  // On mobile viewports, avoid DOM line-splitting so slow-4G webfont swaps never reflow fixed line masks or trigger CLS
  if (env.mobile) {
    return { lines: [el], words: [] };
  }

  if (el.dataset.splitDone === "1") {
    return {
      lines: Array.from(el.querySelectorAll<HTMLElement>(".line-inner")),
      words: Array.from(el.querySelectorAll<HTMLElement>(".word")),
    };
  }

  const measuredHeight = el.offsetHeight;
  if (measuredHeight > 0) {
    el.style.minHeight = `${measuredHeight}px`;
  }

  const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
  el.setAttribute("aria-label", text);
  el.textContent = "";

  const words: HTMLElement[] = [];
  text.split(" ").forEach((w, i, arr) => {
    const span = document.createElement("span");
    span.className = "word";
    span.setAttribute("aria-hidden", "true");
    span.style.display = "inline-block";
    span.textContent = w;
    el.appendChild(span);
    words.push(span);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
  });

  const lineGroups: HTMLElement[][] = [];
  let currentTop: number | null = null;
  for (const w of words) {
    const top = Math.round(w.offsetTop);
    if (currentTop === null || Math.abs(top - currentTop) > 4) {
      lineGroups.push([]);
      currentTop = top;
    }
    lineGroups[lineGroups.length - 1]!.push(w);
  }

  el.textContent = "";
  const lines: HTMLElement[] = [];
  for (const group of lineGroups) {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    mask.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.className = "line-inner";
    group.forEach((w, i) => {
      inner.appendChild(w);
      if (i < group.length - 1) inner.appendChild(document.createTextNode(" "));
    });
    mask.appendChild(inner);
    el.appendChild(mask);
    lines.push(inner);
  }

  el.dataset.splitDone = "1";
  return { lines, words };
}

let ctx: gsap.Context | null = null;

export function initReveals(root: ParentNode = document) {
  ctx?.revert();
  if (env.reducedMotion || env.mobile) {
    document.documentElement.classList.remove("motion");
    return;
  }

  document.documentElement.classList.add("motion");

  ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      const { lines } = splitElement(el);
      if (el.hasAttribute("data-hero-reveal")) return;
      gsap.set(lines, { yPercent: 105 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay || "0");
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }
      );
    });

    root.querySelectorAll<HTMLElement>("[data-rule]").forEach((el) => {
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }
      );
    });
  });

  if (typeof document !== "undefined" && "fonts" in document) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export function destroyReveals() {
  ctx?.revert();
  ctx = null;
}
