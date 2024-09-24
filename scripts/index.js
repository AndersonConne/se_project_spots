const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const modalContainer = document.querySelector("#edit-modal");
const dismiss = modalContainer.querySelector(".modal__dismiss-button");
const inputName = modalContainer.querySelector("#name");
const inputDescription = modalContainer.querySelector("#description");
const editFormElement = modalContainer.querySelector(".modal__form");

const editProfile = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const cardTemplate = document.querySelector("#card__template");
const cardList = document.querySelector(".card__grid-container");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card__content")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  cardNameElement.textContent = data.name;

  const cardImageElement = cardElement.querySelector(".card__image");
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  return cardElement;
}

function openModal() {
  modalContainer.classList.add("modal_open");
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
}

function dismissModal() {
  modalContainer.classList.remove("modal_open");
}

function handleSubmitForm(evt) {
  evt.preventDefault();
  console.log("button was clicked");
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  dismissModal();
}

editProfile.addEventListener("click", openModal);
dismiss.addEventListener("click", dismissModal);
editFormElement.addEventListener("submit", handleSubmitForm);

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardList.append(cardElement);
}
