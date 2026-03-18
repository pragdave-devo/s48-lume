/**
 * NeuralGraph — animated neural network canvas visualization.
 * Pure JS, no framework dependencies. Supports "hero" and "background" modes.
 */
(function () {
  function initNeuralGraph(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var mode = canvas.dataset.mode || "hero";
    var isSubtle = mode === "background";

    var width = 0;
    var height = 0;
    var mouseX = -1000;
    var mouseY = -1000;
    var isDark = false;

    var NODE_COUNT = isSubtle ? 50 : 80;
    var CONNECTION_DIST = isSubtle ? 140 : 160;
    var MOUSE_RADIUS = isSubtle ? 180 : 200;
    var SPEED = isSubtle ? 1 : 0.5;
    var MAX_SIGNALS = isSubtle ? 8 : 15;

    function getOpacity() {
      var lightBoost = !isDark && isSubtle;
      return {
        connAlpha: isSubtle ? (lightBoost ? 0.12 : 0.06) : 0.15,
        nodeAlphaBase: isSubtle ? (lightBoost ? 0.25 : 0.12) : 0.3,
        mouseConnBoost: isSubtle ? (lightBoost ? 0.18 : 0.1) : 0.25,
        mouseNodeBoost: isSubtle ? (lightBoost ? 0.35 : 0.2) : 0.5,
        signalAlpha: isSubtle ? (lightBoost ? 0.5 : 0.3) : 0.6,
        signalGlowAlpha: isSubtle ? (lightBoost ? 0.15 : 0.08) : 0.2,
        glowThreshold: isSubtle ? 0.3 : 0.2,
        glowAlpha: isSubtle ? (lightBoost ? 0.12 : 0.06) : 0.15,
      };
    }

    var nodes = [];
    var signals = [];

    function detectTheme() {
      var root = document.documentElement;
      var theme = root.getAttribute("data-theme");
      if (theme) {
        isDark = theme === "dark";
      } else {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    }

    function getColors() {
      if (isDark) {
        return {
          node: "148, 163, 184",
          connection: "148, 163, 184",
          signal: "96, 165, 250",
          glow: "96, 165, 250",
        };
      }
      return {
        node: "71, 85, 105",
        connection: "100, 116, 139",
        signal: "37, 99, 235",
        glow: "37, 99, 235",
      };
    }

    function resize() {
      if (mode === "hero") {
        var parent = canvas.parentElement;
        var rect = parent.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      var dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      detectTheme();
      resize();
      nodes = [];
      signals = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3 * SPEED,
          vy: (Math.random() - 0.5) * 0.3 * SPEED,
          radius: Math.random() * 1.5 + 1,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: (0.01 + Math.random() * 0.02) * SPEED,
        });
      }
    }

    function spawnSignal() {
      if (signals.length > MAX_SIGNALS) return;
      var i = Math.floor(Math.random() * nodes.length);
      for (var j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DIST) {
          signals.push({
            fromIdx: i,
            toIdx: j,
            progress: 0,
            speed: (0.008 + Math.random() * 0.012) * SPEED,
            active: true,
          });
          return;
        }
      }
    }

    function draw() {
      detectTheme();
      var colors = getColors();
      var op = getOpacity();
      ctx.clearRect(0, 0, width, height);

      for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        node.pulsePhase += node.pulseSpeed;
        var dmx = mouseX - node.x;
        var dmy = mouseY - node.y;
        var mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mouseDist < MOUSE_RADIUS && mouseDist > 0) {
          var force = (1 - mouseDist / MOUSE_RADIUS) * 0.02;
          node.vx += (dmx / mouseDist) * force;
          node.vy += (dmy / mouseDist) * force;
        }
        node.vx *= 0.99;
        node.vy *= 0.99;
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            var alpha = (1 - dist / CONNECTION_DIST) * op.connAlpha;
            var midX = (nodes[i].x + nodes[j].x) / 2;
            var midY = (nodes[i].y + nodes[j].y) / 2;
            var mDist = Math.sqrt(
              (midX - mouseX) * (midX - mouseX) +
                (midY - mouseY) * (midY - mouseY)
            );
            var mouseBoost =
              mDist < MOUSE_RADIUS
                ? (1 - mDist / MOUSE_RADIUS) * op.mouseConnBoost
                : 0;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle =
              "rgba(" + colors.connection + ", " + (alpha + mouseBoost) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        var r = node.radius * pulse;
        var mDist = Math.sqrt(
          (node.x - mouseX) * (node.x - mouseX) +
            (node.y - mouseY) * (node.y - mouseY)
        );
        var mouseGlow =
          mDist < MOUSE_RADIUS ? 1 - mDist / MOUSE_RADIUS : 0;
        var alpha = op.nodeAlphaBase + mouseGlow * op.mouseNodeBoost;
        if (mouseGlow > op.glowThreshold) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
          ctx.fillStyle =
            "rgba(" + colors.glow + ", " + mouseGlow * op.glowAlpha + ")";
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + colors.node + ", " + alpha + ")";
        ctx.fill();
      }

      if (Math.random() < (isSubtle ? 0.02 : 0.05)) spawnSignal();

      for (var s = 0; s < signals.length; s++) {
        var sig = signals[s];
        if (!sig.active) continue;
        sig.progress += sig.speed;
        if (sig.progress >= 1) {
          sig.active = false;
          continue;
        }
        var from = nodes[sig.fromIdx];
        var to = nodes[sig.toIdx];
        var x = from.x + (to.x - from.x) * sig.progress;
        var y = from.y + (to.y - from.y) * sig.progress;
        var glowAlpha = Math.sin(sig.progress * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, isSubtle ? 2 : 3, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" + colors.signal + ", " + glowAlpha * op.signalAlpha + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, isSubtle ? 5 : 8, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" +
          colors.signal +
          ", " +
          glowAlpha * op.signalGlowAlpha +
          ")";
        ctx.fill();
      }

      signals = signals.filter(function (s) {
        return s.active;
      });
      requestAnimationFrame(draw);
    }

    var trackElement = mode === "hero" ? canvas.parentElement : document;
    trackElement.addEventListener("mousemove", function (e) {
      if (mode === "hero") {
        var rect = canvas.parentElement.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    });

    if (mode === "hero") {
      canvas.parentElement.addEventListener("mouseleave", function () {
        mouseX = -1000;
        mouseY = -1000;
      });
    }

    window.addEventListener("resize", resize);
    var observer = new MutationObserver(function () {
      detectTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        detectTheme();
      });

    init();
    draw();
  }

  document
    .querySelectorAll(".neural-graph")
    .forEach(initNeuralGraph);
})();
