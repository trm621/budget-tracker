function populateTotal() {
  let total = transactions.reduce((total, t) => {
    return total + Number(t.value);
  }, 0);

  document.querySelector("#total").textContent = total.toFixed(2);
}

function populateChart() {
  if (!transactions.length) return;

  let reversed = transactions.slice().reverse();
  let sum = 0;

  let labels = reversed.map((t) => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  let data = reversed.map((t) => {
    sum += Number(t.value);
    return sum;
  });

  if (myChart) myChart.destroy();

  let ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Over Time",
          fill: true,
          backgroundColor: "#6666ff",
          data,
        },
      ],
    },
  });
}

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  if (!nameEl.value.trim() || isNaN(amountEl.value)) {
    errorEl.textContent = "Missing or Invalid Information";
    return;
  }

  errorEl.textContent = "";

  let transaction = {
    name: nameEl.value.trim(),
    value: Number(amountEl.value),
    date: new Date().toISOString(),
  };

  if (!isAdding) {
    transaction.value *= -1;
  }

  transactions.unshift(transaction);

  populateChart();
  populateTable();
  populateTotal();

  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      nameEl.value = "";
      amountEl.value = "";
    })
    .catch(() => {
      saveRecord(transaction);
      nameEl.value = "";
      amountEl.value = "";
    });
}
