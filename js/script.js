/* global
    google, db, removeTags, createTag, addAttribute
*/

/**
 * Variable which contains the objects with the data
 */
let dbLocal;

/**
 * On the document load, load all events
 */
window.onload = loadEvents();

/**
 * Apply all events to the elements, and print the inputs
 */
function loadEvents() {
    if (localStorage.db == undefined) {
        upToLocalStorage(db);
    }
    downFromLocalStorage();
    loadInputs();
    let select = document.getElementById('typeMobility');
    select.addEventListener('change', loadInputs, false);
    let toggle = document.getElementById('filterToggle');
    toggle.addEventListener('click', function() {
        loadInputs();
        flipCard();
    }, false);
    let button = document.getElementById('search');
    button.addEventListener('click', applyFilter, false);
    let divCheckbox = document.getElementById('fieldNames');
    divCheckbox.addEventListener('change', enabledButton, false);
    let selectInput = document.getElementsByName('country')[0];
    selectInput.addEventListener('change', enabledButton, false);
    let addButton = document.getElementById('add');
    addButton.addEventListener('click', function() {
        showModal(document.getElementById('addMobility'));
    }, false);
    let closeButtons = document.getElementsByClassName('cancel');
    Array.prototype.forEach.call(closeButtons, (element) => {
        element.addEventListener('click', function() {
            closeModal(document.getElementById('addMobility'));
        });
    });
    let confirmButton = document.getElementById('confirmAdd');
    confirmButton.addEventListener('click', addMobility, false);
}

/**
 * When the main select element change, load the inputs (checkbox and select
 * countries) with the data from JSON
 */
function loadInputs() {
    let mobility = document.getElementsByName('typeMobility')[0];
    accordingToFilters(mobility.value);
}

/**
 * Load the arrays according to the filters, and print all the input elements
 * @param {string} filter the main filter from the typeMobility input
 */
function accordingToFilters(filter) {
    let filterMobility = new RegExp(filter, 'i');
    if (filter == '') {
        filterMobility = /.+/;
    }

    let arrayNames = [];
    let toggle = document.getElementsByName('filterToggle')[0];
    let nodeToRemove;

    if (!toggle.checked) {
        nodeToRemove = document.getElementById('fieldNames');
        arrayNames = loadArray('Seleccionar todos', true, filterMobility,
            'ciclo');
    }
    if (toggle.checked) {
        nodeToRemove = document.getElementById('fieldCountries');
        arrayNames = loadArray('Seleccione un país', false, filterMobility,
            'pais');
    }

    removeTags(nodeToRemove, false);
    let i = 0;

    if (!toggle.checked) {
        arrayNames.forEach((element) => {
            createCheckBox(i++, element);
        });
        document.querySelector('#fieldNames input[type=checkbox]').
        addEventListener('click', function() {
            selectAll(this);
        }, false);
    }
    if (toggle.checked) {
        arrayNames.forEach((element) => {
            createOption(element);
        });
    }
}

/**
 * Load the array with the data for the inputs elements
 * @param {string} firstElement Header element for the inputs
 * @param {boolean} displayThirdDiv Select which input wants show, if true show
 * checkbox, if false show select
 * @param {RegExp} filter Contain the filter from the input typeMobility
 * @param {string} contentOfArray The key's name which the function save on the
 * array
 * @return {Array}
 */
function loadArray(firstElement, displayThirdDiv, filter,
    contentOfArray) {
    let array = [];
    if (displayThirdDiv) {
        document.getElementById('thirdDiv').style.display = 'inherit';
        document.getElementById('forthDiv').style.display = '';
    } else {
        document.getElementById('thirdDiv').style.display = '';
        document.getElementById('forthDiv').style.display = 'inherit';
    }

    for (let element in dbLocal) {
        if (array.indexOf(dbLocal[element][contentOfArray]) == -1) {
            if (filter.test(dbLocal[element].tipo)) {
                array.push(dbLocal[element][contentOfArray]);
            }
        }
    }

    array.sort();
    array.unshift(firstElement);
    return array;
}

/**
 * Create and print the checkbox
 * @param {number} index Will be a part of the id, checkboxINDEX
 * @param {string} nameCiclo Will be the id, and the value of the checkbox
 */
function createCheckBox(index, nameCiclo) {
    let parent = document.getElementById('fieldNames');
    let id = `checkbox${index}`;
    let control = createTag(parent, 'div', null, 'control');
    let label = createTag(control, 'label', null, 'checkbox');
    addAttribute(label, ['for', id]);
    let input = createTag(label, 'input', id);
    addAttribute(input, ['type', 'checkbox'], ['name', 'nameCiclo'],
        ['value', nameCiclo]);
    label.appendChild(document.createTextNode(nameCiclo));
}

/**
 * Create and print the option
 * @param {string} element Will be the id, and the value of the option
 */
function createOption(element) {
    let parent = document.getElementById('fieldCountries');
    let option = createTag(parent, 'option');
    addAttribute(option, ['value', element]);
    option.innerText = element;
}

/**
 * Function to apply the properly class to flip the card
 */
function flipCard() {
    let card = document.getElementById('card');
    if (card.className == '') {
        card.className = 'flipped';
    } else {
        card.className = '';
    }
}

/**
 * Put all the checkbox checked
 * @param {HTMLElement} element Will be the checkbox which will put checked or
 * unchecked
 */
function selectAll(element) {
    let array = document.getElementsByName('nameCiclo');
    let option = false;
    if (element.checked) {
        option = true;
    }
    array.forEach((checkbox) => {
        checkbox.checked = option;
    });
}

/**
 * Enabled or disabled the button to call the map, according if there is a
 * checkbox selected, or a option that is not the first
 */
function enabledButton() {
    let toggle = document.getElementById('filterToggle');
    let checkboxsArray = document.querySelectorAll(
        'input[name=nameCiclo]:checked');
    let select = document.getElementsByName('country')[0];
    if (!toggle.checked) {
        if (checkboxsArray.length >= 1) {
            document.getElementById('search').disabled = false;
        }
        if (checkboxsArray.length < 1) {
            document.getElementById('search').disabled = true;
        }
    }
    if (toggle.checked) {
        if (select.value != 'Seleccione un país') {
            document.getElementById('search').disabled = false;
        }
        if (select.value == 'Seleccione un país') {
            document.getElementById('search').disabled = true;
        }
    }
}

/**
 * According the filters from the inputs on the header, fill the array with
 * all the "ciclos" which coincide, then beatufy the array, and call the map
 */
function applyFilter() {
    document.getElementById('search').disabled = true;
    let arrayWithData = [];
    let toggle = document.getElementById('filterToggle');
    let selectTypeMobility = document.getElementsByName('typeMobility')[0];
    selectTypeMobility = new RegExp(selectTypeMobility.value, 'i');
    if (selectTypeMobility == '') {
        selectTypeMobility = /.+/;
    }

    if (!toggle.checked) {
        let checkboxsArray = document.querySelectorAll(
            'input[name=nameCiclo]:checked');

        checkboxsArray.forEach((checkbox) => {
            for (let element in dbLocal) {
                if (selectTypeMobility.test(dbLocal[element].tipo)) {
                    if (dbLocal[element].ciclo == checkbox.value) {
                        arrayWithData.push([dbLocal[element].ciudad,
                            dbLocal[element].ciclo]);
                    }
                }
            }
        });
    }
    if (toggle.checked) {
        let selectCountry = document.getElementsByName('country')[0];

        for (let element in dbLocal) {
            if (selectTypeMobility.test(dbLocal[element].tipo)) {
                if (dbLocal[element].pais == selectCountry.value) {
                    arrayWithData.push([dbLocal[element].ciudad,
                        dbLocal[element].ciclo]);
                }
            }
        }
    }
    arrayWithData = beautifyArray(arrayWithData);
    mapGoogle(arrayWithData);
}

/**
 * First join by the city's name, and the delete repeated elements
 * @param {Array} array Array uglify
 * @return {Array} The array beautify
 */
function beautifyArray(array) {
    let newArray = [];

    for (let i = 0; i < array.length; i++) {
        let childArray = [];
        for (let j = 0; j < array.length; j++) {
            if (array[i][0].nombre == array[j][0].nombre) {
                childArray.push(array[j][1]);
            }
        }
        if (newArray.indexOf(array[i][0]) == -1) {
            newArray.push([array[i][0], childArray]);
        }
    }

    for (let i = newArray.length - 1; i > 0; i--) {
        for (let j = newArray.length - 1; j > 0; j--) {
            if (i == j) {
                j--;
            }
            if (newArray[i][0].nombre == newArray[j][0].nombre) {
                newArray.splice(j, 1);
                j++;
                i--;
            }
        }
    }
    return newArray;
}

/**
 * Set all the map, markers, center according the markers, and infoWindow
 * @param {Array} arrayWithData
 */
function mapGoogle(arrayWithData) {
    let map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 6,
        center: new google.maps.LatLng(arrayWithData[0][0].latitud,
            arrayWithData[0][0].longitud),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    let bounds = new google.maps.LatLngBounds();

    let infoWindow = new google.maps.InfoWindow();

    for (let i = 0; i < arrayWithData.length; i++) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(
                arrayWithData[i][0].latitud,
                arrayWithData[i][0].longitud
            ),
            map: map,
            animation: google.maps.Animation.BOUNCE,
        });

        if (arrayWithData.length != 1) {
            bounds.extend(marker.position);
        }

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(
                    `<strong>${arrayWithData[i][0].nombre}</strong>
                    </br>
                    ${arrayWithData[i][1].join('</br>')}`
                );
                infoWindow.open(map, marker);
            };
        })(marker, i));
    }
    if (arrayWithData.length != 1) {
        map.fitBounds(bounds);
    }
    location.href = '#googleMap'; // Move the view to the div
}

/**
 * Save in localStorage the data
 * @param {Object} element
 */
function upToLocalStorage(element) {
    localStorage.setItem('db', JSON.stringify(element));
}

/**
 * Put de data from localStorage in the var dbLocal
 */
function downFromLocalStorage() {
    dbLocal = JSON.parse(localStorage.getItem('db'));
}

/**
 * Active the modal
 * @param {HTMLElement} modal
 */
function showModal(modal) {
    modal.classList.add('is-active');
    document.getElementById('coordinates').value = '';
    loadMapModal();
}

/**
 * Hide the modal
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
    modal.classList.remove('is-active');
}

/**
 * Validate the field is not empty
 * @param {HTMLElement} input Field to validate
 * @return {boolean} Return false if is empty, true if not empty
 */
function validityRequiredInput(input) {
    let check = false;
    if (input.value != '') {
        check = true;
    }
    return check;
}

/**
 * Load de modal's map, and establish the event click
 */
function loadMapModal() {
    let map = new google.maps.Map(document.getElementById('googleMapM'), {
        zoom: 4,
        center: new google.maps.LatLng(49.61070993807422, 20.390625),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(map, event.latLng);
    });
}

/**
 * Put the marker where there is a click, and fill the field coordinates
 * @param {Object} map
 * @param {Object} location
 */
function placeMarker(map, location) {
    new google.maps.Marker({
        position: location,
        map: map,
    });
    document.getElementById('coordinates').value =
        `${location.lat().toString()}, ${location.lng().toString()}`;
    google.maps.event.clearListeners(map);
}

/**
 * Handler from Add button, validate all the fields, and call the function
 * which get the country and city according coordinates
 */
function addMobility() {
    let typeMobility = document.getElementById('typeMobilityM');
    let cicloName = document.getElementById('cicloM');
    let coordinates = document.getElementById('coordinates');
    if (!validityRequiredInput(typeMobility)) {
        typeMobility.parentElement.classList.add('is-danger');
        typeMobility.focus();
        event.preventDefault();
        return;
    }
    if (!validityRequiredInput(cicloName)) {
        typeMobility.parentElement.classList.remove('is-danger');
        cicloName.parentElement.classList.add('is-danger');
        cicloName.focus();
        event.preventDefault();
        return;
    }
    if (!validityRequiredInput(coordinates)) {
        cicloName.parentElement.classList.remove('is-danger');
        coordinates.classList.add('is-danger');
        coordinates.focus();
        event.preventDefault();
        return;
    }
    coordinates.classList.remove('is-danger');
    getDataFromCoords();

    closeModal(document.getElementById('addMobility'));
}

/**
 * Mount the array with all information to add the new object
 */
function getDataFromCoords() {
    let tempArray = document.getElementById('coordinates').value.split(',');
    let latlng = {lat: parseFloat(tempArray[0]), lng: parseFloat(tempArray[1])};
    let country;
    let city;
    let array = [];

    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng},
    function(results, status) {
        if (status === 'OK') {
            for (let i = 0; i < results[0].address_components.length; i++) {
                if (results[0].address_components[i].types[0] == 'country') {
                    country = results[0].address_components[i].long_name;
                }
                if (results[0].address_components[i].types[0] == 'locality') {
                    city = results[0].address_components[i].long_name;
                }
            }
        }
        array.push(document.getElementById('typeMobilityM').value);
        array.push(document.getElementById('cicloM').value);
        array.push(country);
        array.push(city);
        array.push(latlng.lat);
        array.push(latlng.lng);
        addToObject(array);
    });
}

/**
 * Add the object to db
 * @param {Array} array Struct:
 * Position     Value
 * 0            tipo
 * 1            ciclo
 * 2            pais
 * 3            nombre ciudad
 * 4            latitud
 * 5            longitud
 */
function addToObject(array) {
    let id;
    switch (array[0]) {
        case 'Grado Superior':
            id = 'GS';
            break;
        case 'Grado Medio':
            id = 'GM';
            break;
        case 'Profesorado':
            id = 'Pr';
            break;
    }

    let stringDB = JSON.stringify(dbLocal);
    let number = parseInt(stringDB.slice(
        (stringDB.lastIndexOf(`movilidad${id}`)) + 11,
        (stringDB.lastIndexOf(`movilidad${id}`)) + 13
    ));
    if (number < 9) {
        id += '0' + (number + 1);
    } else {
        id += (number + 1);
    }
    stringDB = stringDB.slice(0, stringDB.length - 1); // Remove the last }
    stringDB += `,"movilidad${id}": { 
        "tipo": "${array[0]}", 
        "ciclo": "${array[1]}", 
        "pais": "${array[2]}", 
        "ciudad": { 
            "nombre": "${array[3]}", 
            "latitud": "${array[4]}", 
            "longitud": "${array[5]}"
        }}}`;
    upToLocalStorage(JSON.parse(stringDB));
    downFromLocalStorage();
}
