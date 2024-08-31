const buttonEdit = [...document.getElementsByClassName("edit")];

buttonEdit.forEach((el) => {
    el.addEventListener('click', (element) => {
        const id = element.target.id;
        console.log(id);
        const paragraph = document.getElementById(id);
        const promptText = prompt("Type your text here");
        console.log(promptText)
        paragraph.innerHTML = promptText;

        fetch(`/putChange/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: promptText })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Sucesso:', data);
            })
            .catch((error) => {
                console.error('Erro:', error);
            });

    });
});