import { $, getElements } from "./ui-bic.js";

const sltPublicaciones = $('sltPublicaciones');
const componentPblc = getElements('#componentPblc');
const chkAutorCorp = $('chkAutorCorp');
const autorCorporativo = $('autorCorporativo');

/**
 * Evento de cambio en select tipo/nombre publicación
 */
sltPublicaciones.addEventListener('change', () => {
    let seleccion = sltPublicaciones.options[sltPublicaciones.selectedIndex].value;
    if(seleccion.trim() === 'seccion de libro') {
        agregarComponentes(componentPblc,[0,1,6,8,9]);
    } else if(seleccion.trim() === 'libro') {
        agregarComponentes(componentPblc,[8,9]);
    } else if(seleccion.trim() === 'articulo de revista') {
        agregarComponentes(componentPblc,[2,6]);
    } else if(seleccion.trim() === 'articulo de periodico') {
        agregarComponentes(componentPblc,[3,4,5,6]);
    } else if(seleccion.trim() === 'actas de conferencia') {
        agregarComponentes(componentPblc,[6,7,8,9]);
    } else if(seleccion.trim() === 'informe') {
        agregarComponentes(componentPblc,[8,9]);
    }
},false);

chkAutorCorp.addEventListener('change',() => {
    if(chkAutorCorp.checked){
        autorCorporativo.disabled = false;
        autorCorporativo.focus();
    } else {
        autorCorporativo.disabled = true;
    }
});

/**
 * 
 * @param {*} element elemento que se le removerá la clase que lo oculta
 */
const eliminarClaseHide = (element) => {
    element.classList.remove('hide-element')
}

/**
 * 
 * @param {*} element elemento que se le eliminará la clase que lo oculta
 */
 const agregarClaseHide = (element) => {
    element.classList.add('hide-element')
}

const resetClassComponente = () => {
    componentPblc.forEach(componet => agregarClaseHide(componet));
}

const agregarComponentes = (componet,positions) => {
    resetClassComponente();
    for(let i = 0; i < componet.length; i++) {
        for(let j = 0; j < positions.length; j++) {
            if(i == positions[j]){
                if(componet[i].classList.contains("hide-element")) {
                    eliminarClaseHide(componet[i])
                }
            } 
        }
    } 
}