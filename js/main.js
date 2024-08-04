/* jshint esversion: 8 */
/* globals html2pdf */
import "../css/style.css";
import "../css/media.css";
import "../css/animations.css";

document.addEventListener("DOMContentLoaded", () => {
  initializeRippleEffect();
  initializeContentEditable();
  initializeDownloadPDFButton();
});

function initializeRippleEffect() {
  document.addEventListener("pointerdown", handlePointerDown);
}

function handlePointerDown(mouseEvent) {
  const elementWithRipple = mouseEvent.target.closest(".ripple-effect");
  if (elementWithRipple) {
    createRipple(elementWithRipple, mouseEvent);
  }
}

function createRipple(elementWithRipple, mouseEvent) {
  const rippleEl = document.createElement("div");
  rippleEl.classList.add("ripple");

  const { left, top } = elementWithRipple.getBoundingClientRect();
  const x = mouseEvent.clientX - left - 10;
  const y = mouseEvent.clientY - top - 10;

  setPosition(rippleEl, x, y);
  appendRipple(elementWithRipple, rippleEl);
}

function setPosition(rippleEl, x, y) {
  rippleEl.style.left = `${x}px`;
  rippleEl.style.top = `${y}px`;
}

function appendRipple(elementWithRipple, rippleEl) {
  elementWithRipple.appendChild(rippleEl);
  requestAnimationFrame(() => {
    rippleEl.classList.add("run");
  });
  rippleEl.addEventListener("transitionend", () => {
    rippleEl.remove();
  });
}

function initializeContentEditable() {
  document
    .querySelectorAll('[contenteditable="true"]')
    .forEach(setupContentEditable);
}

function setupContentEditable(element) {
  const key = element.getAttribute("data-key");
  if (!key) {
    console.error("Element does not have a data-key:", element);
    return;
  }

  const savedData = localStorage.getItem(key);
  if (savedData) {
    element.innerText = savedData;
  }

  element.addEventListener("input", () =>
    handleContentEditableInput(element, key),
  );
}

function handleContentEditableInput(element, key) {
  localStorage.setItem(key, element.innerText);
  markAsEdited(element);
}

function markAsEdited(element) {
  element.classList.add("edited");
  setTimeout(() => {
    element.classList.remove("edited");
  }, 150);
}

function initializeDownloadPDFButton() {
  const downloadBtn = document.getElementById("download-pdf");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadPDF);
  }
}

function downloadPDF() {
  const element = document.getElementById("app");
  const opt = getPDFOptions();
  html2pdf().from(element).set(opt).save();
}

function getPDFOptions() {
  return {
    margin: 1,
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  };
}
