// #region Play with Elements from the HTML

/**
 * Create a input element with the following structure: p>label>span+input.
 * Or a button input type: button element with the following structure:
 * p>input:button
 * This structure allows better accessibility.
 * @param {(Object|string)} parent Parent where you want put the tag HTML,
 * accept a string with a id, or accept the element node parent
 * @param {string} labelContent Content will be the text the one that
 * accompanies the tag, if typeValue is "button", that will be the button's text
 * @param {string} typeValue Value for the "type" attribute of input tag
 * @param {string} idValue Value for the "id" attribute of input tag
 * @return {HTMLParagraphElement} Return the element p, which contains the rest
 * of tags
 */
function createInputTag(parent, labelContent, typeValue, idValue) {
    var paragraphTag = document.createElement('p');

    var labelTag;
    if (typeValue == 'button') {
        labelTag = document.createElement('input');
        labelTag.type = typeValue;
        labelTag.value = labelContent;
        labelTag.id = idValue;
    }

    if (typeValue != 'button') {
        labelTag = document.createElement('label');
        labelTag.setAttribute('for', idValue);
        labelTag.innerText = labelContent;

        var inputTag = document.createElement('input');
        inputTag.type = typeValue;
        inputTag.id = idValue;
    }
    paragraphTag.appendChild(inputTag);
    paragraphTag.appendChild(labelTag);
    if (typeof (parent) == 'string') {
        parent = document.getElementById(parent);
    }
    parent.appendChild(paragraphTag);
    return paragraphTag;
}

/**
 * Set one or more attributes to a element written in the HTML
 * @param {(Object|string)} id Id or nodeElement where want add the attribute
 * @param {Array.<Attributes>} attributes Attributes to add to the tag
 */
function addAttribute(id, ...attributes) {
    var attributesMap = new Map(attributes);

    for (var [key, value] of attributesMap.entries()) {
        if (typeof (id) == 'string') {
            id = document.getElementById(id);
        }
        id.setAttribute(key, value);
    }
}

/**
 * Create a HTML element with a id, inside of a parent
 * @param {(Object|string)} parent Parent where you want put the tag HTML,
 * accept a string with a id, or accept the element node parent
 * @param {string} tagName Element tag name
 * @param {?string} idValue Value id, could be null
 * @param {?string} classValue
 * @return {HTMLElement} The element which has just been created
 */
function createTag(parent, tagName, idValue, classValue) {
    var tagElement = document.createElement(tagName);
    if (idValue != null) {
        tagElement.id = idValue;
    }
    if (classValue != null) {
        tagElement.className = classValue;
    }
    if (typeof (parent) == 'string') {
        parent = document.getElementById(parent);
    }
    parent.appendChild(tagElement);
    return tagElement;
}

/**
 * Remove a element HTML
 * @param {(Object|string)} parent Parent where you want remove the tag HTML,
 * accept a string with a id, or accept the element node parent
 * @param {(Object|string)} myself Node which you want remove, accept a string
 * with a id, or accept the element node parent
 */
function removeTag(parent, myself) {
    if (typeof (parent) == 'string') {
        parent = document.getElementById(parent);
    }
    if (typeof (myself) == 'string') {
        myself = document.getElementById(myself);
    }
    parent.removeChild(myself);
}

/**
 * Clone and add a node, the parent is the origin and destination
 * @param {(Object|string)} parent Parent where and to where you want copy and
 * add the tag HTML, accept a string with a id, or accept the element node
 * parent
 * @param {(Object|string)} node Node which you want duplicate, accept a
 * string with a id, or accept the element node parent
 */
function copyPasteTag(parent, node) {
    if (typeof (parent) == 'string') {
        parent = document.getElementById(parent);
    }
    if (typeof (node) == 'string') {
        node = document.getElementById(node);
    }
    var newNode = node.cloneNode(true);
    parent.appendChild(newNode);
}

/**
 * A function to remove a elementHTML and all the childNodes
 * @param {HTMLElement} node Node to remove
 * @param {boolean} removeItSelf True if wants remove the param node
 * @see {@link clear}
 */
function removeTags(node, removeItSelf) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
    if (removeItSelf) {
        node.remove();
    }
}

/**
 * Function to help removeTags function
 * @param {node} node
 */
function clear(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
    node.parentNode.removeChild(node);
}

// #endregion
