
import {
   initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";

import {
   getFirestore, collection, getDocs, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
   apiKey: "AIzaSyCvXKgv5iUV88E16P2PyoTcXEto31inzJU",
   authDomain: "sousaku-9b884.firebaseapp.com",
   databaseURL: "https://sousaku-9b884-default-rtdb.firebaseio.com",
   projectId: "sousaku-9b884",
   storageBucket: "sousaku-9b884.appspot.com",
   messagingSenderId: "1069349277696",
   appId: "1:1069349277696:web:030addb4c39342c80a08e5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const checkboxes = document.querySelectorAll('input[type=checkbox]');

function bindEvents(checkbox) {
   addEventChange(checkbox);
}

function addEventChange(checkbox) {
   checkbox.addEventListener('change', handleChangeEvent, false);
}

function handleChangeEvent(evt) {
   evt.preventDefault();
   const statusName = evt.target.getAttribute("data-status")
   const reference = getDatabaseReference(statusName);
   updateStatus(reference, { isChecked: evt.target.checked });
}

function getDatabaseReference(statusItem) {
   return doc(db, "statusCollection", statusItem);
}

async function updateStatus(reference, data) {
   await updateDoc(reference, data);
}

function getStatusCollection() {
   const statusCollection = collection(db, 'statusCollection');
   return statusCollection;
}

async function getStatusValuesPromise(statusCollections) {
   const statusValuesPromise = await getDocs(statusCollections);
   return statusValuesPromise.docs.map(doc => doc.data());
}

function startServiceFirebase() {
   const statusCollection = getStatusCollection();
   const statusValuesPromise = getStatusValuesPromise(statusCollection);

   console.log(statusValuesPromise);

   statusValuesPromise
      .then(statusValueItem => {
         for (let i = 0; i < checkboxes.length; i++) {
            let checkbox = checkboxes.item(i);
            let { isChecked } = statusValueItem[i];

            console.log(statusValueItem);

            isChecked === true ?
               checkbox.setAttribute("checked", isChecked) :
               checkbox.removeAttribute("checked");

            bindEvents(checkbox);
         }
      });
}

startServiceFirebase();