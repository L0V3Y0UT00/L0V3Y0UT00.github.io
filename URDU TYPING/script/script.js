// Show Share Options
function showShare() {
    let shareOps = document.getElementById("shareOps");
    shareOps.classList.toggle("open-share");
}

// COPY TO CLIPBOARD
function copyURL() {
    var url = document.getElementById("shareURL");
    url.select();
    url.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(url.value);
}

// define the time limit
let TIME_LIMIT = 60;

function setTime() {
    TIME_LIMIT = document.getElementById("selectTime").value;
    document.querySelector(".curr_time").innerText = TIME_LIMIT + "s";
}

// define quotes to be used
let quotes_array = [
    "میرے گھر کے سامنے ایک باغ ہے۔ اس میں بہت سے پودے اور درخت ہیں۔ بہار کے موسم میں کئی رنگ کے پھول کھلتے ہیں۔ ان کی خوشبو اردگرد پھیل جاتی ہے۔ شام کو باغ آدمیوں، عورتوں اور بچوں سے بھر جاتا ہے۔ لوگ ادھر ادھر پھرتے ہیں اور لطف اٹھاتے ہیں۔ بچے باغ میں دوڑتے ہیں۔ اب وہ یہاں ہیں اور دوسرے لمحے وہ باغ کے دوسرے کونے میں ہیں۔ ہر شام میں بھی باغ میں سیر کے لئے جاتا ہوں۔ بہت سے مالی باغ کی دیکھ بھال کرتے ہیں۔",
    "زندگی کے نشیب و فراز میں ایسے لمحات بھی آتے ہیں جب انسان بالکل نا امید ہو جاتا ہے۔ اسے ہر طرف اندھیرا ہی اندھیرا نظر آتا ہے اور اس کی مقابلے کی سکت ختم ہوجاتی ہے۔ یہ بات انسان کی عظمت کے خلاف ہے۔ دنیا میں جتنی بھی ترقی ہوئی ہے وہ اس عظم و ہمت کا نتیجہ ہے جو کہ اللہ تعالیٰ نے انسان کو عطا فرمائی ہے۔ انسان کو چاہیے کہ کبھی ہمت نہ ہارے بلکہ مردانہ وار ناکامیوں کا مقابلہ کرے۔ اللہ تعالیٰ ایک دن ضرور کامیابی عطا کرے گا۔",
    "ڈر ہے کہ چند سال بعد دنیا کا تیل ختم ہو جائے گا۔ ہر ملک یہ کوشش کر رہا ہے کہ تیل کے مزید ذخیرے دریافت کرے۔ معلوم نہیں کہ یہ کوشش کس حد تک کامیاب ہوگی۔ ضرورت اس بات کی ہے کہ ہم اپنی تیل کی ضروریات کو کم کریں۔ صنعت و زراعت میں تیل کی کھپت کو کم نہیں کیا جا سکتا۔ البتہ نجی ضرورتوں کو کم کیا جا سکتا ہے۔ ہمیں چاہیے کہ باہر سے کاروں کی جگہ بسیں درآمد کریں۔ تاکہ طالب علموں کے لیے بسوں کی سہولت کو بہتر بنایا جا سکے۔"
];

// selecting required elements
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let cpm_text = document.querySelector(".curr_cpm");
let wpm_text = document.querySelector(".curr_wpm");
let quote_text = document.querySelector(".test_text");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart");
let cpm_group = document.querySelector(".cpm");
let wpm_group = document.querySelector(".wpm");
let error_group = document.querySelector(".errors");
let accuracy_group = document.querySelector(".accuracy");
let time_selector = document.getElementById("selectTime");

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;

quote_text.innerText = quotes_array[quoteNo];

function updateQuote() {
    quote_text.textContent = null;
    current_quote = quotes_array[quoteNo];

    // separate each character and make an element 
    // out of each of them to individually style them
    current_quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        quote_text.appendChild(charSpan)
    })

    // roll over to the first quote
    if (quoteNo < quotes_array.length - 1)
        quoteNo++;
    else
        quoteNo = 0;
}

function processCurrentText() {

    // get current input text and split it
    curr_input = input_area.value;
    curr_input_array = curr_input.split('');

    // increment total characters typed
    characterTyped++;

    errors = 0;

    quoteSpanArray = quote_text.querySelectorAll('span');
    quoteSpanArray.forEach((char, index) => {
        let typedChar = curr_input_array[index]

        // characters not currently typed
        if (typedChar == null) {
            char.classList.remove('correct_char');
            char.classList.remove('incorrect_char');

            // correct characters
        } else if (typedChar === char.innerText) {
            char.classList.add('correct_char');
            char.classList.remove('incorrect_char');

            // incorrect characters
        } else {
            char.classList.add('incorrect_char');
            char.classList.remove('correct_char');

            // increment number of errors
            errors++;
        }
    });

    // display the number of errors
    error_text.textContent = total_errors + errors;

    // update accuracy text
    let correctCharacters = (characterTyped - (total_errors + errors));
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    accuracy_text.textContent = Math.round(accuracyVal);

    // if current text is completely typed
    // irrespective of errors
    if (curr_input.length == current_quote.length) {
        updateQuote();

        // update total errors
        total_errors += errors;

        // clear the input area
        input_area.value = "";
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        // decrease the current time left
        timeLeft--;

        // increase the time elapsed
        timeElapsed++;

        // update the timer text
        timer_text.textContent = timeLeft + "s";
    } else {
        // finish the game
        finishGame();
    }
}

function finishGame() {
    // stop the timer
    clearInterval(timer);

    // disable the input area
    input_area.disabled = true;

    // display restart button
    restart_btn.style.display = "block";

    // calculate cpm and wpm
    cpm = Math.round(((characterTyped / timeElapsed) * 60));
    wpm = Math.round((((characterTyped / 5) / timeElapsed) * 60));

    // update cpm and wpm text
    cpm_text.textContent = cpm;
    wpm_text.textContent = wpm;

    // display the cpm and wpm
    cpm_group.style.display = "block";
    wpm_group.style.display = "block";
    error_group.style.display = "block";
    accuracy_group.style.display = "block";
}


function startGame() {

    resetValues();
    updateQuote();

    // clear old and start a new timer
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function resetValues() {
    timeLeft = TIME_LIMIT;
    timeElapsed = 0;
    errors = 0;
    total_errors = 0;
    accuracy = 0;
    characterTyped = 0;
    quoteNo = 0;
    input_area.disabled = false;

    input_area.value = "";
    accuracy_text.textContent = 100;
    timer_text.textContent = timeLeft + 's';
    error_text.textContent = 0;
    restart_btn.style.display = "none";
    cpm_group.style.display = "none";
    wpm_group.style.display = "none";
    error_group.style.display = "none";
    accuracy_group.style.display = "none";
    restart_btn.style.display = "none";
    time_selector.style.display = "none";
}

function restartPage() {
    window.location.href = window.location.href;
}