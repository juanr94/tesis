
// @ts-check

import { $, Spinner, getElements } from "./ui-bic.js";

let clickableMenuItems = getElements('.click-item');
let elementsToHide = document.getElementsByClassName('hideable');
let searchInputItems = $('mainSearchContainer').children;

const firstSearchInput = searchInputItems.item(1);
const lastSearchInput = searchInputItems.item(searchInputItems.length - 2);

firstSearchInput.classList.toggle("fix-margin-search-input");

clickableMenuItems.forEach(menuItem => {
   menuItem.addEventListener('click', () => {
      let nextElement = menuItem.nextElementSibling;
      nextElement.classList.toggle("ul-hide");
   });
   menuItem.addEventListener("focus", () => {
      menuItem.style.color = "#002A6B";
      menuItem.style.borderLeft = "4px solid #002A6B";
      menuItem.style.backgroundColor = "#f5f5f5";
   });
   menuItem.addEventListener("blur", () => {
      menuItem.style.color = "#6d6d6d";
      menuItem.style.borderLeft = "0";
      menuItem.style.backgroundColor = "transparent";
   });
   menuItem.addEventListener("mouseover", () => {
      menuItem.style.color = "#003d99";
   });
   menuItem.addEventListener("mouseout", () => {
      menuItem.style.color = "rgb(109, 109, 109)";
   });
});

btnAdvancedSearch.addEventListener('click', () => {
   btnAdvancedSearch.classList.toggle("arrow-up");

   firstSearchInput.classList.toggle("fix-margin-search-input");
   lastSearchInput.classList.toggle("fix-margin-search-input");

   for (const element of elementsToHide) {
      element.classList.toggle("hide-element");
   }
});

containerBurgerMenu.addEventListener('click', () => {
   containerBurgerMenu.classList.toggle('open');
   bar.classList.toggle('navbar');
});

// Personalizacion de los espinners
const spinTwo = new Spinner();
spinTwo.build("spinTwo");