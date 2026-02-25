const monthYear = document.getElementById("monthYear");
const datesContainer = document.getElementById("dates");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let date = new Date();

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.innerText = date.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  datesContainer.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    datesContainer.innerHTML += "<div></div>";
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.innerText = i;

    if (
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      day.classList.add("today");
    }

    datesContainer.appendChild(day);
  }
}

prevBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();