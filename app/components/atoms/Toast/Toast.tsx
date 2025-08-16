"use client";

import { useEffect, useRef, useState } from "react";

type Flash = {
  id?: string;
  type?: "success" | "error" | "info" | "warning";
  message: string;
};

export const Toast = ({
  duration = 3000,
  initialFlash,
}: {
  duration?: number;
  initialFlash: string | null;
}) => {
  // SSR時は closed で固定（open にするとサーバーとクライアントの初期描画がズレる）
  const [state, setState] = useState<"open" | "closed">("closed");
  const [mounted, setMounted] = useState(false);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [visible, setVisible] = useState(true);
  const lastIdRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // クライアントマウント完了フラグ（SSRとの不一致を防ぐ）
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウント後に open にしてアニメ開始
  useEffect(() => {
    if (!mounted || !initialFlash) return;

    let parsed: Flash | null = null;
    try {
      parsed = JSON.parse(initialFlash) as Flash;
    } catch (e) {
      console.error("[Toast] JSON.parse failed:", e, { initialFlash });
    }

    if (!parsed?.message) return;

    if (parsed.id && parsed.id === lastIdRef.current) {
      // 同一idならスキップ
      return;
    }

    // いったんクローズ状態/タイマーをリセット
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setState("closed");
    setVisible(true);

    // 内容をセットして開く
    setFlash(parsed);
    lastIdRef.current = parsed.id ?? null;
    // 次のtickでopenにするとアニメが安定する
    requestAnimationFrame(() => {
      setState("open");
      // テスト環境ではアニメーション待たずに即非表示
      if (process.env.NODE_ENV === "test") {
        // テストでは即閉じる
        setState("closed");
        setVisible(false);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        setState("closed");
      }, duration);
    });

    document.cookie = "flash=; Max-Age=0; path=/";

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [mounted, duration, initialFlash]);

  // アニメーション終了後にDOMから削除
  const handleAnimationEnd: React.AnimationEventHandler<HTMLDivElement> = () => {
    if (state === "closed") {
      setVisible(false);
    }
  };

  const manuallyClose = () => {
    setState("closed");

    // ✅ テスト環境ならすぐ消す
    if (process.env.NODE_ENV === "test") {
      setVisible(false);
    }
  };

  // まだマウントしてない or 完全に非表示なら何も描画しない
  if (!mounted || !visible || !flash) return null;

  return (
    <div role="region" aria-label="Notifications" tabIndex={-1}>
      {/* 視覚的に非表示（スクリーンリーダー用） */}
      <span
        aria-hidden="true"
        tabIndex={0}
        style={{ clip: "rect(0px, 0px, 0px, 0px)" }}
        className="fixed h-px w-px overflow-hidden p-0 whitespace-nowrap"
      />
      <div
        tabIndex={-1}
        className="fixed right-0 bottom-0 z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]"
      >
        <div
          data-state={state}
          onAnimationEnd={handleAnimationEnd}
          className={`group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border bg-white p-6 pr-8 text-slate-900 shadow-lg ${
            state === "open" ? "animate-toast-enter" : "animate-toast-exit"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="grid gap-1">
            <p className="text-sm font-semibold">{flash?.message}</p>
          </div>

          <button
            type="button"
            onClick={manuallyClose}
            className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded text-sm opacity-70 hover:cursor-pointer hover:opacity-100 focus:ring-2 focus:outline-none"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
