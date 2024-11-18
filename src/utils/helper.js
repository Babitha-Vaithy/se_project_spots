export function setButtonText(button, isLoading) {
  if (isLoading) {
    button.textContent = "Saving...";
  } else {
    button.textContent = "Save";
  }
}

export function setDeleteButtonText(button, isLoading) {
  if (isLoading) {
    button.textContent = "Deleting...";
  } else {
    button.textContent = "Delete";
  }
}
