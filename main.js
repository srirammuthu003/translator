const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector("button");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const icons = document.querySelectorAll(".row i");

selectTag.forEach( (tag, id) => {
    for (const country_code in countries) {
        //Selecting En as default language for FROM and HI as TO
        let selected;
        if(id ==0 && country_code == "en-GB"){
            selected = "selected";
        }
        else if(id ==1 && country_code == "ur-PK"){
            selected = "selected";
        }

        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);         //Adding Option Tag inside Select Tag
    }
});

exchangeIcon.addEventListener("click", ()=>{
    // Exchanging text area and select tag values.
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
    toText.value = tempText;
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value;
    let translateFrom = selectTag[0].value;             //Getting from select tag value
    let translateTo = selectTag[1].value;               //Getting to select tag value
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    // Fetching API response and returnuing it with parsing into JS Object and in another then method
    // Receiveing it
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    })
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target})=>{
        if(target.classList.contains("fa-copy"))
        {
            if(target.id == "from"){
                navigator.clipboard.writeText(fromText.value);
            }
            else{
                navigator.clipboard.writeText(toText.value);
            }
        }
        else
        {
            let utterance;
            if(target.id == "from"){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            }
            else{
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }

            speechSynthesis.speak(utterance);       //Speak the passed utterance
        }
    });
});






//https://mymemory.translated.net/doc/spec.php