
// @ts-check

import { $ } from "./ui-bic.js";

let yearInput = $('year');
let yearPbl = $('yearPbl');
let monthPubl = $('mesPublicacion');
let dayPbl = $('diaPublicacion');

let datePickerOptions = {
   format: 'yyyy',
   pickLevel: 2,
   minDate: 1900,
};

let datePickerOptionsDay = {
   format: 'DD'
};

let datePickerOptionsMonth = {
   format: 'MM',
   
};

let years = new Datepicker(yearInput, datePickerOptions);
let yearPblication = new Datepicker(yearPbl, datePickerOptions);
let monthPublication = new Datepicker(monthPubl, datePickerOptionsMonth);
let dayPublication = new Datepicker(dayPbl, datePickerOptionsDay);



