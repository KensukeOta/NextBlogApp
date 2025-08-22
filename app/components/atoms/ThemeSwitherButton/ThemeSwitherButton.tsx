"use client";

import { useLayoutEffect, useState, useTransition, useEffect } from "react";
import { setTheme } from "@/app/lib/actions/theme";

type Choice = "light" | "dark";

/** DOMを即時更新（体感即時反映用） */
function applyClientTheme(value: Choice | "system") {
  const html = document.documentElement;

  if (value === "light") {
    html.setAttribute("data-theme", "light");
    html.setAttribute("data-theme-locked", "true");
    return;
  }
  if (value === "dark") {
    html.setAttribute("data-theme", "dark");
    html.setAttribute("data-theme-locked", "true");
    return;
  }

  // system: ロック解除してOSに追従
  html.removeAttribute("data-theme-locked");
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isSystemDark) {
    html.setAttribute("data-theme", "dark");
  } else {
    html.removeAttribute("data-theme");
  }
}

function getCurrentChoice(): Choice {
  const html = document.documentElement;
  const locked = html.getAttribute("data-theme-locked") === "true";
  const dataTheme = html.getAttribute("data-theme"); // "light" | "dark" | null

  if (locked) {
    return dataTheme === "dark" ? "dark" : "light";
  }
  // system: OS設定に追従
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isSystemDark ? "dark" : "light";
}

export const ThemeSwitcherButton = () => {
  const [, startTransition] = useTransition();
  const [choice, setChoice] = useState<Choice>("light");
  const [ready, setReady] = useState(false);

  // 初期値をDOM属性とOSから判定
  useLayoutEffect(() => {
    setChoice(getCurrentChoice());
    setReady(true);
  }, []);

  // OSが変わったときに、system追従中なら反映（= lockedでなければ反映）
  useEffect(() => {
    if (!ready) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const html = document.documentElement;
      const locked = html.getAttribute("data-theme-locked") === "true";
      if (locked) return;
      setChoice(getCurrentChoice());
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [ready]);

  if (!ready) {
    return (
      <button type="button" disabled className="rounded-md border px-2 py-1 opacity-70">
        …
      </button>
    );
  }

  const toggleTheme = () => {
    const next: Choice = choice === "light" ? "dark" : "light";
    setChoice(next);
    applyClientTheme(next); // DOM即反映
    startTransition(() => setTheme(next)); // Cookie保存（固定モード）
  };

  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        className="bg-background text-foreground rounded-md border px-3 py-1 hover:cursor-pointer hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
      >
        {choice === "light" ? "🌞" : "🌙"}
      </button>
    </div>
  );
};
