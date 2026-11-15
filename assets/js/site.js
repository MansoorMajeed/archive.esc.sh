(function () {
  "use strict";
  var root = document.documentElement;

  // ---- Theme toggle ----
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      var frame = document.querySelector("iframe.giscus-frame");
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ giscus: { setConfig: { theme: next } } }, "https://giscus.app");
      }
    });
  }

  // ---- Post filter ----
  var input = document.getElementById("post-filter");
  var status = document.getElementById("post-filter-status");
  if (input) {
    var years = Array.prototype.slice.call(document.querySelectorAll("[data-year]"));
    var total = document.querySelectorAll("[data-row]").length;

    var apply = function () {
      var terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;
      years.forEach(function (year) {
        var visible = 0;
        year.querySelectorAll("[data-row]").forEach(function (row) {
          var hay = row.getAttribute("data-search");
          var match = terms.every(function (t) { return hay.indexOf(t) !== -1; });
          row.hidden = !match;
          if (match) visible++;
        });
        year.hidden = visible === 0;
        year.querySelector("[data-year-count]").textContent = visible + (visible === 1 ? " post" : " posts");
        shown += visible;
      });
      if (!terms.length) status.textContent = "";
      else if (shown === 0) status.textContent = "No posts match. Try a shorter or different word.";
      else status.textContent = shown + " of " + total + " posts";
    };

    input.addEventListener("input", apply);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; apply(); input.blur(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      input.focus();
    });
    if (input.value) apply();
  }

  // ---- Copy buttons on code blocks ----
  if (navigator.clipboard) {
    document.querySelectorAll(".prose pre").forEach(function (pre) {
      var host = pre.closest(".highlight") || pre;
      var box = document.createElement("div");
      box.className = "codeblock";
      host.parentNode.insertBefore(box, host);
      box.appendChild(host);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy";
      btn.textContent = "copy";
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        navigator.clipboard.writeText(code.innerText.replace(/\n$/, "")).then(function () {
          btn.textContent = "copied";
          setTimeout(function () { btn.textContent = "copy"; }, 1500);
        }, function () {
          btn.textContent = "failed";
          setTimeout(function () { btn.textContent = "copy"; }, 1500);
        });
      });
      box.appendChild(btn);
    });
  }
})();
