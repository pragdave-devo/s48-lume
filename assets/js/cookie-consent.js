/**
 * CookieConsent — banner with Accept/Decline, optional Google Analytics loading.
 * Pure JS, no framework dependencies.
 */
(function () {
  var COOKIE_NAME = "cookie_consent";
  var banner = document.getElementById("cookie-banner");
  var acceptBtn = document.getElementById("cookie-accept");
  var declineBtn = document.getElementById("cookie-decline");

  // GA ID is read from a data attribute on the banner element
  var gaId = banner ? banner.dataset.gaId || "" : "";

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name +
      "=" +
      value +
      ";expires=" +
      d.toUTCString() +
      ";path=/;SameSite=Lax";
  }

  function loadGA() {
    if (!gaId) return;
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", gaId);
  }

  function hideBanner() {
    if (banner) banner.setAttribute("data-hidden", "");
  }

  var consent = getCookie(COOKIE_NAME);
  if (consent === "accepted") {
    hideBanner();
    loadGA();
  } else if (consent === "declined") {
    hideBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      setCookie(COOKIE_NAME, "accepted", 365);
      hideBanner();
      loadGA();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      setCookie(COOKIE_NAME, "declined", 365);
      hideBanner();
    });
  }
})();
