/* Some devices ask for less motion. We respect that by default,
   and offer a one-tap way to turn the heat back up. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forced = false, dismissed = false;
  try { forced = localStorage.getItem("hj-heat") === "on"; dismissed = localStorage.getItem("hj-heat") === "off"; } catch (e) {}
  if (forced) root.classList.add("heat-on");
  window.HJ = window.HJ || {};
  window.HJ.calm = reduce && !forced;   // true = keep motion gentle

  // sworn jurors get a tick next to the rules
  document.addEventListener("DOMContentLoaded", function () {
    var sworn = null;
    try { sworn = localStorage.getItem("hj-sworn"); } catch (e) {}
    if (!sworn) return;
    document.querySelectorAll('.nav a[href="rules.html"]').forEach(function (a) { a.classList.add("sworn"); a.title = "You\u2019re sworn in"; });
  });

  // pause animations in sections that are off-screen
  document.addEventListener("DOMContentLoaded", function () {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("paused", !e.isIntersecting); });
    }, { rootMargin: "100px 0px" });
    document.querySelectorAll("main > *, body > section, body > header, .namesake").forEach(function (el) { io.observe(el); });
  });

  if (!reduce || forced || dismissed) return;
  document.addEventListener("DOMContentLoaded", function () {
    var pill = document.createElement("div");
    pill.className = "heat-pill"; pill.setAttribute("role", "region"); pill.setAttribute("aria-label", "Motion setting");
    pill.innerHTML = '<p>Your device asked for less motion, so we turned the heat down.</p>' +
      '<button class="btn" type="button">Turn the heat up</button>' +
      '<button class="x" type="button" aria-label="Keep it calm">&times;</button>';
    pill.querySelector(".btn").addEventListener("click", function () {
      try { localStorage.setItem("hj-heat", "on"); } catch (e) {}
      location.reload();
    });
    pill.querySelector(".x").addEventListener("click", function () {
      try { localStorage.setItem("hj-heat", "off"); } catch (e) {}
      pill.remove();
    });
    document.body.appendChild(pill);
  });
})();
