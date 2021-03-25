export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
    });
}

export function closeDialog(dialog) {
    dialog.style.display = "none";
}

export function clone(element, rootElement){
    let clonedElement = element.cloneNode(true);
    
    rootElement.appendChild(clonedElement)
    console.log("cloned", element, clonedElement);

    return clonedElement;
}

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Update the address bar URL parameters.
 *
 * To remove a param from the URL simply supply paramVal as null or undefined.
 *
 * Function call example:
 *  window.history.replaceState('', '', updateURLParameter(window.location.href, param, paramVal));
 *
 * Based on: https://stackoverflow.com/a/10997390/13519872
 * @param url
 * @param param
 * @param paramVal      If null or undefined; remove the param from URL.
 * @returns {string}
 */
 export function updateURLParameter(url, param, paramVal) {
    let baseURL = url.split("?")[0];
    let paramsURL = url.split("?")[1];
    let anchor = paramsURL ? paramsURL.split("#")[1]: null;
    let params = baseURL.split("#")[0];

    if (paramsURL) {
        // If URL has any current parameters:
        let updatedParamArray = [];

        if(anchor && paramVal) {
            paramsURL = paramsURL.split("#")[0];
            paramVal += "#" + anchor;
        }

        // Iterate through the array of parameters, in order to update param in-place.
        let paramAlreadyExists = false;
        let paramArray = paramsURL.split("&");
        for (let i = 0; i < paramArray.length; i++) {
            let curParam = paramArray[i].split('=')[0];

            if(curParam === param) {
                paramAlreadyExists = true;

                if (paramVal) {
                    // Append the modified param, else omit it as null paramVal indicates we want it gone.
                    updatedParamArray.push(`${param}=${paramVal}`)
                } else {
                    // Push null to avoid issues with length check not triggering.
                    updatedParamArray.push(null);
                }
            } else {
                // Append the unmodified param.
                updatedParamArray.push(paramArray[i]);
            }
        }

        if (!paramAlreadyExists) {
            if (paramVal) {
                // If param did not already exist, append it to the array.
                updatedParamArray.push(`${param}=${paramVal}`)
            } else {
                // Push null to avoid issues with length check not triggering.
                updatedParamArray.push(null);
            }
        }

        if (updatedParamArray.length > 1) {
            // If there are multiple, return baseURL with params joined by separator.
            let updatedParamArrayWithoutNullValues = updatedParamArray.filter(x => x !== null);

            return `${baseURL}?${updatedParamArrayWithoutNullValues.join('&')}`;
        } else {
            if (paramVal) {
                // Return baseURL with a single param.
                return `${baseURL}?${updatedParamArray[0]}`;
            } else {
                // If paramVal is null and there is only one param,
                // there are actually no params, so we'll return baseURL.
                return baseURL;
            }
        }
    } else {
        // If URL doesn't have any current parameters:
        if(params) {
            baseURL = params;
        }

        if (paramVal) {
            // Return baseURL with a single param.
            return `${baseURL}?${param}=${paramVal}`;
        } else {
            // If paramVal is null, return baseURL as we don't want to set any params by mistake.
            return baseURL;
        }
    }
}
