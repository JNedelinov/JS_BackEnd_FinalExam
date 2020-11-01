const sectionNoify = document.querySelector(".notifications");

let t;

sectionNoify.addEventListener("click", (e) => {
  sectionNoify.style.display = "none";
  sectionNoify.innerHTML = "";
  clearTimeout(t);
});

const setTimer = () => {
  t = setTimeout(() => {
    sectionNoify.style.display = "none";
    sectionNoify.innerHTML = "";
  }, 2000);
};

setTimer();