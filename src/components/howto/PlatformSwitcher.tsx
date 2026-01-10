"use client";

export default function PlatformSwitcher({
  platform,
  setPlatform,
}: {
  platform: "ios" | "android";
  setPlatform: (platform: "ios" | "android") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white/80 p-1 text-slate-700 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/5 dark:text-white">
      <button
        type="button"
        onClick={() => setPlatform("ios")}
        className={[
          "rounded-full px-4 py-2 text-sm transition",
          platform === "ios"
            ? "bg-slate-900/10 text-slate-900 dark:bg-white/15 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white",
        ].join(" ")}
      >
        iPhone (Safari)
      </button>

      <button
        type="button"
        onClick={() => setPlatform("android")}
        className={[
          "rounded-full px-4 py-2 text-sm transition",
          platform === "android"
            ? "bg-slate-900/10 text-slate-900 dark:bg-white/15 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white",
        ].join(" ")}
      >
        Android (Chrome)
      </button>
    </div>
  );
}
