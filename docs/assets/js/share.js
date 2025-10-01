(function () {
  const PLAY_URL = "https://play.google.com/store/apps/details?id=com.hogo.budgetix";
  const SITE_URL = window.location.href.split("#")[0];

  const $ = (id) => document.getElementById(id);
  const enc = encodeURIComponent;

  // Текст для шаринга
  const title = document.title || "Budgetix — Offline budgeting";
  const metaDesc = document.querySelector('meta[name="description"]');
  const text = (metaDesc?.content || "Private budget, custom cards, one-time Premium.") + " ";

  // UTM к Play (по желанию)
  const play = new URL(PLAY_URL);
  play.searchParams.set("utm_source", "share");
  play.searchParams.set("utm_medium", "web");
  const PLAY_SHARED = play.toString();

  // Классические кнопки → ведут в Play
  const x  = $("share-x");   if (x)  x.href  = "https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(PLAY_SHARED);
  const tg = $("share-tg");  if (tg) tg.href = "https://t.me/share/url?url=" + enc(PLAY_SHARED) + "&text=" + enc(title + " — " + text);
  const wa = $("share-wa");  if (wa) wa.href = "https://wa.me/?text=" + enc(title + " — " + text + PLAY_SHARED);
  const fb = $("share-fb");  if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + enc(PLAY_SHARED);

  // Email: и Play, и сайт
  const mail = $("share-mail");
  if (mail) mail.href = "mailto:?subject=" + enc(title) +
    "&body=" + enc(text + "\nGoogle Play: " + PLAY_SHARED + "\nWebsite: " + SITE_URL);

  // Native Web Share (мобилки): url — Play; сайт добавим в текст
  const nativeBtn = $("share-native");
  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.addEventListener("click", () => {
        navigator.share({ title, text: text + "Website: " + SITE_URL, url: PLAY_SHARED }).catch(()=>{});
      });
    } else {
      nativeBtn.style.display = "none";
    }
  }

  // Copy link → Play
  const copyBtn = $("share-copy");
  const toast = $("share-toast");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await (navigator.clipboard?.writeText(PLAY_SHARED) ?? Promise.reject());
        showToast("Link copied ✔");
      } catch { showToast("Copy failed"); }
    });
  }
  function showToast(msg){ if(!toast){alert(msg);return;} toast.textContent=msg; toast.style.display="block"; setTimeout(()=>toast.style.display="none",1800); }
})();