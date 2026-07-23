(function () {
  "use strict";
  // Find our own <script> tag. document.currentScript works for a normal
  // synchronous tag; fall back to matching by src for async / tag-manager
  // injection (Google Tag Manager, site builders, dynamic insertion).
  var script = document.currentScript;
  if (!script) {
    var tags = document.querySelectorAll('script[src*="widget.js"]');
    script = tags[tags.length - 1];
  }
  if (!script) return;

  var key = script.getAttribute("data-key");
  var color = script.getAttribute("data-color") || "#4f46e5";
  if (!key) {
    console.error("[Shopmate] Missing data-key on the widget script tag.");
    return;
  }

  var base;
  try {
    base = new URL(script.src).origin;
  } catch (e) {
    base = "";
  }

  var open = false;

  // --- Launcher button ---
  var btn = document.createElement("button");
  btn.setAttribute("aria-label", "Open chat");
  btn.style.cssText = [
    "position:fixed",
    "bottom:20px",
    "right:20px",
    "width:56px",
    "height:56px",
    "border-radius:9999px",
    "border:none",
    "cursor:pointer",
    "background:" + color,
    "box-shadow:0 6px 20px rgba(0,0,0,0.25)",
    "z-index:2147483000",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "transition:transform .15s ease",
  ].join(";");

  var iconChat =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var iconClose =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  btn.innerHTML = iconChat;

  // --- Chat panel (iframe) ---
  var frame = document.createElement("iframe");
  frame.src = base + "/widget/" + encodeURIComponent(key);
  frame.title = "Chat";
  frame.style.cssText = [
    "position:fixed",
    "bottom:88px",
    "right:20px",
    "width:380px",
    "height:min(560px, calc(100vh - 120px))",
    "max-width:calc(100vw - 40px)",
    "border:none",
    "border-radius:16px",
    "box-shadow:0 12px 40px rgba(0,0,0,0.25)",
    "z-index:2147483000",
    "display:none",
    "background:#fff",
    "overflow:hidden",
  ].join(";");

  function toggle() {
    open = !open;
    frame.style.display = open ? "block" : "none";
    btn.innerHTML = open ? iconClose : iconChat;
  }

  btn.addEventListener("click", toggle);
  btn.addEventListener("mouseenter", function () {
    btn.style.transform = "scale(1.05)";
  });
  btn.addEventListener("mouseleave", function () {
    btn.style.transform = "scale(1)";
  });

  function mount() {
    document.body.appendChild(frame);
    document.body.appendChild(btn);
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
