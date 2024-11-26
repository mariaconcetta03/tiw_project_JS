

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

	req.open(method, url); // post, loginservlet

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

