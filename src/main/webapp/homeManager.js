console.log("JavaScript caricato correttamente");

document.addEventListener('DOMContentLoaded', function() { // ci assicuriamo che questo file javascript venga caricato
	// solamente quando l'HTML è caricato (DOM)

	// Prendo tutti gli elementi accedibutton e ci aggiungo un event listener
	document.querySelectorAll('.accedi').forEach(button => {
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
});




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



/**----------------------------------------------------------**/
// adding new subfolder

document.addEventListener('DOMContentLoaded', function() {
	// Trova tutti i bottoni "AGGIUNGI SOTTOCARTELLA"
	document.querySelectorAll('.addsubfolder').forEach(button => {
		button.addEventListener('click', function() {

			// Recupera il valore dell'attributo data-token (token della CARTELLA)
			const token = this.getAttribute('data-token');
			console.log("Token:", token); // Verifica che il token venga letto

			// Se il campo di input esiste già, non fare nulla
			const formBox = document.getElementById('form-box1');
			// Controlla se il form box contiene già elementi
			if (formBox && formBox.children.length > 0) {
				return; // Esci se il form box contiene elementi
			}

			// Crea il campo di input per far inserire all'utente il nome della sottocartella
			const input = document.createElement('input');
			const contenitore1 = document.getElementById('form-box1');
			const contenitore2 = document.getElementById('form-box2');


			input.type = 'text';
			input.placeholder = 'Nome sottocartella';

			// Crea un pulsante per confermare l'aggiunta della sottocartella
			const confermaButton = document.createElement('button');
			confermaButton.textContent = 'CREA';

			// Aggiungi l'input e il pulsante nel FORM BOX sotto
			contenitore1.appendChild(input);
			contenitore2.appendChild(confermaButton);


			// Event listener per il pulsante di conferma
			confermaButton.addEventListener('click', () => {
				const nomeSottocartella = input.value.trim(); // prendo il nome inserito dall'utente
				// TRIM: rimuovo gli spazi ad inizio e fine testo, e anche il terminatore di stringa

				// se l'utente non inserisce un nome
				if (nomeSottocartella === '') {
					alert('Inserisci un nome valido per la sottocartella!');
					return;
				}


				makeCall("POST", 'NewSubfolderServlet?folderToken=' + token + '&nome=' + nomeSottocartella,
					function(x) {
						if (x.readyState == XMLHttpRequest.DONE) {
							// Una volta ricevuta la risposta testuale da LoginServlet
							if (x.status === 200) { // OK
								console.log('Cartella creata correttamente');
							}
						}
					}
				);


				// Rimuovi il campo di input e il bottone di conferma
				input.remove();
				confermaButton.remove();

				location.reload(); //per ricaricare la pagina

			});
		});
	});
});



/**----------------------------------------------------------**/
// adding new file


document.addEventListener('DOMContentLoaded', function() {
	// Trova tutti i bottoni "AGGIUNGI FILE"
	document.querySelectorAll('.addfile').forEach(button => {
		button.addEventListener('click', function() {

			// Recupera il valore dell'attributo data-token (token della CARTELLA)
			const token = this.getAttribute('data-token');
			console.log("Token:", token); // Verifica che il token venga letto

			// Se il campo di input esiste già, non fare nulla
			const formBox = document.getElementById('form-box1');
			// Controlla se il form box contiene già elementi
			if (formBox && formBox.children.length > 0) {
				return; // Esci se il form box contiene elementi
			}

			// Crea il campo di input per far inserire all'utente il nome del file
			const contenitore1 = document.getElementById('form-box1');
			const contenitore2 = document.getElementById('form-box2');

			const contenitore3 = document.getElementById('form-box3');

			const contenitore4 = document.getElementById('form-box4');


			const input1 = document.createElement('input');
			input1.type = 'text';
			input1.placeholder = 'Nome file';

			const input2 = document.createElement('input');
			input2.type = 'text';
			input2.placeholder = 'Sommario (facoltativo)';

			const input3 = document.createElement('input');
			input3.type = 'text';
			input3.placeholder = 'Tipo';



			// Crea un pulsante per confermare l'aggiunta della sottocartella
			const confermaButton = document.createElement('button');
			confermaButton.textContent = 'CREA';

			// Aggiungi l'input e il pulsante nel FORM BOX sotto
			contenitore1.appendChild(input1);
			contenitore2.appendChild(input2);
			contenitore3.appendChild(input3);
			contenitore4.appendChild(confermaButton);


			// Event listener per il pulsante di conferma
			confermaButton.addEventListener('click', () => {
				const nomeFile = input1.value.trim(); // prendo il nome inserito dall'utente
				const sommarioFile = input2.value.trim();
				const tipoFile = input3.value.trim();
				// TRIM: rimuovo gli spazi ad inizio e fine testo, e anche il terminatore di stringa

				// se l'utente non inserisce un nome
				if (nomeFile === '') {
					alert('Inserisci un nome valido per il file!');
					return;
				} else if (tipoFile === '') {
					alert('Inserisci un tipo valido per il file!');
					return;
				}


				makeCall("POST", 'NewFileServlet?folderToken=' + token + '&nome=' + nomeFile + '&sommario=' + sommarioFile + '&tipo=' + tipoFile,
					function(x) {
						if (x.readyState == XMLHttpRequest.DONE) {
							// Una volta ricevuta la risposta testuale da LoginServlet
							if (x.status === 200) { // OK
								console.log('File creato correttamente');
							}
						}
					}
				);


				// Rimuovi il campo di input e il bottone di conferma
				input1.remove();
				input2.remove();
				input3.remove();
				confermaButton.remove();

				location.reload(); //per ricaricare la pagina

			});
		});
	});
});

