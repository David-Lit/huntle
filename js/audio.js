/*
 * Plays weapon sounds. If a file is missing and placeholderAudio is on, it
 * synthesizes a gunshot instead (each weapon gets a slightly different one).
 */
(function () {
  "use strict";
  const C = window.HUNTLE_CONFIG;
  const failed = new Set();
  let ctx = null;
  let current = null; // HTMLAudioElement or synth handle

  function src(w) {
    return C.audioDir + (w.audio || w.id + C.audioExt);
  }

  function stop() {
    if (!current) return;
    current.stop();
    current = null;
  }

  function play(w, cb) {
    cb = cb || {};
    stop();
    if (failed.has(w.id)) return fallback(w, cb);

    const el = new Audio(src(w));
    const handle = {
      stop() {
        el.pause();
      },
    };
    current = handle;
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      failed.add(w.id);
      if (current === handle) current = null;
      fallback(w, cb);
    };
    el.addEventListener("error", fail, { once: true });
    el.addEventListener("ended", () => {
      if (current === handle) current = null;
      cb.onEnd && cb.onEnd();
    });
    el.play()
      .then(() => {
        settled = true;
        cb.onStart && cb.onStart();
      })
      .catch((err) => {
        if (err && err.name === "NotAllowedError") {
          settled = true;
          cb.onEnd && cb.onEnd();
          return;
        }
        fail();
      });
  }

  function fallback(w, cb) {
    if (!C.placeholderAudio) {
      cb.onMissing && cb.onMissing(false);
      cb.onEnd && cb.onEnd();
      return;
    }
    cb.onMissing && cb.onMissing(true);
    synth(w, cb);
  }

  function synth(w, cb) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return cb.onEnd && cb.onEnd();
    ctx = ctx || new AC();
    if (ctx.state === "suspended") ctx.resume();

    const h = window.HuntleDaily.hashStr(w.id);
    const shots = h % 4 === 0 ? 2 : 1;
    const cutoff = 600 + (h % 3000);
    const decay = 0.2 + ((h >>> 5) % 50) / 100;
    const gap = 0.32;
    const dur = (shots - 1) * gap + decay * 2 + 0.1;

    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.ceil(sr * decay * 2), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const nodes = [];
    const t0 = ctx.currentTime + 0.02;
    for (let s = 0; s < shots; s++) {
      const t = t0 + s * gap;

      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(cutoff * 2, t);
      filter.frequency.exponentialRampToValueAtTime(cutoff / 3, t + decay);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + decay * 2);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(t);
      noise.stop(t + decay * 2);
      nodes.push(noise);

      const thump = ctx.createOscillator();
      thump.frequency.setValueAtTime(120, t);
      thump.frequency.exponentialRampToValueAtTime(40, t + 0.2);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.8, t);
      tg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      thump.connect(tg).connect(ctx.destination);
      thump.start(t);
      thump.stop(t + 0.3);
      nodes.push(thump);
    }

    const handle = {
      stop() {
        nodes.forEach((n) => {
          try {
            n.stop();
          } catch (e) {}
        });
      },
    };
    current = handle;
    cb.onStart && cb.onStart();
    setTimeout(() => {
      if (current === handle) {
        current = null;
        cb.onEnd && cb.onEnd();
      }
    }, dur * 1000);
  }

  window.HuntleAudio = { play, stop, src };
})();
