/*
 * Huntle game logic and UI.
 */
(function () {
  "use strict";
  const C = window.HUNTLE_CONFIG;
  const D = window.HuntleDaily;
  const A = window.HuntleAudio;
  const WEAPONS = window.HUNTLE_WEAPONS;
  const byId = new Map(WEAPONS.map((w) => [w.id, w]));
  const N = C.roundsPerDay;
  const SQUARES = { correct: "🟩", partial: "🟨", wrong: "🟥" };
  const VERDICTS = {
    correct: "Direct hit!",
    partial: "Close. Right gun, wrong variant.",
    wrong: "Missed.",
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    },
  };

  // ?day=7 previews puzzle #7 without touching stats. ?reset=1 clears saved data.
  const params = new URLSearchParams(location.search);
  const previewNo = parseInt(params.get("day"), 10);
  const preview = Number.isFinite(previewNo);
  const STATE_KEY = preview ? "huntle:preview" : "huntle:state";
  const STATS_KEY = "huntle:stats";

  let puzzle;
  let state; // { number, guesses: [{ guess, result }] }
  let selected = null;
  let category = "all";
  let query = "";
  let revealing = false;

  // ---------- helpers ----------

  function grade(guessId, answerId) {
    if (guessId === answerId) return "correct";
    const g = byId.get(guessId);
    const a = byId.get(answerId);
    if (g && a && g.soundGroup && g.soundGroup === a.soundGroup) return "correct";
    if (g && a && g.family && g.family === a.family) return "partial";
    return "wrong";
  }

  // Other weapons that sound identical to this one, so also count as correct.
  function soundAlikes(w) {
    if (!w.soundGroup) return [];
    return WEAPONS.filter((o) => o.id !== w.id && o.soundGroup === w.soundGroup);
  }

  function score() {
    return state.guesses.filter((g) => g.result === "correct").length;
  }

  function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w[0]))
      .slice(0, 3)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  function catLabel(key) {
    const c = C.categories.find((c) => c[0] === key);
    return c ? c[2] || c[1] : "";
  }

  function weaponImage(w, size) {
    const wrap = el("div", "thumb" + (size ? " " + size : ""));
    const img = new Image();
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => {
      img.remove();
      wrap.classList.add("noimg");
      wrap.appendChild(el("span", "initials", initials(w.name)));
    };
    img.src = C.imageDir + (w.image || w.id + C.imageExt);
    wrap.appendChild(img);
    return wrap;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // ---------- audio ----------

  function playWeapon(id, btn) {
    $$(".is-playing").forEach((b) => b.classList.remove("is-playing"));
    A.play(byId.get(id), {
      onStart: () => btn.classList.add("is-playing"),
      onEnd: () => btn.classList.remove("is-playing"),
      onMissing: (synth) => {
        // Deliberately generic, so the note never gives the answer away.
        const note = $("#audio-note");
        note.hidden = false;
        note.textContent = synth
          ? "Sound file not added yet. Playing a placeholder shot."
          : "Sound file not found.";
      },
    });
  }

  function currentRound() {
    return revealing ? state.guesses.length - 1 : state.guesses.length;
  }

  // ---------- rendering ----------

  function buildChips() {
    const wrap = $("#cats");
    C.categories.forEach(([key, label]) => {
      const b = el("button", "chip", label);
      b.setAttribute("role", "tab");
      b.dataset.cat = key;
      b.setAttribute("aria-selected", key === category);
      b.addEventListener("click", () => {
        category = key;
        $$(".chip").forEach((c) => c.setAttribute("aria-selected", c.dataset.cat === key));
        filterGrid();
      });
      wrap.appendChild(b);
    });
  }

  function buildGrid() {
    const grid = $("#grid");
    const sorted = WEAPONS.slice().sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach((w) => {
      const card = el("button", "card");
      card.setAttribute("role", "option");
      card.dataset.id = w.id;
      card.dataset.search = normalize([w.name].concat(w.aliases || []).join(" "));
      card.append(weaponImage(w), el("span", "name", w.name));
      card.addEventListener("click", () => {
        selected = w.id;
        render();
      });
      card.addEventListener("dblclick", () => {
        selected = w.id;
        submit();
      });
      grid.appendChild(card);
    });
  }

  function visibleCards() {
    return Array.from($$("#grid .card")).filter((c) => !c.hidden);
  }

  function filterGrid() {
    const q = normalize(query);
    $$("#grid .card").forEach((card) => {
      const w = byId.get(card.dataset.id);
      const catOk = category === "all" || w.category === category;
      const qOk = !q || q.split(" ").every((part) => card.dataset.search.includes(part));
      card.hidden = !(catOk && qOk);
    });
    $("#empty").hidden = visibleCards().length > 0;
  }

  function renderProgress() {
    const ol = $("#progress");
    ol.replaceChildren();
    for (let i = 0; i < N; i++) {
      const li = el("li");
      const g = state.guesses[i];
      if (g) li.className = g.result;
      else if (i === state.guesses.length) li.className = "current";
      li.setAttribute("aria-label", `Shot ${i + 1}: ${g ? g.result : "not played"}`);
      ol.appendChild(li);
    }
  }

  function renderFeedback(r) {
    const g = state.guesses[r];
    const answer = byId.get(puzzle.answers[r]);
    const guess = byId.get(g.guess);
    const fb = $("#feedback");
    fb.replaceChildren(
      el("p", "verdict " + g.result, VERDICTS[g.result]),
      el("p", "eyebrow", "It was"),
      weaponImage(answer, "lg"),
      el("p", "reveal-name", answer.name),
      el("p", "muted small", catLabel(answer.category))
    );
    const alikes = soundAlikes(answer);
    if (alikes.length) {
      fb.appendChild(el("p", "muted small", "Sounds identical, also accepted: " + alikes.map((o) => o.name).join(", ")));
    }
    if (g.guess !== answer.id) {
      fb.appendChild(el("p", "your-guess", "Your guess: " + (guess ? guess.name : g.guess)));
    }
  }

  function renderSummary() {
    $("#sum-title").textContent = `Huntle #${puzzle.number}`;
    $("#sum-score").textContent = `${score()}/${N}`;
    $("#sum-squares").textContent = state.guesses.map((g) => SQUARES[g.result]).join("");
    const s = score();
    $("#sum-line").textContent =
      s === N ? "Perfect ears. Every shot named." : s >= N - 2 ? "Sharp hearing, hunter." : "The bayou is loud. Try again tomorrow.";

    const list = $("#sum-list");
    list.replaceChildren();
    puzzle.answers.forEach((id, i) => {
      const w = byId.get(id);
      const g = state.guesses[i];
      const li = el("li", "sum-row " + g.result);
      const btn = el("button", "mini-play");
      btn.setAttribute("aria-label", "Play " + w.name);
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
      btn.addEventListener("click", () => playWeapon(id, btn));
      const text = el("div", "sum-text");
      text.appendChild(el("span", "sum-name", w.name));
      if (g.guess !== id) {
        const gw = byId.get(g.guess);
        text.appendChild(el("span", "muted small", "You said " + (gw ? gw.name : g.guess)));
      }
      li.append(btn, weaponImage(w, "sm"), text, el("span", "mark", SQUARES[g.result]));
      list.appendChild(li);
    });
  }

  function render() {
    const g = state.guesses.length;
    const done = g >= N && !revealing;
    renderProgress();
    $("#play-view").hidden = done;
    $("#summary-view").hidden = !done;
    $("#action-bar").hidden = done;
    if (done) return renderSummary();

    const r = currentRound();
    $("#round-label").textContent = `Shot ${r + 1} of ${N}`;
    $("#picker").hidden = revealing;
    $("#feedback").hidden = !revealing;
    const submitBtn = $("#btn-submit");
    const label = $("#selected-label");

    if (revealing) {
      renderFeedback(r);
      submitBtn.textContent = g >= N ? "See results" : "Next shot";
      submitBtn.disabled = false;
      label.textContent = `Score ${score()}/${g}`;
      label.classList.remove("has");
    } else {
      submitBtn.textContent = "Lock in";
      submitBtn.disabled = !selected;
      label.textContent = selected ? byId.get(selected).name : "Pick a weapon";
      label.classList.toggle("has", !!selected);
      $$("#grid .card").forEach((c) => c.setAttribute("aria-selected", c.dataset.id === selected));
    }
  }

  // ---------- actions ----------

  function submit() {
    if (revealing) {
      revealing = false;
      selected = null;
      A.stop();
      $("#audio-note").hidden = true;
      query = "";
      $("#search").value = "";
      filterGrid();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!selected || state.guesses.length >= N) return;
    const answer = puzzle.answers[state.guesses.length];
    state.guesses.push({ guess: selected, result: grade(selected, answer) });
    store.set(STATE_KEY, state);
    if (state.guesses.length === N) recordStats();
    revealing = true;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function loadStats() {
    const s = store.get(STATS_KEY, null) || {};
    return {
      played: s.played || 0,
      total: s.total || 0,
      // Shots that were green or yellow. Stats saved before this was tracked
      // only know the green ones, so fall back to that.
      hits: s.hits == null ? s.total || 0 : s.hits,
      streak: s.streak || 0,
      maxStreak: s.maxStreak || 0,
      last: s.last == null ? null : s.last,
      dist: Array.from({ length: N + 1 }, (_, i) => (s.dist && s.dist[i]) || 0),
    };
  }

  function recordStats() {
    if (preview) return;
    const s = loadStats();
    if (s.last === puzzle.number) return;
    s.played += 1;
    s.total += score();
    s.hits += state.guesses.filter((g) => g.result !== "wrong").length;
    s.streak = s.last === puzzle.number - 1 ? s.streak + 1 : 1;
    s.maxStreak = Math.max(s.maxStreak, s.streak);
    s.last = puzzle.number;
    s.dist[score()] += 1;
    store.set(STATS_KEY, s);
  }

  function renderStats() {
    const s = loadStats();
    // A streak only counts if the last game played was today's or yesterday's.
    const live = s.last != null && s.last >= D.currentNumber() - 1 ? s.streak : 0;
    $("#st-played").textContent = s.played;
    // Share of all shots ever played that were green or yellow.
    $("#st-avg").textContent = (s.played ? Math.round((s.hits / (s.played * N)) * 100) : 0) + "%";
    $("#st-streak").textContent = live;
    $("#st-max").textContent = s.maxStreak;
    const max = Math.max(1, ...s.dist);
    const finished = state.guesses.length >= N;
    const dist = $("#st-dist");
    dist.replaceChildren();
    for (let i = N; i >= 0; i--) {
      const row = el("div", "dist-row");
      const bar = el("div", "dist-bar", String(s.dist[i]));
      bar.style.width = Math.max(8, (s.dist[i] / max) * 100) + "%";
      if (finished && !preview && i === score()) bar.classList.add("today");
      row.append(el("span", "dist-label", String(i)), bar);
      dist.appendChild(row);
    }
  }

  async function share() {
    const url = C.shareUrl || location.origin + location.pathname;
    const text = `Huntle #${puzzle.number} ${score()}/${N}\n${state.guesses.map((g) => SQUARES[g.result]).join("")}\n${url}`;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch (e) {
      const ta = el("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("Copied to clipboard");
    }
  }

  // ---------- themes ----------

  function currentTheme() {
    return document.documentElement.dataset.theme || "default";
  }

  // Match the phone's browser bar to the page background.
  function syncThemeColor() {
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    $('meta[name="theme-color"]').setAttribute("content", bg);
  }

  function applyTheme(id) {
    if (id === "default") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = id;
    // Stored as plain text (not JSON) because the script in <head> reads it.
    try {
      localStorage.setItem("huntle:theme", id);
    } catch (e) {}
    syncThemeColor();
    $$(".theme-option").forEach((b) => b.setAttribute("aria-checked", b.dataset.theme === id));
  }

  function buildThemeList() {
    // Ignore a saved theme that no longer exists.
    if (!C.themes.some((t) => t.id === currentTheme())) delete document.documentElement.dataset.theme;
    syncThemeColor();
    const list = $("#theme-list");
    C.themes.forEach((t) => {
      const b = el("button", "theme-option");
      b.setAttribute("role", "radio");
      b.dataset.theme = t.id;
      b.setAttribute("aria-checked", t.id === currentTheme());
      const sw = el("span", "swatches");
      t.swatches.forEach((c) => {
        const dot = el("span", "swatch");
        dot.style.background = c;
        sw.appendChild(dot);
      });
      b.append(sw, el("span", "theme-name", t.name));
      b.addEventListener("click", () => applyTheme(t.id));
      list.appendChild(b);
    });
  }

  function openDialog(id) {
    const d = $(id);
    if (id === "#dlg-stats") renderStats();
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
  }

  function tick() {
    const ms = Math.max(0, D.nextResetMs() - Date.now());
    const s = Math.floor(ms / 1000);
    const text = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    $$(".countdown").forEach((c) => (c.textContent = text));
    // A new day started while the page was open: load the new puzzle.
    if (!preview && D.currentNumber() !== puzzle.number) location.reload();
  }

  function bindEvents() {
    $("#btn-play").addEventListener("click", (e) => playWeapon(puzzle.answers[currentRound()], e.currentTarget));
    $("#btn-submit").addEventListener("click", submit);
    $("#btn-help").addEventListener("click", () => openDialog("#dlg-help"));
    $("#btn-stats").addEventListener("click", () => openDialog("#dlg-stats"));
    $("#btn-settings").addEventListener("click", () => openDialog("#dlg-settings"));
    $("#btn-sum-stats").addEventListener("click", () => openDialog("#dlg-stats"));
    $("#btn-share").addEventListener("click", share);

    const search = $("#search");
    search.addEventListener("input", () => {
      query = search.value;
      filterGrid();
    });
    search.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const cards = visibleCards();
      if (cards.length === 1) {
        selected = cards[0].dataset.id;
        render();
        search.blur();
      } else if (selected) {
        submit();
      }
    });

    $$("dialog").forEach((d) => {
      d.addEventListener("click", (e) => {
        if (e.target === d || e.target.hasAttribute("data-close")) d.close();
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") tick();
    });
  }

  function init() {
    if (params.has("reset")) {
      ["huntle:state", "huntle:preview", STATS_KEY, "huntle:seenHelp"].forEach(store.remove);
      // Drop ?reset from the address bar so a reload doesn't wipe progress again.
      params.delete("reset");
      const qs = params.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }

    puzzle = preview ? D.puzzleForNumber(previewNo) : D.today();
    const missing = puzzle.answers.filter((id) => !byId.has(id));
    if (missing.length || puzzle.answers.length !== N) {
      document.body.textContent = "Huntle setup error: puzzle " + puzzle.number + " has unknown or missing weapon ids: " + missing.join(", ");
      return;
    }

    const saved = store.get(STATE_KEY, null);
    state = saved && saved.number === puzzle.number && Array.isArray(saved.guesses) ? saved : { number: puzzle.number, guesses: [] };

    $("#puzzle-no").textContent = `#${puzzle.number}` + (preview ? " · preview" : "");
    $$(".rounds-count").forEach((e) => (e.textContent = N));
    $$(".reset-note").forEach((e) => (e.textContent = `A new set of shots every day at ${C.resetHour === 0 ? "midnight" : pad(C.resetHour) + ":00"}, Argentina time.`));

    buildThemeList();
    buildChips();
    buildGrid();
    filterGrid();
    bindEvents();
    render();

    if (!store.get("huntle:seenHelp", false)) {
      openDialog("#dlg-help");
      store.set("huntle:seenHelp", true);
    }
    tick();
    setInterval(tick, 1000);
  }

  init();
})();
