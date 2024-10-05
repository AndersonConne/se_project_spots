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
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
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

const modalPostContainer = document.querySelector("#post-modal");
const postButton = document.querySelector(".profile__add-button");
const postModalDismiss = document.querySelector("#post-modal-dismiss");
const linkInput = document.querySelector("#add-card-link");
const captionInput = document.querySelector("#caption");
const postFormElement = document.querySelector("#add-card-form");
const cardImage = document.querySelector(".card__image");
const cardTitle = document.querySelector(".card__title");

const previewModalContainer = document.querySelector("#preview-modal");
const previewDismiss = previewModalContainer.querySelector("#preview-dismiss");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card__content")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeElement = cardElement.querySelector(".card__like");
  const deleteButton = cardElement.querySelector(".card__delete");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  function handleLikeClick() {
    cardLikeElement.classList.toggle("card_like-color");
  }

  function handleDelete() {
    cardElement.remove();
  }

  cardLikeElement.addEventListener("click", handleLikeClick);
  deleteButton.addEventListener("click", handleDelete);
  cardImageElement.addEventListener("click", () => {
    const previewImage = previewModalContainer.querySelector("#preview-image");
    const previewText = previewModalContainer.querySelector("#preview-caption");

    openModal(previewModalContainer);
    previewImage.src = data.link;
    previewText.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_open");
}

function dismissModal(modal) {
  modal.classList.remove("modal_open");
}

function handleEditProfileSubmitForm(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  dismissModal();
}

function handlePostLinkForm(evt) {
  evt.preventDefault();
  let newPost = { name: captionInput.value, link: linkInput.value };
  const cardElement = getCardElement(newPost);
  cardList.prepend(cardElement);
  dismissModal(modalPostContainer);
}

postButton.addEventListener("click", () => {
  openModal(modalPostContainer);
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
});

editProfile.addEventListener("click", () => {
  openModal(modalContainer);
});

dismiss.addEventListener("click", () => {
  dismissModal(modalContainer);
});
editFormElement.addEventListener("submit", handleEditProfileSubmitForm);

postModalDismiss.addEventListener("click", () => {
  dismissModal(modalPostContainer);
});

postFormElement.addEventListener("submit", handlePostLinkForm);

previewDismiss.addEventListener("click", () => {
  dismissModal(previewModalContainer);
});

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardList.append(cardElement);
});
