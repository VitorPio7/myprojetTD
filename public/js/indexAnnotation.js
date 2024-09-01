const buttonEdit = [...document.getElementsByClassName("edit")];

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