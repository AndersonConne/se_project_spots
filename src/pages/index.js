import {
  enableValidation,
  settings,
  resetFormValidation,
  disableButton,
} from "../scripts/validation.js";
import "./index.css";
import imageLogo from "../images/logo.svg";
import avatarImage from "../images/avatar.jpg";
import editImage from "../images/edit.svg";
import plusImage from "../images/add.svg";
import Api from "../utils/api.js";

let selectedCard, selectedCardId;

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "8c16611b-9dea-425f-bf23-1b84ee0078e3",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });

    avatarImages.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error(err);
  });
// initialCards.forEach((item) => {
//   const cardElement = getCardElement(item);
//   cardList.append(cardElement);
// });

const spotsLogo = document.getElementById("image-logo");
spotsLogo.src = imageLogo;

const avatarImages = document.getElementById("avatar-image");
avatarImages.src = avatarImage;

const edit = document.getElementById("edit-image");
edit.src = editImage;

const plus = document.getElementById("plus-image");
plus.src = plusImage;

const popupModals = document.querySelectorAll(".modal");
const profileModal = document.querySelector("#edit-modal");
const profileCloseButton = profileModal.querySelector(".modal__dismiss-button");
const inputName = profileModal.querySelector("#name");
const inputDescription = profileModal.querySelector("#description");
const editFormElement = document.forms["edit-profile"];
const allCloseButtons = document.querySelectorAll(".modal__dismiss-button");

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
const postFormElement = document.forms["add-card-form"];
const cardImage = document.querySelector(".card__image");
const cardTitle = document.querySelector(".card__title");
const cardSubmitButton = modalPostContainer.querySelector(
  ".modal__submit-button"
);

// DeleteModal elements

const deleteModal = document.querySelector("#delete-card-modal");
const deleteContainer = deleteModal.querySelector(".modal__form");

const previewModalContainer = document.querySelector("#preview-modal");
const previewDismiss = previewModalContainer.querySelector("#preview-dismiss");
const previewImage = previewModalContainer.querySelector("#preview-image");
const previewText = previewModalContainer.querySelector("#preview-caption");

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

  function handleDeleteSubmit(evt) {
    evt.preventDefault();
    api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      dismissModal(deleteModal);
    });
  }

  function handleDelete(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    console.log(selectedCardId);
    openModal(deleteModal);
  }
  deleteContainer.addEventListener("submit", handleDeleteSubmit);
  cardLikeElement.addEventListener("click", handleLikeClick);
  deleteButton.addEventListener("click", () => {
    handleDelete(cardElement, data._id);
  });
  cardImageElement.addEventListener("click", () => {
    openModal(previewModalContainer);
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewText.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_open");
  document.addEventListener("keydown", handleEscape);
}

function dismissModal(modal) {
  modal.classList.remove("modal_open");
  document.removeEventListener("keydown", handleEscape);
}

function handleEditProfileSubmitForm(evt) {
  evt.preventDefault();
  api
    .editUserInfo({ name: inputName.value, about: inputDescription.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      dismissModal(profileModal);
    });
}

function handlePostLinkForm(evt) {
  evt.preventDefault();
  api
    .addNewPost({ name: captionInput.value, link: linkInput.value })
    .then((post) => {
      const cardElement = getCardElement(post);
      cardList.prepend(cardElement);
      evt.target.reset();
      dismissModal(modalPostContainer);
      disableButton(cardSubmitButton, settings);
    });
  // const newPost = { name: captionInput.value, link: linkInput.value };
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modalOpen = document.querySelector(".modal_open");
    if (modalOpen) {
      dismissModal(modalOpen);
    }
  }
}

popupModals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      dismissModal(modal);
    }
  });
});

allCloseButtons.forEach((button) => {
  const popup = button.closest(".modal");
  console.log(popup);
  button.addEventListener("click", () => dismissModal(popup));
});

postButton.addEventListener("click", () => {
  openModal(modalPostContainer);
});

editProfile.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  resetFormValidation(editFormElement, [inputName, inputDescription], settings);
  openModal(profileModal);
});

editFormElement.addEventListener("submit", handleEditProfileSubmitForm);
postFormElement.addEventListener("submit", handlePostLinkForm);

enableValidation(settings);
