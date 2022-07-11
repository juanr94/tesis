let listElements = document.querySelectorAll('.click-item');
let toggleHide =  document.querySelector('.toggle_hide'); 
let elementsToHide = document.getElementsByClassName('concealable');

listElements.forEach(element => {
    element.addEventListener('click', ()=>{
        let nextelement = element.nextElementSibling;
        nextelement.classList.toggle("ul_hide");
    });
    element.addEventListener("focus",()=>{
        element.style.borderLeft = "4px solid #4A4C7D";
        element.style.backgroundColor = "#ffffff";
    });     
    element.addEventListener("blur",()=>{
        element.style.borderLeft = "0";
        element.style.backgroundColor = "#f5f5f5";
    });
});

btnAdvancedSearch.addEventListener('click',()=>{
    btnAdvancedSearch.classList.toggle("arrow-up");
    console.log(elementsToHide.length);
    for(let i=0; i < elementsToHide.length; i++){
        elementsToHide[i].classList.toggle("hide-element");
    }
});

menuBtn.addEventListener('click', ()=>{
    menuBtn.classList.toggle('open');
    bar.classList.toggle('navbar');
});

search.addEventListener("submit", function(evt){
    evt.preventDefault();
});
