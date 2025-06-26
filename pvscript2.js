async function fetchAdditionalHtmlAnchors(query, pageUrls) {
  const lowerQuery = query.toLowerCase();

  for (const pageUrl of pageUrls) {
    try {
      const res = await fetch(pageUrl);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const anchors = doc.querySelectorAll('div.posters > a');

      anchors.forEach(anchor => {
        const alt = anchor.querySelector('img')?.alt?.toLowerCase() || '';
        const name = anchor.querySelector('h3')?.textContent?.toLowerCase() || '';
        const mouseAttr = (anchor.getAttribute('onmouseover') || '').toLowerCase();

        if (alt.includes(lowerQuery) || name.includes(lowerQuery) || mouseAttr.includes(lowerQuery)) {
          const wrapper = document.createElement('div');
          wrapper.className = 'poster-wrapper';

          const cloned = anchor.cloneNode(true);
          cloned.style.position = "relative";

          // Add loading bar
          const loadingBar = document.createElement("div");
          loadingBar.style.position = "absolute";
          loadingBar.style.top = "0";
          loadingBar.style.left = "0";
          loadingBar.style.height = "4px";
          loadingBar.style.width = "0%";
          loadingBar.style.background = "#00bcd4";
          loadingBar.style.transition = "width 1s ease";
          cloned.appendChild(loadingBar);

          // Determine video or iframe
          const overlay = cloned.querySelector(".overlay");
          const video = overlay?.querySelector("video");
          const iframe = overlay?.querySelector("iframe");
          let timeoutId;

          if (video) {
  const videoSrc = video.getAttribute("src");
  video.removeAttribute("src"); // don't preload

  let isTouch = false;

  // Desktop hover
  cloned.onmouseenter = () => {
    if (isTouch) return;
    loadingBar.style.width = "100%";
    timeoutId = setTimeout(() => {
      loadingBar.style.width = "0%";
      video.src = videoSrc;
      video.load();
      video.currentTime = 0;
      video.play();
    }, 1000);
  };

  cloned.onmouseleave = () => {
    if (isTouch) return;
    clearTimeout(timeoutId);
    video.pause();
    video.removeAttribute("src");
    video.load();
    loadingBar.style.width = "0%";
  };

  // Mobile touch
  cloned.addEventListener("touchstart", (e) => {
    if (!isTouch) {
      isTouch = true;
      e.preventDefault(); // prevent click-through
      loadingBar.style.width = "100%";
      timeoutId = setTimeout(() => {
        loadingBar.style.width = "0%";
        video.src = videoSrc;
        video.load();
        // Add play button overlay on mobile
const playBtn = document.createElement("div");
playBtn.textContent = "▶ Play";
playBtn.style.position = "absolute";
playBtn.style.top = "50%";
playBtn.style.left = "50%";
playBtn.style.transform = "translate(-50%, -50%)";
playBtn.style.color = "white";
playBtn.style.fontSize = "20px";
playBtn.style.padding = "6px 12px";
playBtn.style.background = "rgba(0, 0, 0, 0.6)";
playBtn.style.borderRadius = "5px";
playBtn.style.display = "none";
playBtn.style.zIndex = "10";
cloned.appendChild(playBtn);

// Detect mobile device
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isMobile) {
  playBtn.style.display = "block";

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    playBtn.style.display = "none";
    video.src = videoSrc;
    video.load();
    video.currentTime = 0;
    video.play();
  });
}

        video.currentTime = 0;
        video.play();
      }, 500);
    }
  });

  cloned.addEventListener("touchend", (e) => {
    setTimeout(() => {
      if (isTouch) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        loadingBar.style.width = "0%";
        isTouch = false;
      }
    }, 3000); // Optional: stop video after 3 sec or when user taps away
  });


} else if (iframe) {
  const iframeSrc = (cloned.getAttribute("onmouseover") || "")
    .match(/playvideo\(event,\s*'([^']+)'/)?.[1] || "";

  cloned.onmouseenter = () => {
    loadingBar.style.width = "100%";
    timeoutId = setTimeout(() => {
      loadingBar.style.width = "0%"; // ✅ reset after loading iframe
      iframe.src = iframeSrc;
    }, 1000);
  };
  cloned.onmouseleave = () => {
    clearTimeout(timeoutId);
    iframe.src = "empty";
    loadingBar.style.width = "0%";
  };
}


          wrapper.appendChild(cloned);
          resultsContainer.appendChild(wrapper);
        }
      });

    } catch (err) {
      console.error('Failed to parse raw HTML:', pageUrl, err);
    }
  }
}
