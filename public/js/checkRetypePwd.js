const check = () => {
  if (
    document.getElementById("pwd").value ==
    document.getElementById("repwd").value
  ) {
    document.getElementById("message").style.color = "green";
    document.getElementById("message").innerHTML = "Matching";
    document.getElementById("submit_acc").disabled = false;
  } else {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").innerHTML = "Not matching";
    document.getElementById("submit_acc").disabled = true;
  }
};
