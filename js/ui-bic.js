"use strict";
// @ts-check

/**
 * Funcion que recupera un elemento del DOM atraves de su atributo id.
 * @param {string} idElement Cadena de texto que hace referencia al atributo id del elemento.
 * @returns {HTMLElement} Elemento extraido.
 */
export const $ = (idElement) => document.getElementById(idElement);

/**
 * Funcion que recupera un elemento del DOM atraves de cualquier selector.
 * @param {string} selector Cadena de texto que hace referencia al selector
 * @returns {HTMLElement} Elemento recuperado.  
 */
export const getElement = (selector) => document.querySelector(selector);

/**
 * Funcion que recupera una lista de elementos del DOM que 
 * tienen en comun un tipo de selector.
 * @param {string} selector Cadena de texto que hace referencia al selector
 * @returns {NodeListOf<HTMLElement} Lista de elementos recuperado.  
 */
export const getElements = (selector) => document.querySelectorAll(selector);

/**
 * Funcion creadora de elementos HTML.
 * @param {string} tag Tipo de elemento html o de etiqueta html.
 * @param {string} className Clase CSS.
 * @returns {HTMLElement} Elemento HTML creado.
 */
export function createElement(tag, className) {
   const element = document.createElement(tag);
   if (className) element.classList.add(className);
   return element;
}

/**
 * Retorna la posicion absoluta de un elemento
 * @param {HTMLElement} element Elemento HTML
 * @returns {Object} Objeto con la posicion absoluta y dimension del elemento
 */
export function offset(element) {
   const rect = element.getBoundingClientRect();
   return {
      width: rect.width,
      height: rect.height,
      left: rect.left + window.scrollX,
      right: rect.right,
      top: rect.top + window.scrollY,
      bottom: rect.bottom,
      x: rect.x,
      y: rect.y
   };
}

/**
 * Establece un set de atributos para un elemento HTML.
 * @method
 * @param  {...any} attrs Atributos
 * @memberof HTMLElement.prototype 
 * @name HTMLElement#setAttributes
 * @example
 * element.setAttributes(
 *    { attr: "attr01", value: "value01" },
 *    { attr: "attr01", value: "value01" },
 *    ...
 *    { attr: "attr n", value: "value n" },
 * );
 */
HTMLElement.prototype.setAttributes = function (...attrs) {
   attrs.map(props => {
      if (props.attr && props.value)
         this.setAttribute(props.attr, props.value);
   });
}

/**
 * Funcion que crea una cadena de texto aleatorio.
 * @returns {string} Cadena de texto aleatorio.
 */
export function uid() {
   return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/*-----------------------------------------------------
 *                     Modales
 *-----------------------------------------------------*/
// Variables
let modalTargets, modalCloseTimeout, modalDisplayTimeout;

/**
 * Bootstrap de ventanas modales
 */
function renderModals() {
   // Inicializacion de variables
   modalTargets = getElements('[data-toggle="modal"]');

   // Comportamiento de componentes
   modalTargets.forEach(target => {
      target.addEventListener('click', (evt) => {
         evt.preventDefault();
         showModal(target.getAttribute('data-target'));
      }, { capture: false });
   });
}

/**
 * Despacha el evento de abrir ventana modal.
 * @param {string} querySelector querySelector de la ventana modal
 */
export function showModal(querySelector) {
   let body = document.body;
   let modal = getElement(querySelector);
   let dialog = modal.querySelector('.modal-dialog');
   let btnClose = dialog.firstElementChild.firstElementChild.lastElementChild;

   modal.setAttribute('aria-hidden', false);

   modalDisplayTimeout = setTimeout(() => {
      body.classList.add('modal-open');
      modal.style.display = 'block';
      modal.scrollTo(0, 0);
      modal.style.opacity = '1';
      modal.classList.contains('center') ?
         dialog.style.transform = 'translateY(-50%)' :
         dialog.style.transform = 'translateY(0)';

      clearTimeout(modalDisplayTimeout);
   }, 10);

   btnClose.addEventListener('click', (evt) => {
      evt.preventDefault();
      hideModal(querySelector);
   }, { capture: false, once: true });
}

/**
 * Despacha el evento de cerrar ventana modal.
 * @param {string} querySelector querySelector de la ventana modal
 */
export function hideModal(querySelector) {
   let body = document.body;
   let modal = getElement(querySelector);
   let dialog = modal.querySelector('.modal-dialog');
   let btnClose = dialog.firstElementChild.firstElementChild.lastElementChild;
   let openModals = getElements('.modal[aria-hidden=false]');

   modal.setAttribute('aria-hidden', true);
   modal.style.opacity = '0';
   modal.classList.contains('center') ?
      dialog.style.transform = 'translateY(-75%)' :
      dialog.style.transform = 'translateY(-50px)';

   modalCloseTimeout = setTimeout(() => {
      modal.style.display = "none";
      if (openModals.length < 2) body.classList.remove("modal-open");
      clearTimeout(modalCloseTimeout);
   }, 200);

   btnClose.removeEventListener('click', () => {
      hideModal(querySelector);
   }, { capture: false, once: true });
}

/*-----------------------------------------------------
 *                     Popovers
 *-----------------------------------------------------*/
// Variables

/**
 * Targets de los menus contextuales.
 */
let popTargets;

/**
 * Índice de un menuItem de un menú contextual específico.
 */
let popItemIndex = 0;

/**
 * Propiedades de un menú contextual.
 */
let popProps = {
   pop: null,
   buttons: [],
   isOpen: false
};

/**
 * Bootstrap de popovers
 */
function renderPopovers() {
   // Inicializacion de variables
   popTargets = getElements('[data-toggle=popover]');

   // Comportamiento de componentes
   popTargets.forEach(target => {
      try {
         let pop = getElement(target.getAttribute('data-target'));
         let buttons = pop.querySelectorAll("[class=btn-menu-item]");

         onClickPopoverTarget(target);
         onFocusoutPopoverTarget(target);
         onFocusinPopoverTarget(target);
         onKeydownPopoverTarget(target);
         onClickPopoverButtons(target, buttons);
      } catch (error) { }
   });
}

/**
 * Evento click del target o desencadenante que está enlazado al menú contextual.
 * @param {HTMLElement} target Target o desencadenante.
 */
function onClickPopoverTarget(target) {
   target.addEventListener('click', (evt) => {
      evt.preventDefault();
      popProps.pop = getElement(target.getAttribute('data-target'));
      popProps.buttons = popProps.pop.querySelectorAll('[class=btn-menu-item]');
      popProps.isOpen = true;
      popProps.pop.style.display = 'block';
      target.setAttribute('aria-expanded', true);
   }, false);
}

/**
 * Evento focusout del target o desencadenante que esta enlazado al menú contextual.
 * @param {HTMLElement} target Target o desencadenante.
 */
function onFocusoutPopoverTarget(target) {
   target.addEventListener('focusout', (evt) => {
      evt.preventDefault();
      let pop = getElement(target.getAttribute('data-target'));
      let buttons = pop.querySelectorAll("[class=btn-menu-item]");
      buttons.forEach((button) => {
         button.classList.remove('item-active');
      });
      target.removeAttribute('aria-expanded');
   }, false);
}

/**
 * Evento focusin del target o desencadenante que esta enlazado al menú contextual.
 * @param {HTMLElement} target Target o desencadenante.
 */
function onFocusinPopoverTarget(target) {
   target.addEventListener("focusin", (evt) => {
      evt.preventDefault();

      popProps.pop = getElement(target.getAttribute('data-target'));

      popProps.buttons = popProps.pop.querySelectorAll('[class=btn-menu-item]');
      popProps.isOpen = true;
      popProps.pop.style.display = 'block';
      target.setAttribute('aria-expanded', true);

      const targetOffset = offset(target);
      const popOffset = offset(popProps.pop);
      const offsetForRoundedTarget =
         target.getAttribute("class") == "btn-pop" ?
            { top: 10, width: 22 } : { top: 0, width: 0 };

      popProps.pop.style.top = (target.offsetTop - target.scrollTop +
         target.clientTop + target.clientHeight + 2 - offsetForRoundedTarget.top) + "px";

      popProps.pop.style.left =
         (targetOffset.width < popOffset.width) ?
            (target.offsetLeft - target.scrollLeft +
               target.clientLeft - popOffset.width +
               targetOffset.width - offsetForRoundedTarget.width) + "px" :
            (target.offsetLeft - target.scrollLeft +
               target.clientLeft - popOffset.width / 2 +
               targetOffset.width / 2) + "px";

   }, {
      capture: false
   });
}

/**
 * Evento keydown del target o desencadenante que esta enlazado al menú contextual.
 * @param {HTMLElement} target Target o desencadenante.
 */
function onKeydownPopoverTarget(target) {
   target.addEventListener('keydown', (evt) => {
      if (popProps.pop && popProps.isOpen) {
         switch (evt.code) {
            case 'ArrowUp': // Tecla de navegación arriba.
               evt.preventDefault();

               if (popItemIndex <= 1) {
                  popItemIndex = popProps.buttons.length;

               }
               else {
                  popItemIndex--;
               };

               popProps.buttons.forEach((button) => {
                  button.classList.remove('item-active');
                  button.setAttribute('tabindex', -1);
               });

               popProps.buttons[popItemIndex - 1]
                  .classList.add('item-active');

               popProps.buttons[popItemIndex - 1]
                  .setAttribute('tabindex', 0);
               break;

            case 'ArrowDown': // Tecla de navegación abajo.
               evt.preventDefault();

               if (popItemIndex >= popProps.buttons.length) {
                  popItemIndex = 1;
               }
               else {
                  popItemIndex++;
               };

               popProps.buttons.forEach((button) => {
                  button.classList.remove('item-active');
                  button.setAttribute('tabindex', -1);
               });

               popProps.buttons[popItemIndex - 1]
                  .classList.add('item-active');

               popProps.buttons[popItemIndex - 1]
                  .setAttribute('tabindex', 0);
               break;

            case "Enter": // Tecla Enter.
               evt.preventDefault();
               if (popProps.pop && popProps.isOpen) {
                  if (popItemIndex > 0) {
                     popProps.buttons[popItemIndex - 1].click();
                     return;
                  }
               }

               popProps.pop.style.display = 'block';
               target.setAttribute('aria-expanded', true);
               break;

            case "Escape": // Tecla de Escape.
            case "Tab": // Tecla de Tabulación.
               if (popProps.pop && popProps.isOpen) {
                  popItemIndex = 0;
                  popProps.pop.style.display = 'none';
                  popProps.isOpen = false;
                  popProps.buttons.forEach((button) => {
                     button.classList.remove('item-active');
                     button.setAttribute('tabindex', -1);
                  });

                  target.removeAttribute('aria-expanded');
               }
               break;

            default:
               evt.preventDefault();
               popItemIndex = 0;
               popProps.buttons.forEach((button) => {
                  button.classList.remove('item-active');
                  button.setAttribute('tabindex', -1);
               });
               break;
         }
      }
   }, {
      capture: false
   });
}

/**
 * Evento click por defecto de los botones del menú contextual enlazado a su target.
 * @param {HTMLElement} target Target o desencadenante.
 * @param {NodeList} buttons Botones de un menú contextual específico.
 */
function onClickPopoverButtons(target, buttons) {
   buttons.forEach(button => {
      button.addEventListener('click', () => {
         buttons.forEach((button) => {
            button.classList.remove('item-active');
         });

         popItemIndex = 0;
         target.focus();
      }, false);
   });

}

/**
 * Evento mousedown que ordena el cierre de un menú contextual si está abierto
 * al hacer click en otros Nodos del DOM.
 * @param {MouseEvent} evt Evento mousedown.
 */
function windowOnMousedownPopover(evt) {
   if (popProps.pop && popProps.isOpen) {
      if (!popProps.pop.contains(evt.target)) {
         popItemIndex = 0;
         popProps.pop.style.display = 'none';
         popProps.buttons.forEach((button) => {
            button.classList.remove('item-active');
            button.setAttribute('tabindex', -1);
         });
         popProps.isOpen = false;
      }
   }
}

/**
 * Evento Resize que actualiza ubicación del menu contextual
 * segun el target que lo contiene.
 * @param {Event} evt Evento Resize del objeto window.
 */
function windowOnResizePopover(evt) {
   evt.preventDefault();
   if (popProps.pop && popProps.isOpen) {
      const target = getElement(`#${popProps.pop.getAttribute("aria-labelledby")}`);

      const targetOffset = offset(target);
      const popOffset = offset(popProps.pop);
      const offsetForRoundedTarget =
         target.getAttribute("class") == "btn-pop" ?
            { top: 10, width: 22 } : { top: 0, width: 0 };

      popProps.pop.style.top = (target.offsetTop - target.scrollTop +
         target.clientTop + target.clientHeight + 2 - offsetForRoundedTarget.top) + "px";

      popProps.pop.style.left =
         (targetOffset.width < popOffset.width) ?
            (target.offsetLeft - target.scrollLeft +
               target.clientLeft - popOffset.width +
               targetOffset.width - offsetForRoundedTarget.width) + "px" :
            (target.offsetLeft - target.scrollLeft +
               target.clientLeft - popOffset.width / 2 +
               targetOffset.width / 2) + "px";
   }
}

/**
 * Metodo exportado que abre un menú contextual de un target específico.
 * @param {HTMLElement} target Target o desencadenante.
 */
export function showPop(target) {
   try {
      const pop = getElement(target.getAttribute('data-target'));
      pop.style.display = 'block';
   } catch (error) { }
}

/**
 * Metodo exportado que cierra un menú contextual de un target específico.
 * @param {HTMLElement} target Target o desencadenante.
 */
export function hidePop(target) {
   try {
      const pop = getElement(target.getAttribute('data-target'));
      pop.style.display = 'none';
   } catch (error) { }
}

/**
 * Elimina un elemento menu contextual del DOM.
 * @param {HTMLElement} target Target o desencadenante.
 */
export function deletePop(target) {
   try {
      const pop = getElement(target.getAttribute('data-target'));
      document.body.removeChild(pop);
   } catch (error) { }
}

/**
 * Metodo exportado crea y asigna una instancia nueva de un menú contextual a un target.
 * @param {HTMLElement} target Target o desencadenante.
 * @param {Array.<{
 *             type: string, 
 *             image: string, 
 *             text: string, 
 *             onclick: Function | string}>
 * } props Array de objeto conteniendo propiedades para el menú contextual.
 * @example
 * const props = [
 *    {
 *       type: "button", // Tipo de elemento html button
 *       image: "css-class-image", // Clase css de la imagen
 *       text: "Menu Item 01", // Texto del botón
 *       onclick: function (evt) {} // Callback
 *    },
 *    {
 *       type: "a", // Tipo de elemento html a
 *       image: "css-class-image", // Clase css de la imagen
 *       text: "Menu Item 02", // Texto del botón
 *       onclick: "https://my.url.com" // Enlace
 *    }
 * ];
 */
export function addPop(target, props) {
   try {
      const buttons = [];
      const pop = createElement("div", "popup");
      const menu = createElement("ul", "menu");
      const menuItem = createElement("li", "menu-item");

      const targetId = target.getAttribute("id");
      const menuId = `${target.getAttribute("id")}-menu-${uid()}`;

      target.setAttributes(
         { attr: "type", value: "button" },
         { attr: "aria-haspopup", value: "true" },
         { attr: "aria-controls", value: `${menuId}` },
         { attr: "data-toggle", value: "popover" },
         { attr: "data-target", value: `#${menuId}` },
         { attr: "tabindex", value: "0" },
      );
      pop.setAttributes(
         { attr: "id", value: `${menuId}` },
         { attr: "class", value: "popup" },
         { attr: "role", value: "menu" },
         { attr: "aria-labelledby", value: `${targetId}` },
         { attr: "tabindex", value: "-1" },
      );
      menu.setAttributes(
         { attr: "role", value: "none" },
      );

      props.forEach(prop => {
         let button = createElement(prop.type, "btn-menu-item");
         let imgSpan = createElement("span", "icon");
         let textSpan = createElement("span");

         textSpan.innerText = prop.text;

         if (prop.type == "button") {
            button.addEventListener('click', prop.onclick, false);
         } else if (prop.type == "a") {
            button.setAttribute("href", prop.onclick);
         }

         if (prop.image) {
            imgSpan.classList.add(prop.image);
            button.appendChild(imgSpan);
         }

         button.appendChild(textSpan);
         menuItem.appendChild(button);
         menu.appendChild(menuItem);
         buttons.push(button);
      });

      pop.append(menu);
      target.after(pop);
   } catch (error) {
      console.error(error);
   }
}

/*-----------------------------------------------------
 *                  Selects nativos
 *-----------------------------------------------------*/
// Variables
let selects;

/**
 * Bootstrap de selects nativos
 */
function renderNativeSelects() {
   // Inicializacion de variables
   selects = getElements('select[class=list-data]');

   // Comportamiento de componentes
   selects.forEach(select => {
      let attr = select.getAttribute('data-select');
      let btn = getElement(`button[class=list-button][data-select=${attr}]`);

      select.addEventListener('mouseenter', (evt) => {
         evt.preventDefault();
         btn.style.backgroundColor = "#d6d6d6";
      }, false);

      select.addEventListener('mouseleave', (evt) => {
         evt.preventDefault();
         btn.style.backgroundColor = "#dfdfdf";
      }, false);

      select.addEventListener('focusin', (evt) => {
         evt.preventDefault();
         btn.style.border = '1px solid #4A4C7D';
         btn.style.boxShadow = "0 0 .25em .25em rgba(35, 102, 209, .2)";
      }, false);

      select.addEventListener('focusout', (evt) => {
         evt.preventDefault();
         btn.style.border = '1px solid #dbdbdb';
         btn.style.boxShadow = "none";
      }, false);
   });
}

/*-----------------------------------------------------
 *                      Tooltips
 *-----------------------------------------------------*/

// Variables
let tipTargets, tipDisplayTimeout;

let tipProps = {
   tip: null,
   isVisible: true
}

/**
 * Elimina un tooltip a partir de su elemento desencadenante.
 * @param {HTMLElement} target Elemento que contiene el tooltip a eliminar.
 */
export function deleteTip(target) {
   try {
      let tip = $(target.getAttribute('aria-describedby'));
      document.body.removeChild(tip);
   } catch (error) { }
}

/**
 * Construye un tooltip para un desencadenador especifico.
 * @param {HTMLElement} target Elemento desencadenador.
 * @param {string} title Cadena de texto para la informacion del tooltip.
 * @param {string} place Ubicacion del tooltip Arriba (top), Abajo (bottom), Izquierda (left) y Derecha (right).
 */
export function addTip(target, title = "", place = "") {
   const verifiedTitle = title == "" ? target.getAttribute('title') : title;
   target.setAttribute('data-placement',
      place == "" ? target.getAttribute('data-placement') : place);
   target.setAttribute('data-title', verifiedTitle);
   target.setAttribute('aria-describedby', `tooltip`);
   target.removeAttribute('title');

   const tooltip = createElement('span');
   tooltip.setAttribute('data-placement',
      place == "" ? target.getAttribute('data-placement') : place);
   tooltip.setAttribute('id', `tooltip`);
   tooltip.setAttribute('role', 'tooltip');
   tooltip.classList.add('tooltip');
   tooltip.textContent = verifiedTitle;

   target.addEventListener('mouseover', (evt) => {
      evt.preventDefault();

      document.body.append(tooltip);
      tooltip.style.display = 'block';
      tipProps.tip = tooltip;
      tipProps.isVisible = true;

      const targetPosition = offset(target);
      const tipPosition = offset(tooltip);
      const tipPlacement = target.getAttribute('data-placement');

      tipDisplayTimeout = setTimeout(() => { tooltip.style.opacity = '1'; }, 100);

      switch (tipPlacement) {
         // ------Tooltips Arriba------
         case 'top':
            tooltip.style.top = `${targetPosition.top - tipPosition.height - 8}px`;
            if (
               targetPosition.width < tipPosition.width &&
               (targetPosition.left > (tipPosition.width / 2 - targetPosition.width / 2))
            ) {
               tooltip.style.left
                  = `${targetPosition.left - (tipPosition.width / 2 - targetPosition.width / 2)}px`;
            } else {
               tooltip.style.left
                  = `${targetPosition.left + (targetPosition.width / 2 - tipPosition.width / 2)}px`;
            }
            tooltip.style.setProperty('--left-position', `${tipPosition.width / 2 - 6}px`);
            break;

         // ------Tooltips Abajo------
         case 'bottom':
            tooltip.style.top = `${targetPosition.top + 45}px`;
            if (
               targetPosition.width < tipPosition.width &&
               (targetPosition.left > (tipPosition.width / 2 - targetPosition.width / 2))
            ) {
               tooltip.style.left
                  = `${targetPosition.left - (tipPosition.width / 2 - targetPosition.width / 2)}px`;
            } else {
               tooltip.style.left
                  = `${targetPosition.left + (targetPosition.width / 2 - tipPosition.width / 2)}px`;
            }
            tooltip.style.setProperty('--left-position', `${tipPosition.width / 2 - 6}px`);
            break;

         // ------Tooltips Izquierda------
         case 'left':
            tooltip.style.top = `${targetPosition.top}px`;
            if (
               tipPosition.width > targetPosition.width
            ) {
               tooltip.style.left
                  = `${targetPosition.left - tipPosition.width - 8}px`;
            }

            if (
               tipPosition.width < targetPosition.width
            ) {
               tooltip.style.left
                  = `${targetPosition.left - targetPosition.width - (tipPosition.width - targetPosition.width) - 8}px`;
            }
            break;

         // ------Tooltips Derecha------
         case 'right':
            tooltip.style.top = `${targetPosition.top}px`;
            if (
               tipPosition.width > targetPosition.width
            ) {
               tooltip.style.left
                  = `${targetPosition.left + tipPosition.width + (targetPosition.width - tipPosition.width) + 8}px`;
            }

            if (
               tipPosition.width < targetPosition.width
            ) {
               tooltip.style.left
                  = `${targetPosition.left + targetPosition.width + 8}px`;
            }
            break;
         default:
            break;
      }
   }, false);

   target.addEventListener('mouseleave', (evt) => {
      evt.preventDefault();
      clearTimeout(tipDisplayTimeout);

      tooltip.style.display = 'none';
      tooltip.style.opacity = '0';

      deleteTip(target);

      tipProps.tip = null;
      tipProps.isVisible = false;
   }, false);
}

/**
 * Bootstrap de tooltips
 */
function renderTooltips() {
   tipTargets = getElements('[data-toggle=tooltip]');

   tipTargets.forEach(target => {
      addTip(target);
   });
}

/**
 * Evento Scroll que actualiza y oculta la visibilidad del tooltip.
 * @param {Event} evt Evento Scroll del objeto window.
 */
function windowOnScrollTooltip(evt) {
   evt.preventDefault();
   if (tipProps.tip && tipProps.isVisible) {
      tipProps.tip.style.display = 'none';
      tipProps.tip.style.opacity = '0';
   }
}

/*-----------------------------------------------------
 *            Campo de busqueda
 *-----------------------------------------------------*/

/**
 * Clase Search personalizado, agrega propiedades como componente.
 */
export class Search {

   // Variables privadas
   #options;
   #buttonItems;
   #keyboardCode;
   #mouseClickType;
   #optionIndex;
   #itemIndex;
   #dataLength;
   get LEFT_BUTTON_MOUSE_CLICK() { return 1 }

   /**
    * Constructor de la clase Search.
    * @param {string} search id del search del DOM 
    */
   constructor(search) {
      /**
       * Elemento input tipo search personalizado para ser un campo de busqueda
       */
      this.search = $(search);

      /**
       * Elemento span personalizado para ser una listbox
       */
      this.listbox = getElement(this.search.getAttribute('data-target'));

      /**
       * Elemento ul que esta dentro del listbox y contiene elementos li
       */
      this.menu = this.listbox.firstElementChild;

      /**
       * Arreglo de objetos que contiene el texto de cada item del listbox
       */
      this.data = [];

      /**
       * Arreglo de los elementos hijos (li) de this.menu (ul)
       */
      this.#options = [];

      /**
       * Arreglo de las etiquetas html <buttons> o <a> que contienen la clase 'btn-menu-item'
       */
      this.#buttonItems = [];

      /**
       * Codigo de tecla obtenido por el evento keydown en formato string
       */
      this.#keyboardCode = '';

      /**
       * Codigo en formato de numero entero de cada uno de los botones del mouse presionado
       */
      this.#mouseClickType;

      /**
       * Indice del arreglo de las opciones (this.#options),
       * es parte del atributo aria-activedescendant en el campo de busqueda
       * establece el estilo de cada item de la lista cuando se selecciona con
       * las flechas de navegacion del teclado
       */
      this.#optionIndex = 0;

      /**
       * Indice de cada item (li) de this.menu establecido en el atributo id=`option-${itemIndex}`
       */
      this.#itemIndex = 1;

      /**
       * Tamaño del arreglo de objetos de this.data
       */
      this.#dataLength = 0;

      this.#bind();
   }

   /**
    * Enlazamiento de propiedades iniciales
    * de los componentes.
    */
   #bind() {
      this.#onFocusOutDefault();
      this.#onKeydownDefualt();
      this.#onInputSearchDefault();
      this.#onFocusInDefault();
      this.#onMouseDownDefault();
      this.#onWindowResizeDefault();
      this.#onWindowLoadDefault();
      this.#onDocumentKeydownDefualt();
   }

   /**
    * El metodo permite el registro de eventos el Listener al search dinamicamente.
    * @param {string} type Especifica el Event.type asociado con el evento registrado por el usuario.
    * @param {Event} listener Funcion o callback como parametro.
    * @param {boolean} useCapture Si true, useCapture indica que el usuario
    *  desea agregar el listener del evento solo para la fase de captura,
    *  es decir, este listener del evento no se activará durante las fases objetivo
    *  y de propagación. Si es false, el listener del evento solo se activará durante las
    *  fases de destino y de propagación
    *
    * 1. La fase de captura (capture phase): el evento se envía a los a
    *    ncestros del destino desde la raíz del árbol al padre directo del nodo de destino.
    * 2. La fase de destino (target phase): el evento se envía al nodo de destino.
    * 3. La fase de propagación (bubbling phase): el evento se envía a los antepasados 
    *    ​​del destino desde el padre directo del nodo de destino a la raíz del árbol.
    */
   #event(type, listener, useCapture) {
      this.search.addEventListener(type, listener, useCapture);
   }

   /**
    * Elemento item de this.menu que tiene como parametro
    * una cadena de texto que sera desplegado como mensaje
    * @param {string} message cadena de texto como mensaje
    * @returns {HTMLElement} Elemento boton
    */
   #message(message) {
      const item = createElement('li', 'menu-item');
      const button = createElement('button', 'btn-menu-item');
      const span = createElement('span');

      button.style.justifyContent = 'center';
      button.style.pointerEvents = 'none';
      button.disabled = true;

      span.textContent = message;

      button.append(span);
      item.append(button);
      return item;
   }

   /**
    * Agrega y retorna un menu item para el search
    * @param {string} text Cadena de texto que contendra cada menu item
    * @param {string} typeButton Etiqueta <a> o <button> por defecto es <a>
    * @returns Elemento HTML
    */
   #item(text, typeButton = 'a') {
      const item = createElement('li', 'menu-item');
      item.setAttribute('role', 'option');
      item.setAttribute('id', `option-${this.#itemIndex++}`);

      const button = createElement(typeButton, 'btn-menu-item');
      const span = createElement('span');

      span.textContent = text;
      button.append(span);

      button.addEventListener('mousedown', (evt) => {
         evt.preventDefault();
         const mouseClickType = evt.buttons;

         if (mouseClickType === this.LEFT_BUTTON_MOUSE_CLICK) {
            this.search.value = button.textContent;
            this.listbox.style.display = 'none';
         }
      }, false);

      item.append(button);
      return item;
   }

   /**
    * Evento por defecto input del
    * search modo campos de busqueda
    */
   #onInputSearchDefault() {
      this.#event('input', (evt) => {
         evt.preventDefault();

         if (!evt.target.value) {
            this.#dataLength = 0;
            this.listbox.style.display = 'none';
         }
      }, {
         capture: true
      });
   }

   /**
    * Evento por defecto del search focusout.
    */
   #onFocusOutDefault() {
      this.#event('focusout', (evt) => {
         evt.preventDefault();

         this.#optionIndex = 0;
         this.listbox.style.display = 'none';

         this.#buttonItems.forEach((button) => {
            button.classList.remove('item-active');
         });
      }, false);
   }

   /**
    * Evento por defecto focusin del search.
    */
   #onFocusInDefault() {
      this.#event('focusin', (evt) => {
         evt.preventDefault();

         this.search.select();
         this.#options = this.menu.children;

         if (this.#mouseClickType === this.LEFT_BUTTON_MOUSE_CLICK
            || this.#keyboardCode == 'Tab') {
            this.#buttonItems = this.menu.querySelectorAll('[class=btn-menu-item]');
         }

      }, false);
   }

   /**
    * Evento por defecto de window resize.
    */
   #onWindowResizeDefault() {
      window.addEventListener('resize', (evt) => {
         this.listbox.style.left
            = (this.search.offsetLeft
               - this.search.scrollLeft
               + this.search.clientLeft)
            + "px";

         this.listbox.style.width
            = ((this.search.clientWidth - 1) + "px");
      }, false);
   }

   /**
    * Evento por defecto de window load.
    */
   #onWindowLoadDefault() {
      window.addEventListener('load', () => {
         this.listbox.style.left
            = (this.search.offsetLeft
               - this.search.scrollLeft
               + this.search.clientLeft)
            + "px";

         this.listbox.style.width
            = ((this.search.clientWidth - 1) + "px");
      }, false);
   }

   /**
    * Evento por defecto keydown del search.
    */
   #onKeydownDefualt() {
      this.#event('keydown', (evt) => {

         try {

            if (evt.code == 'Tab') {
               this.listbox.style.display = 'none';

               return;
            }

            if (evt.code == 'ArrowUp' && this.#dataLength > 0) {

               evt.preventDefault();

               if (this.listbox.style.display != 'none') {
                  this.#optionIndex = this.#optionIndex - 1;
               } else {
                  this.#optionIndex = this.#optionIndex;
               }

               if (this.#optionIndex < 1) {
                  this.#optionIndex = this.#dataLength;
               }

               this.search.setAttribute('aria-activedescendant',
                  `option-${this.#optionIndex}`);

               this.#buttonItems.forEach((button) => {
                  button.classList.remove('item-active');
               });

               this.#options[this.#optionIndex - 1]
                  .firstElementChild
                  .classList
                  .add('item-active');

               return;
            }

            if (evt.code == 'ArrowDown' && this.#dataLength > 0) {

               evt.preventDefault();

               if (this.listbox.style.display != 'none') {
                  this.#optionIndex = this.#optionIndex + 1;
               }

               if (
                  this.#optionIndex > this.#dataLength ||
                  (this.#optionIndex) <= 0
               ) {
                  this.#optionIndex = 1;
               }

               this.search.setAttribute('aria-activedescendant',
                  `option-${this.#optionIndex}`);

               this.#buttonItems.forEach((button) => {
                  button.classList.remove('item-active');
               });

               this.#options[(this.#optionIndex - 1)]
                  .firstElementChild
                  .classList
                  .add('item-active');

               return;
            }

            if (evt.code == 'Enter' && this.#dataLength > 0
               && (this.#optionIndex - 1) > -1) {

               evt.preventDefault();

               this.search.value = this.#options[this.#optionIndex - 1]
                  .firstElementChild
                  .textContent;

               this.listbox.style.display = 'none';

               return;
            }

            if (evt.code == 'Enter') {
               evt.preventDefault();
               return;
            }

         } catch (error) {
            console.error(error);
         }
      }, { capture: false });
   }

   /**
   * Evento por defecto de document keydown.
   */
   #onDocumentKeydownDefualt() {
      document.addEventListener('keydown', (evt) => {
         this.#keyboardCode = evt.code;
      }, false);
   }

   /**
    * Evento por defecto mousedown del search.
    */
   #onMouseDownDefault() {
      this.#event('mousedown', (evt) => {
         this.#mouseClickType = evt.buttons;
      }, false);
   }

   /**
    * Agrega un MenuItems al Search
    * al final del arreglo del listbox.
    * Ejemplo: search.add({ text: 'Hola Mundo' });
    * @param {Object} object Objeto del texto a agregar.
    */
   add(object) {
      this.data.push(object);
      return this;
   }

   /**
    * Remueve todos los elementos hijos de this.menu
    */
   clear() {
      this.data = [];
      while (this.menu.firstChild) {
         this.menu.firstChild.remove();
      }
   }

   /**
    * Dibuja en pantalla y agrega la lista de opciones al listbox
    */
   draw() {
      this.#itemIndex = 1;
      this.#optionIndex = 0;
      this.#dataLength = this.data.length;

      if (this.#dataLength <= 0) {
         this.menu.append(this.#message('⚠️ Dato no encontrado!'));
      } else if (this.#dataLength > 0) {
         this.data.forEach(item => {
            this.menu.append(this.#item(item.text));
         });
      }

      if (this.search.value) {
         this.listbox.style.display = 'block';
      }

      this.#buttonItems
         = this.menu.querySelectorAll('[class=btn-menu-item]');
   }

   /**
    * Inhabilita el search si es verdadero, de lo contrario
    * los respectivos elementos seran habilitado.
    * @param {boolean} isDisabled Verdadero si son inhabilitado, Falso si son habilitados
    */
   disable(isDisabled) {
      if (isDisabled) {
         this.search.setAttribute('disabled', isDisabled);
      } else {
         this.search.removeAttribute('disabled');
      }
      return this;
   }

}

/*-----------------------------------------------------
 *                     Spinners
 *-----------------------------------------------------*/
/**
 * Clase Spinnner personalizado, agrega propiedades
 * a un spin.
 */
export class Spinner {

   /**
    * Constructor de la clase Spinner.    
    */
   constructor() { }

   /**
    * Funcion personalizadora del componente spinner.
    * @param {string} spinnerId Id del spinner.
    */
   build(spinnerId) {
      this.spin = $(spinnerId);
      this.spinnerButtons = getElement(`span[data-spinner=${spinnerId}]`);
      this.btnUp = this.spinnerButtons.firstElementChild;
      this.btnDown = this.spinnerButtons.lastElementChild;
      this.#bindEvents();
   }

   /**
    * Enlaza las propiedades del input
    * spin con el boton de arriba y de abajo.
    */
   #bindEvents() {
      // Eventos click del botón de arriba y abajo
      this.btnUp.addEventListener('click', (evt) => {
         evt.preventDefault();
         if (this.spin == document.activeElement)
            this.spin.stepUp();
      }, false);

      this.btnDown.addEventListener('click', (evt) => {
         evt.preventDefault();
         if (this.spin == document.activeElement)
            this.spin.stepDown();
      }, false);

      // Eventos de enfoque del boton de arriba
      this.btnUp.addEventListener('focusin', (evt) => {
         evt.preventDefault();
         this.spin.focus();
         this.#focusButtons('#4A4C7D', 'rgba(35, 102, 209, .2)');
      }, false);

      this.btnUp.addEventListener('focusout', (evt) => {
         evt.preventDefault();
         this.spin.focus();
         this.#focusButtons('#dbdbdb', 'transparent');
      }, false);

      // Eventos de enfoque del boton de abajo
      this.btnDown.addEventListener('focusin', (evt) => {
         evt.preventDefault();
         this.spin.focus();
         this.#focusButtons('#4A4C7D', 'rgba(35, 102, 209, .2)');
      }, false);

      this.btnDown.addEventListener('focusout', (evt) => {
         evt.preventDefault();
         this.spin.focus();
         this.#focusButtons('#dbdbdb', 'transparent');
      }, false);

      // Evento de enfoque de input spin
      this.spin.addEventListener('focusin', (evt) => {
         evt.preventDefault();
         this.#focusButtons('#4A4C7D', 'rgba(35, 102, 209, .2)');
      }, false);

      this.spin.addEventListener('focusout', (evt) => {
         evt.preventDefault();
         this.#focusButtons('#dbdbdb', 'transparent');
      }, false);
   }

   /**
    * Establece de forma generica el color de los bordes
    * de los botones de arriba y abajo del componente spin.
    * @param {string} borderColor Color en cualquier formato RGB, RGBA, HEX...
    * @param {string} boxShadowColor Color de la sombra del componente.
    */
   #focusButtons(borderColor, boxShadowColor) {
      this.btnUp.style.border = `1px solid ${borderColor}`;
      this.btnDown.style.borderLeft = `1px solid ${borderColor}`;
      this.btnDown.style.borderRight = `1px solid ${borderColor}`;
      this.btnDown.style.borderBottom = `1px solid ${borderColor}`;
      this.btnUp.style.boxShadow = `0 0 .25em .25em ${boxShadowColor}`;
      this.btnDown.style.boxShadow = `0 0 .25em .25em ${boxShadowColor}`;
   }

   /**
    * Inhabilita al spinner y los botones del mismo cuando
    * es establecido como verdadero, de lo contrario
    * los respectivos elementos seran habilitado.
    * @param {boolean} isDisabled Verdadero si son inhabilitado, Falso si son habilitados
    */
   disable(isDisabled) {
      if (isDisabled) {
         this.spin.setAttribute('disabled', isDisabled);
         this.btnUp.setAttribute('disabled', isDisabled);
         this.btnDown.setAttribute('disabled', isDisabled);
         this.btnUp.style.pointerEvents = 'none';
         this.btnDown.style.pointerEvents = 'none';
      } else {
         this.spin.removeAttribute('disabled');
         this.btnUp.removeAttribute('disabled');
         this.btnDown.removeAttribute('disabled');
         this.btnUp.style.pointerEvents = 'full';
         this.btnDown.style.pointerEvents = 'full';
      }
   }

   /**
    * Cambia al spinner en modo edicion
    * cuando se establece como Verdadero,
    * de lo contrario en modo solo lectura (no editable)
    * @param {boolean} isEditable Verdadero si es editable, Falso si no es editable
    */
   editable(isEditable) {
      if (isEditable) {
         this.spin.removeAttribute('readonly');
      } else {
         this.spin.setAttribute('readonly', isEditable);
      }
   }
}

window.addEventListener('load', renderModals, false);
window.addEventListener('load', renderPopovers, false);
window.addEventListener('load', renderNativeSelects, false);
window.addEventListener('load', renderTooltips, false);
window.addEventListener('mousedown', windowOnMousedownPopover, false);
window.addEventListener('resize', windowOnResizePopover, false);
window.addEventListener('scroll', windowOnScrollTooltip, false);