const itemForm = document.querySelector("#item-form");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const submitButton = document.querySelector("#submit-button");
const submitLabel = document.querySelector("#submit-label");
const cancelEditButton = document.querySelector("#cancel-edit");
const formError = document.querySelector("#form-error");
const editorCard = document.querySelector("#editor-card");
const itemList = document.querySelector("#item-list");
const toastRegion = document.querySelector("#toast-region");
const deleteDialog = document.querySelector("#delete-dialog");
const deleteItemName = document.querySelector("#delete-item-name");
const confirmDeleteButton = document.querySelector("#confirm-delete");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

let items = [];
let editingId = null;
let pendingDeleteId = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Something went wrong. Please try again.");
  return payload;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${type === "error" ? "!" : "✓"}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-dismiss" type="button" aria-label="Dismiss notification">×</button>
  `;

  const dismiss = () => {
    toast.classList.add("toast-leaving");
    window.setTimeout(() => toast.remove(), 230);
  };

  toast.querySelector(".toast-dismiss").addEventListener("click", dismiss);
  toastRegion.append(toast);
  window.requestAnimationFrame(() => toast.classList.add("toast-visible"));
  window.setTimeout(() => {
    if (toast.isConnected) dismiss();
  }, type === "error" ? 5200 : 3500);
}

function renderItems() {
  if (!items.length) {
    itemList.innerHTML = `<tr class="empty-row"><td colspan="4"><span class="empty-mark" aria-hidden="true">✳</span><strong>No items yet</strong><span>Add one above to get started.</span></td></tr>`;
    return;
  }

  itemList.innerHTML = items.map((item, index) => `
    <tr class="item-row${item.id === editingId ? " is-editing" : ""}" style="--row-index: ${index}" data-id="${item.id}">
      <td class="id-cell">${item.id}</td>
      <td class="name-cell"><span class="item-name"><span class="item-dot" aria-hidden="true"></span>${escapeHtml(item.name)}</span></td>
      <td class="price-cell">${currencyFormatter.format(item.price)}</td>
      <td class="action-cell"><div class="row-actions">
        <button class="action-button edit-button" type="button" data-action="edit" data-id="${item.id}">Edit</button>
        <button class="action-button delete-button" type="button" data-action="delete" data-id="${item.id}">Delete</button>
      </div></td>
    </tr>
  `).join("");
}

function setEditMode(item) {
  editingId = item.id;
  nameInput.value = item.name;
  priceInput.value = item.price;
  document.querySelector("#form-kicker").textContent = "UPDATE AN ITEM";
  document.querySelector("#form-title").textContent = "Edit details";
  submitLabel.textContent = "Update";
  cancelEditButton.hidden = false;
  editorCard.classList.add("is-editing");
  formError.hidden = true;
  renderItems();
  nameInput.focus();
  editorCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetForm() {
  editingId = null;
  itemForm.reset();
  document.querySelector("#form-kicker").textContent = "ADD AN ITEM";
  document.querySelector("#form-title").textContent = "Item details";
  submitLabel.textContent = "Submit";
  cancelEditButton.hidden = true;
  editorCard.classList.remove("is-editing");
  formError.hidden = true;
  renderItems();
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  submitButton.classList.toggle("is-loading", isBusy);
  submitButton.querySelector("svg").hidden = isBusy;
  submitLabel.textContent = isBusy ? (editingId === null ? "Adding…" : "Updating…") : (editingId === null ? "Submit" : "Update");
}

async function loadItems() {
  try {
    items = await requestJson("/api/items");
  } catch (error) {
    showToast(error.message || "Could not load items.", "error");
  }
  renderItems();
}

itemForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;
  if (!itemForm.reportValidity()) return;

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  if (!name) {
    formError.textContent = "Please enter an item name.";
    formError.hidden = false;
    nameInput.focus();
    return;
  }

  const wasEditing = editingId !== null;
  const url = wasEditing ? `/api/items/${editingId}` : "/api/items";
  setBusy(true);

  try {
    const savedItem = await requestJson(url, {
      method: wasEditing ? "PUT" : "POST",
      body: JSON.stringify({ name, price })
    });

    if (wasEditing) items = items.map((item) => item.id === savedItem.id ? savedItem : item);
    else items.push(savedItem);

    resetForm();
    showToast(wasEditing ? "Item updated successfully." : "Item added successfully.");
  } catch (error) {
    formError.textContent = error.message;
    formError.hidden = false;
    showToast(error.message, "error");
  } finally {
    setBusy(false);
  }
});

itemList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = items.find((entry) => entry.id === Number(button.dataset.id));
  if (!item) return;

  if (button.dataset.action === "edit") {
    setEditMode(item);
    return;
  }

  pendingDeleteId = item.id;
  deleteItemName.textContent = item.name;
  deleteDialog.showModal();
});

cancelEditButton.addEventListener("click", resetForm);
document.querySelector("#keep-item").addEventListener("click", () => deleteDialog.close());

confirmDeleteButton.addEventListener("click", async () => {
  if (pendingDeleteId === null) return;

  const item = items.find((entry) => entry.id === pendingDeleteId);
  confirmDeleteButton.disabled = true;
  confirmDeleteButton.textContent = "Deleting…";

  try {
    await requestJson(`/api/items/${pendingDeleteId}`, { method: "DELETE" });
    items = items.filter((entry) => entry.id !== pendingDeleteId);
    if (editingId === pendingDeleteId) resetForm();
    else renderItems();
    deleteDialog.close();
    showToast(`${item ? item.name : "Item"} deleted successfully.`);
  } catch (error) {
    showToast(error.message, "error");
    deleteDialog.close();
  } finally {
    pendingDeleteId = null;
    confirmDeleteButton.disabled = false;
    confirmDeleteButton.textContent = "Delete";
  }
});

deleteDialog.addEventListener("click", (event) => {
  if (event.target === deleteDialog) deleteDialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editingId !== null && !deleteDialog.open) resetForm();
});

loadItems();
