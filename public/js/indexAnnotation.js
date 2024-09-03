

const buttonEdit = [...document.getElementsByClassName("edit")];
const inputSend = [...document.getElementsByClassName("inputSend")];
const catchText = [...document.getElementsByClassName("titleInv")]
const idElement = document.getElementById("form-text")
const inputBooks = document.querySelector(".inputBooks");
buttonEdit.forEach((el) => {
    el.addEventListener('click', async (element) => {
        const id = element.target.id;
        console.log(id);
        const paragraph = document.getElementById(id);
        const promptText = prompt("Type your text here");
        console.log(promptText)
        paragraph.innerHTML = promptText;
        if (promptText !== null) {
            try {
                await fetch(`/edit/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: promptText })
                });
            } catch (err) {
                console.error(err.stack);
            }
        } else {
            alert("Text not changed!")
        }

    });
});


let idTxt = '';
catchText.forEach((el) => {
    idTxt = el.id;
});

idElement.addEventListener("click", async (el) => {
    console.log("clicou")
    const form = document.createElement("form");
    const paragraph = document.createElement('textarea');
    const button = document.createElement('input');
    const label = document.createElement('label');
    form.action = `/add-text/${idTxt}`;
    form.method = "post";
    form.className = "sendTo"
    paragraph.name = "infoText";
    paragraph.required = true
    paragraph.className = "inputTo"
    button.type = "submit";
    button.className = "submitB"
    label.for = "infoText";
    paragraph.placeholder = "type your text here"
    form.appendChild(label);
    form.appendChild(paragraph);
    form.appendChild(button);
    document.querySelector('.colum2').appendChild(form);

    idElement.remove();
})

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`/search-suggestions?q=${query}`);
        if (!response.ok) {
            throw new Error('Error to search the suggestion');
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error:", err);
        return [];
    }
}




