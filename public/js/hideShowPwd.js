let showPassword = false;
const ipnElement = document.querySelector("#pwd");
const ipnReElement = document.querySelector("#repwd");
const btnElement = document.querySelector("#btnPassword");
const btnReElement = document.querySelector("#btnRePassword");

btnElement.addEventListener("click", togglePassword);
btnReElement.addEventListener("click", toggleRePassword);

function togglePassword() {
  if (showPassword) {
    // Đang hiện password
    // Chuyển sang ẩn password
    ipnElement.setAttribute("type", "password");
    showPassword = false;
  } else {
    // Đang ẩn password
    // Chuyển sang hiện password
    ipnElement.setAttribute("type", "text");
    showPassword = true;
  }
}

function toggleRePassword() {
  if (showPassword) {
    // Đang hiện password
    // Chuyển sang ẩn password
    ipnReElement.setAttribute("type", "password");
    showPassword = false;
  } else {
    // Đang ẩn password
    // Chuyển sang hiện password
    ipnReElement.setAttribute("type", "text");
    showPassword = true;
  }
}
