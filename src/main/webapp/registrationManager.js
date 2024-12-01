
(function() {

	// prendo l'elemento registrationbutton e ci aggiunto un event listener che in base al click manda 
	// i risultati con un metodo POST (tramite MakeCall) a RegistrationServlet
	document.getElementById("registrationbutton").addEventListener('click', (e) => {

		// prendo gli elementi del form HTML
		const password = document.getElementById('password').value;
		const confirmPassword = document.getElementById('password_conf').value;
		const errorMessage = document.getElementById('errormessage');

		// controllo se le password coincidono
		if (password !== confirmPassword) {
			event.preventDefault(); // Impedisce l'invio del form
			errorMessage.textContent = "Le due password non coincidono. Riprova";
			return;
		}


		var form = e.target.closest("form");
		if (form.checkValidity()) {
			makeCall("POST", 'RegistrationServlet', e.target.closest("form"),
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						// una volta ricevuta la risposta testuale da RegistrationServlet, in base al caso in cui siamo (status) 
						// settiamo messaggio di errore ed eventualmente (caso OK) reindirizziamo a HomeServlet
						switch (x.status) {
							case 200: // OK
								sessionStorage.setItem('email', message);
								window.location.href = "HomeServlet";
								break;
							case 400: // bad request
								document.getElementById("errormessage").textContent = message;
								break;
							case 500: // server error
								document.getElementById("errormessage").textContent = message;
								break;
						}
					}
				}
			);
		} else {
			form.reportValidity(); // controllo di validità dei dati inseriti nei campi del form
		}
	});

})();








function makeCall(method, url, formElement, cback, reset = true) {
	var req = new XMLHttpRequest(); // creo una nuova richiesta HTTP

	// questa funzione chiama CALLBACK quando lo stato della richiesta cambia
	// ASSOCIO UN EVENTO AL CAMBIAMENTO DI STATO
	req.onreadystatechange = function() {
		if (req.readyState === XMLHttpRequest.DONE) {
			cback(req); // cback è la funzione che ho definito sopra
		}
	};

	req.open(method, url); // post, RegistrationServlet

	if (formElement == null) {
		req.send();
	} else {
		const formData = new URLSearchParams(new FormData(formElement)).toString();
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send(formData); // invio i dati
	}

	if (formElement !== null && reset === true) {
		formElement.reset();
	}
}

