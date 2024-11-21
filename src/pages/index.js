import {
  enablevalidation,
  settings,
  resetvalidation,
  disableButton,
} from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/api.js";
import { setButtonText, setDeleteButtonText } from "../utils/helper.js";

import stepsSrc1 from "../images/avatar.jpg";
import stepsSrc2 from "../images/logo.svg";
import stepsSrc3 from "../images/pencil.svg";
import stepsSrc4 from "../images/plus.svg";

const stepsImage1 = document.getElementById("image-steps1");
stepsImage1.src = stepsSrc1;

const stepsImage2 = document.getElementById("image-steps2");
stepsImage2.src = stepsSrc2;

const stepsImage3 = document.getElementById("image-steps3");
stepsImage3.src = stepsSrc3;

const stepsImage4 = document.getElementById("image-steps4");
stepsImage4.src = stepsSrc4;

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
//     name: "Golden Gate bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e4f5c80a-a341-45d6-9827-492ff5090db2",
    "Content-Type": "application/json",
  },
});

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector(".profile__add-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarProfile = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editModalForm = editModal.querySelector(".modal__form");
const closeProfileModal = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalSubmitBtn = cardModal.querySelector(".modal__submit-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalSubmitBtn = avatarModal.querySelector(".modal__submit-button");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const cancelBtn = deleteModal.querySelector(".cancel__btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

api
  .getAppInfo()
  .then(([cards, users]) => {
    console.log(cards);
    console.log(users);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    avatarProfile.src = users.avatar;
    const userName = document.querySelector(".profile__name");
    userName.textContent = users.name;
  })
  .catch(console.error);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageElement.addEventListener("click", (event) => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleEscape(event) {
  if (event.key === "Escape") {
    const currentModal = document.querySelector(".modal_opened");
    closeModal(currentModal);
  }
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCardInfo({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardModalSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editavatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatarProfile.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteBtn = evt.submitter;
  setDeleteButtonText(deleteBtn, true);

  api
    .deleteCard(selectedCardId)
    .then(() => {
      cardsList.removeChild(selectedCard);
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setDeleteButtonText(deleteBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", (event) => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetvalidation(
    editModalForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

const closeButtons = document.querySelectorAll(".modal__close-button");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

cardModalBtn.addEventListener("click", (event) => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", (event) => {
  openModal(avatarModal);
});

cancelBtn.addEventListener("click", (event) => {
  closeModal(deleteModal);
});

editModalForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

const modalList = document.querySelectorAll(".modal");
modalList.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.className == "modal modal_opened") {
      closeModal(modal);
    }
  });
});

enablevalidation(settings);
