console.log("JavaScript caricato correttamente");


(function() {
	// Prendo tutti gli elementi accedibutton e ci aggiungo un event listener
	document.querySelectorAll('accedibutton').forEach(button => {
		        console.log("Pulsante trovato:", button); // Verifica che i pulsanti vengano rilevati

		button.addEventListener('click', function() {
			            console.log("Pulsante cliccato:", this); // Verifica che il clic venga registrato

			// Recupera il valore dell'attributo data-token
			const token = this.getAttribute('data-tokenf');
            console.log("Token:", token); // Verifica che il token venga letto

			// Memorizza il token nella sessione
			// sessionStorage.setItem('fileToken', token);

			// Effettua una chiamata GET usando la funzione makeCall
			makeCall("GET", 'AccediServlet?fileToken=' + token,
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						// Una volta ricevuta la risposta testuale da LoginServlet
						if (x.status === 200) { // OK
							// Convertiamo la risposta JSON in un oggetto JavaScript
							console.log(x.responseText); // Debug della risposta
							const risposta = JSON.parse(x.responseText);
							document.getElementById("nomedocumento").textContent = risposta.nomedocumento;
							document.getElementById("email").textContent = risposta.email;
							document.getElementById("data").textContent = risposta.data;
							document.getElementById("sommario").textContent = risposta.sommario;
							document.getElementById("tipo").textContent = risposta.tipo;
							document.getElementById("nomecartella").textContent = risposta.nomecartella;


						} else {
							console.error("Something went wrong.");
						}
					}
				}
			);
		});
	});
})();





function makeCall(method, url, cback, reset = true) {
	var req = new XMLHttpRequest(); // creo una nuova richiesta HTTP

	// questa funzione chiama CALLBACK quando lo stato della richiesta cambia
	// ASSOCIO UN EVENTO AL CAMBIAMENTO DI STATO
	req.onreadystatechange = function() {
		if (req.readyState === XMLHttpRequest.DONE) {
			cback(req); // cback è la funzione che ho definito sopra
		}
	};

	req.open(method, url); // post, loginservlet
	req.send(); // invia  la richiesta

}

