const editor = document.getElementById("editor");
const cursor = document.getElementById("custom-cursor");

// Ensure no duplicate markers
function clearOldMarker() {
  const old = document.getElementById("cursor-marker");
  if (old) old.remove();
}

function updateCursorPosition() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0).cloneRange();
  clearOldMarker();

  const marker = document.createElement("span");
  marker.id = "cursor-marker";
  marker.textContent = "\u200b"; // Zero-width space
  marker.style.display = "inline-block";
  marker.style.width = "1px";
  marker.style.height = "1em";

  range.insertNode(marker);

  const markerRect = marker.getBoundingClientRect();
  const containerRect = editor.getBoundingClientRect();

  const top = markerRect.top - containerRect.top + editor.scrollTop;
  const left = markerRect.left - containerRect.left + editor.scrollLeft;

  cursor.style.transform = `translate(${left}px, ${top}px)`;

  clearOldMarker();
}

["input", "click", "keyup"].forEach(event =>
  editor.addEventListener(event, () => requestAnimationFrame(updateCursorPosition))
);

// Initial position
setTimeout(updateCursorPosition, 50);
