import gsap from "gsap";
import { env } from "./env";

let cleanups: Array<() => void> = [];

export function initInteractions(root: ParentNode = document) {
  destroyInteractions();

  root.querySelectorAll<HTMLElement>("[data-roll]").forEach((el) => {
    if (el.dataset.rollDone === "1") return;
    const text = (el.textContent ?? "").trim();
    el.classList.add("roll");
    el.innerHTML = `<span class="roll-viewport"><span class="roll-track"><span>${text}</span><span aria-hidden="true">${text}</span></span></span>`;
    el.dataset.rollDone = "1";
  });

  if (!env.finePointer || env.reducedMotion) return;

  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.22");
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    });
  });

  root.querySelectorAll<HTMLElement>("[data-fill]").forEach((el) => {
    const setSpot = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("mouseenter", setSpot);
    el.addEventListener("mousemove", setSpot);
    cleanups.push(() => {
      el.removeEventListener("mouseenter", setSpot);
      el.removeEventListener("mousemove", setSpot);
    });
  });
}

export function destroyInteractions() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
