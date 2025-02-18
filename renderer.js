document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("urlInput");
  const loadButton = document.getElementById("loadButton");
  const webview = document.getElementById("webview");
  const webviewContainer = document.getElementById("webview-container");
  const opacitySlider = document.getElementById("opacitySlider");
  const opacityValue = document.getElementById("opacityValue");
  const widthInput = document.getElementById("widthInput");
  const applyWidthButton = document.getElementById("applyWidth");
  const screenWidth = document.getElementById("screenWidth");

  // Browser controls
  const backBtn = document.getElementById("backBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomLevel = document.getElementById("zoomLevel");

  let currentZoom = 1.0;
  const ZOOM_INCREMENT = 0.1;
  const MAX_ZOOM = 5.0;
  const MIN_ZOOM = 0.2;

  // Navigation controls
  backBtn.addEventListener("click", () => {
    if (webview.canGoBack()) {
      webview.goBack();
    }
  });

  forwardBtn.addEventListener("click", () => {
    if (webview.canGoForward()) {
      webview.goForward();
    }
  });

  refreshBtn.addEventListener("click", () => {
    webview.reload();
  });

  // Zoom controls
  zoomInBtn.addEventListener("click", () => {
    handleZoom(currentZoom + ZOOM_INCREMENT);
  });

  zoomOutBtn.addEventListener("click", () => {
    handleZoom(currentZoom - ZOOM_INCREMENT);
  });

  // Handle zoom gestures (ctrl + mousewheel)
  webview.addEventListener("mousewheel", (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_INCREMENT : ZOOM_INCREMENT;
      handleZoom(currentZoom + delta);
    }
  });

  // Handle keyboard shortcuts for zoom
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        handleZoom(currentZoom + ZOOM_INCREMENT);
      } else if (e.key === "-") {
        e.preventDefault();
        handleZoom(currentZoom - ZOOM_INCREMENT);
      } else if (e.key === "0") {
        e.preventDefault();
        handleZoom(1.0); // Reset zoom
      }
    }
  });

  // Handle width control
  screenWidth.addEventListener("change", () => {
    const width = parseInt(screenWidth.value);
    if (width >= 320 && width <= 3840) {
      webview.style.width = `${width}px`;
    } else {
      alert("Please enter a width between 320 and 3840 pixels");
      screenWidth.value = "1440";
    }
  });

  // Handle width input on enter key
  screenWidth.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      screenWidth.blur(); // Remove focus to trigger change event
    }
  });

  function handleZoom(newZoom) {
    // Clamp zoom level between MIN_ZOOM and MAX_ZOOM
    newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));

    if (newZoom !== currentZoom) {
      currentZoom = newZoom;

      // Apply zoom using CSS transform instead of webview.setZoomLevel
      webview.style.transform = `scale(${newZoom})`;

      // Update the displayed zoom level
      zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  // URL loading
  loadButton.addEventListener("click", () => {
    const url = urlInput.value;
    if (url) {
      webview.src = url;
    }
  });

  opacitySlider.addEventListener("input", (e) => {
    const opacity = e.target.value;
    opacityValue.textContent = `${opacity}%`;
    webviewContainer.style.opacity = opacity / 100;
  });

  applyWidthButton?.addEventListener("click", () => {
    const width = parseInt(widthInput.value);
    if (width >= 320 && width <= 3840) {
      webview.style.width = `${width}px`;
    } else {
      alert("Please enter a width between 320 and 3840 pixels");
    }
  });

  urlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      loadButton.click();
    }
  });

  widthInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      applyWidthButton.click();
    }
  });

  // Webview events
  webview.addEventListener("did-start-loading", () => {
    refreshBtn.textContent = "⟳";
  });

  webview.addEventListener("did-stop-loading", () => {
    refreshBtn.textContent = "↻";
    urlInput.value = webview.getURL();
  });

  // Set initial opacity
  webviewContainer.style.opacity = opacitySlider.value / 100;

  // Add zoom reset button to zoom controls
  const zoomResetBtn = document.createElement("button");
  zoomResetBtn.textContent = "Reset";
  zoomResetBtn.addEventListener("click", () => handleZoom(1.0));
  document.querySelector(".zoom-controls").appendChild(zoomResetBtn);

  // Initialize webview with default width
  webview.style.width = "1440px";
});
