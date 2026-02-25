let transactions = [];
let myChart = null;

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach((trans) => {
    let tr = document.createElement("tr");
    let nameCell = document.createElement("td");
    let amountCell = document.createElement("td");

    nameCell.textContent = trans.name;
    amountCell.textContent = trans.value;

    tr.appendChild(nameCell);
    tr.appendChild(amountCell);
    tbody.appendChild(tr);
  });
}

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

// saveRecord() is defined in idb.js and will be used for offline storage

// Fetch transactions on page load
fetch("/api/transaction")
  .then((res) => res.json())
  .then((data) => {
    transactions = data;
    populateTable();
    populateChart();
    populateTotal();
  })
  .catch((error) => {
    console.error("Failed to fetch transactions:", error);
  });

// Event listeners
document.getElementById("add-btn").addEventListener("click", () => {
  sendTransaction(true);
});

document.getElementById("sub-btn").addEventListener("click", () => {
  sendTransaction(false);
});
