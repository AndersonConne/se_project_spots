import {
  enableValidation,
  settings,
  resetFormValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonContent, handleSubmit } from "../utils/helpers.js";
import "./index.css";
import imageLogo from "../images/logo.svg";
import avatarImage from "../images/avatar.jpg";
import editImage from "../images/edit.svg";
import plusImage from "../images/add.svg";
import whitePencil from "../images/white-pencil.svg";
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
    console.log(cards);
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

// Images

const spotsLogo = document.getElementById("image-logo");
spotsLogo.src = imageLogo;

const avatarImages = document.getElementById("avatar-image");
avatarImages.src = avatarImage;

const edit = document.getElementById("edit-image");
edit.src = editImage;

const plus = document.getElementById("plus-image");
plus.src = plusImage;

const whitePencilImg = document.getElementById("white-pencil");
whitePencilImg.src = whitePencil;

// Universal Elements
const allCloseButtons = document.querySelectorAll(".modal__dismiss-button");
const popupModals = document.querySelectorAll(".modal");

// Profile Modal Elements
const profileModal = document.querySelector("#edit-modal");
const inputName = profileModal.querySelector("#name");
const inputDescription = profileModal.querySelector("#description");
const editAvatarButton = document.querySelector(".profile__image-btn");

// Section - Profile Elements
const editProfile = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileImage = document.querySelector(".profile__image");
const profileDescription = document.querySelector(".profile__description");

const editFormElement = document.forms["edit-profile"];

// Card Elements
const cardTemplate = document.querySelector("#card__template");
const cardList = document.querySelector(".card__grid-container");

// Post Modal Elements
const modalPostContainer = document.querySelector("#post-modal");
const postButton = document.querySelector(".profile__add-button");
const linkInput = document.querySelector("#add-card-link");
const captionInput = document.querySelector("#caption");
const postFormElement = document.forms["add-card-form"];
const cardSubmitButton = modalPostContainer.querySelector(
  ".modal__submit-button"
);

// Delete Modal Elements

const deleteModal = document.querySelector("#delete-card-modal");
const deleteForm = document.forms["delete-modal-form"];
const deleteCancelButton = deleteModal.querySelector(".modal__cancel-btn");

// Preview Modal Elements

const previewModalContainer = document.querySelector("#preview-modal");
const previewImage = previewModalContainer.querySelector("#preview-image");
const previewText = previewModalContainer.querySelector("#preview-caption");

// Avatar Modal Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["avatar-form"];
const avatarInput = avatarModal.querySelector("#add-card-link");
const avatarSubmitButton = avatarModal.querySelector("#avatar-button");

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

  if (data.isLiked) {
    cardLikeElement.classList.add("card_like-color");
  }

  cardLikeElement.addEventListener("click", (evt) =>
    handleLikeClick(evt, data._id)
  );
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

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      dismissModal(deleteModal);
    });
  }

  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleDelete(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  console.log(selectedCardId);
  openModal(deleteModal);
}

function handleUpdateAvatar(evt) {
  function makeRequest() {
    return api.updateAvatar(avatarInput.value).then((data) => {
      profileImage.src = data.avatar;
      disableButton(avatarSubmitButton, settings);
      dismissModal(avatarModal);
    });
  }

  handleSubmit(makeRequest, evt);
}

function handleEditProfileSubmitForm(evt) {
  function makeRequest() {
    return api
      .editUserInfo({ name: inputName.value, about: inputDescription.value })
      .then((data) => {
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        dismissModal(profileModal);
      });
  }

  handleSubmit(makeRequest, evt);
}

function handlePostLinkForm(evt) {
  function makeRequest() {
    return api
      .addNewPost({ link: linkInput.value, name: captionInput.value })
      .then((post) => {
        const cardElement = getCardElement(post);
        cardList.prepend(cardElement);
        dismissModal(modalPostContainer);
        disableButton(evt.submitter, settings);
      });
  }

  handleSubmit(makeRequest, evt);
  // const newPost = { name: captionInput.value, link: linkInput.value };
}

function handleLikeClick(evt, id) {
  const cardLikeElement = evt.target;
  const isLiked = cardLikeElement.classList.contains("card_like-color");

  api
    .updateLike(id, isLiked)
    .then(() => {
      cardLikeElement.classList.toggle("card_like-color");
    })
    .catch(console.error);
}

function openModal(modal) {
  modal.classList.add("modal_open");
  document.addEventListener("keydown", handleEscape);
}

function dismissModal(modal) {
  modal.classList.remove("modal_open");
  document.removeEventListener("keydown", handleEscape);
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

deleteCancelButton.addEventListener("click", () => dismissModal(deleteModal));

editAvatarButton.addEventListener("click", () => {
  resetFormValidation(editFormElement, [inputName, inputDescription], settings);
  openModal(avatarModal);
});

editProfile.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  resetFormValidation(editFormElement, [inputName, inputDescription], settings);
  openModal(profileModal);
});

avatarForm.addEventListener("submit", handleUpdateAvatar);
deleteForm.addEventListener("submit", handleDeleteSubmit);
editFormElement.addEventListener("submit", handleEditProfileSubmitForm);
postFormElement.addEventListener("submit", handlePostLinkForm);

enableValidation(settings);
