let addToy = false;
const toyCollection = document.getElementById("toy-collection");
const toyForm = document.querySelector(".add-toy-form");

document.addEventListener("DOMContentLoaded", () => {
  // Toggle form visibility
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".toy-form-container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and render toys
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(renderToyCard));

  // Create new toy
  toyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = { name, image, likes: 0 };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(renderToyCard);

    toyForm.reset();
  });
});

function renderToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar"/>
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Add like button listener
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    const likesEl = card.querySelector("p");
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(res => res.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        likesEl.textContent = `${updatedToy.likes} Likes`;
      });
  });

  toyCollection.append(card);
}
