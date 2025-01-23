

(function() {
	// prendo l'elemento loginbutton e ci aggiunto un event listener che in base al click manda 
	// i risultati con un metodo POST (tramite MakeCall) a LoginServlet
	document.getElementById("loginbutton").addEventListener('click', (e) => {

		var form = e.target.closest("form");
		if (form.checkValidity()) {
			makeCall("POST", 'LoginServlet', e.target.closest("form"),
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						// una volta ricevuta la risposta testuale da LoginServlet, in base al caso in cui siamo (status) 
						// settiamo messaggio di errore ed eventualmente (caso OK) reindirizziamo a HomeServlet
						switch (x.status) {
							case 200: // OK
								sessionStorage.setItem('email', message);
								window.location.href = "HomeServlet";
								break;
							case 401: // unauthorized
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
			// se i campi fillati non sono validi, allora mostra un messaggio predefinito
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

	req.open(method, url); // in questo caso: post, loginservlet

	if (formElement == null) { //se ho form vuoto/non esiste
		req.send();
	} else {
		const formData = new URLSearchParams(new FormData(formElement)).toString();
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //contenuto richiesta è form
		req.send(formData); // invio i dati
	}

	if (formElement !== null && reset === true) {
		formElement.reset(); // cancello i campi dagli input
	}
}

