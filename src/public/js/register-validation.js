// Supplementary to auth.js
// Purpose: to prevent registration of users that aren't supposed to be registered.

function validateUsernameOrPassword(e) {
    // at least 8 letters, otherwise add a error label to the bottom
    if (e.target.value.length < 8) {
        // add form-input-hint
        const newP = document.createElement('p');
        newP.classList.add('form-input-hint');
        newP.innerHTML = "Entered string is too short.";

        if (!e.target.classList.contains('is-error')) {
            if (e.target.classList.contains('is-success')) {
                e.target.classList.remove('is-success');
            }

            // add class
            e.target.classList.add('is-error');
            e.target.parentNode.appendChild(newP);
        } else {
            e.target.classList.remove('is-success');
        }
    } else {
        e.target.classList.replace('is-error', 'is-success');
        const validationHint = document.querySelector('p.form-input-hint');
        if (validationHint) {            
            validationHint.remove();
        }
    }

}

function validateButton(inputOne, inputTwo, registerButton) {
    if (inputOne.classList.contains('is-success') && inputTwo.classList.contains('is-success')) {
        registerButton.removeAttribute('disabled');
    } else {
        registerButton.setAttribute('disabled', '');
    }
}

function main() {
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const registerButton = document.querySelector('input[type="submit"]');

    // event listeners
    usernameInput.addEventListener('input', function (e) {
        validateUsernameOrPassword(e);
        validateButton(usernameInput, passwordInput, registerButton);
    });

    passwordInput.addEventListener('input', function (e) {
        validateUsernameOrPassword(e);
        validateButton(usernameInput, passwordInput, registerButton);
    });

}

document.addEventListener("DOMContentLoaded", main);