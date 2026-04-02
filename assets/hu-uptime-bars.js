/**
 * Hu Status — franja de barras de disponibilidad (últimos N días) tipo Statuspage.
 * Datos: history/summary.json (mismo origen que LiveStatus de Upptime).
 *
 * Mantener BRANCH y OWNER_REPO alineados con el default branch del repo y con la URL
 * del script en .upptimerc.yml → status-website.customFootHtml.
 */
(function () {
  var OWNER_REPO = "gethu-ai/status-page";
  var BRANCH = "master";
  var DAYS = 90;
  var SUMMARY_URL =
    "https://raw.githubusercontent.com/" +
    OWNER_REPO +
    "/" +
    BRANCH +
    "/history/summary.json";

  function periodUptimePercent(dailyMinutesDown, days) {
    var today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    var downTotal = 0;
    var i;
    var d;
    var key;
    for (i = 0; i < days; i++) {
      d = new Date(today);
      d.setUTCDate(d.getUTCDate() - (days - 1 - i));
      key = d.toISOString().slice(0, 10);
      downTotal += Math.min(1440, (dailyMinutesDown && dailyMinutesDown[key]) || 0);
    }
    var denom = days * 1440;
    return ((100 * (denom - downTotal)) / denom).toFixed(1);
  }

  function buildBars(dailyMinutesDown) {
    var today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    var bars = [];
    var i;
    var d;
    var key;
    var down;
    for (i = DAYS - 1; i >= 0; i--) {
      d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      key = d.toISOString().slice(0, 10);
      down = (dailyMinutesDown && dailyMinutesDown[key]) || 0;
      if (down >= 1440) bars.push("down");
      else if (down > 0) bars.push("degraded");
      else bars.push("up");
    }
    return bars;
  }

  function slugFromArticle(article) {
    var a = article.querySelector("h4 a[href*='history/']");
    if (!a) return null;
    var href = a.getAttribute("href") || "";
    var m = href.match(/history\/([^/?#]+)/);
    return m ? m[1] : null;
  }

  function renderStrip(article, site) {
    if (article.querySelector(".hu-uptime-strip")) return;
    var dm = site.dailyMinutesDown || {};
    var levels = buildBars(dm);
    var pct = periodUptimePercent(dm, DAYS);
    var label =
      pct +
      "% disponibilidad · últimos " +
      DAYS +
      " días";

    var wrap = document.createElement("div");
    wrap.className = "hu-uptime-strip";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", label);

    var row = document.createElement("div");
    row.className = "hu-uptime-bars";
    row.setAttribute("role", "img");

    var j;
    for (j = 0; j < levels.length; j++) {
      var span = document.createElement("span");
      span.className = "hu-bar hu-bar--" + levels[j];
      span.title =
        levels[j] === "up"
          ? "Sin incidentes"
          : levels[j] === "degraded"
            ? "Degradado / caída parcial"
            : "Caído";
      row.appendChild(span);
    }

    var axis = document.createElement("div");
    axis.className = "hu-uptime-axis";
    axis.innerHTML =
      "<span>Hace " +
      DAYS +
      " días</span><span>" +
      pct +
      "% disponibilidad</span><span>Hoy</span>";

    wrap.appendChild(row);
    wrap.appendChild(axis);
    article.appendChild(wrap);
  }

  function enhance(sitesBySlug) {
    var sec = document.querySelector("section.live-status");
    if (!sec) return;
    var articles = sec.querySelectorAll("article.graph");
    var i;
    var art;
    var slug;
    var site;
    for (i = 0; i < articles.length; i++) {
      art = articles[i];
      slug = slugFromArticle(art);
      if (!slug || !sitesBySlug[slug]) continue;
      site = sitesBySlug[slug];
      renderStrip(art, site);
    }
  }

  function run() {
    fetch(SUMMARY_URL)
      .then(function (r) {
        return r.json();
      })
      .then(function (sites) {
        if (!Array.isArray(sites)) return;
        var bySlug = {};
        var i;
        for (i = 0; i < sites.length; i++) {
          if (sites[i].slug) bySlug[sites[i].slug] = sites[i];
        }

        var scheduled = false;
        var obs;

        function tick() {
          enhance(bySlug);
          var sec = document.querySelector("section.live-status");
          if (!sec || !obs) return;
          var arts = sec.querySelectorAll("article.graph");
          if (!arts.length) return;
          var j;
          var all = true;
          for (j = 0; j < arts.length; j++) {
            if (!arts[j].querySelector(".hu-uptime-strip")) {
              all = false;
              break;
            }
          }
          if (all) obs.disconnect();
        }

        function scheduleTick() {
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(function () {
            scheduled = false;
            tick();
          });
        }

        tick();
        obs = new MutationObserver(scheduleTick);
        obs.observe(document.documentElement, { childList: true, subtree: true });
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
