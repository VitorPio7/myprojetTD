const buttonEdit = [...document.getElementsByClassName("edit")];
const container1 = document.querySelector(".container1")

buttonEdit.forEach((el) => {
    el.addEventListener('click', (element) => {
        const id = element.target.id;
        console.log(id);
        const paragraph = document.getElementById(id);
        const promptText = prompt("Digite o seu texto");
        paragraph.innerHTML = promptText;
        var newInput = document.createElement('input');
        var newForm = document.createElement('form');

        newInput.value = promptText;
        newInput.type = "hidden";
        newInput.innerHTML = promptText;
        newInput.name = id;
        newForm.method = "PUT";
        newForm.action = "/putChange"
        newForm.type = "hidden"

        newForm.appendChild(newInput);
        container1.appendChild(newForm);

        console.log(newForm);

    })
})