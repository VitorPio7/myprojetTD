
// const buttonEdit = [...document.getElementsByClassName("edit")];
// const container1 = document.querySelector(".container1")
// console.log(container1);
// buttonEdit.forEach((el) => {
//     el.addEventListener('click', async (element) => {
//         const id = element.target.id;
//         console.log(id);
//         const promptText = prompt("Write your text");
//         const newElement = document.createElement('form');
//         if (!promptText) return;
//         const paragraph = document.getElementById(id);
//         paragraph.innerHTML = promptText;
//         try {
//             const response = await axios.put(`/putChange/${id}`);
//             console.log('Text att in the DB', response.data);

//         } catch (error) {
//             console.error('Erro while you trying to update: ', error);
//         }

//     })
// })