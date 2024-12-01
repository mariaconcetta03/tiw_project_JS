function setupAccediButtons() {

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

				// Effettua una chiamata GET usando la funzione makeCall
				makeCall("GET", 'AccediServlet?fileToken=' + token,
					function(x) {
						if (x.readyState == XMLHttpRequest.DONE) {
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
								alert("C'è stato un errore del server durante il reperimento dei dati del file");
								return;
							}
						}
					}
				);
			});
		});
	});
}






function makeCall(method, url, cback) {
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


/* CHIUDI BOTTONE PER FILE */
document.addEventListener('DOMContentLoaded', function() { // ci assicuriamo che questo file javascript venga caricato
	// solamente quando l'HTML è caricato (DOM)

	// Prendo tutti gli elementi accedibutton e ci aggiungo un event listener
	document.querySelectorAll('#clearbutton').forEach(button => {
		console.log("Pulsante trovato:", button); // Verifica che i pulsanti vengano rilevati

		button.addEventListener('click', function() {
			console.log("Pulsante cliccato:", this); // Verifica che il clic venga registrato

			document.getElementById("nomedocumento").textContent = "";
			document.getElementById("email").textContent = "";
			document.getElementById("data").textContent = "";
			document.getElementById("sommario").textContent = "";
			document.getElementById("tipo").textContent = "";
			document.getElementById("nomecartella").textContent = "";
		}
		);
	});
});











/**----------------------------------------------------------**/
// adding new subfolder
function setupSubfolderCreation() {


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
								if (x.status === 200) { // OK
									console.log('Cartella creata correttamente');
								} else {
									alert("C'è stato un errore del server durante la creazione della cartella");
									return;
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

}



/**----------------------------------------------------------**/
// adding new file

function setupFileCreation() {

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
								if (x.status === 200) { // OK
									console.log('File creato correttamente');
								} else {
									alert("C'è stato un errore del server durante la creazione del file");
									return;
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
}



/** ------------------------ **/
//adding a root folder

function setupFolderCreation() {
	document.addEventListener('DOMContentLoaded', function() {
		document.querySelectorAll('.addrootfolder').forEach(button => {
			button.addEventListener('click', function() {

				// Se il campo di input esiste già, non fare nulla
				const formBox = document.getElementById('form-box1');
				// Controlla se il form box contiene già elementi
				if (formBox && formBox.children.length > 0) {
					return; // Esci se il form box contiene elementi
				}

				// Prendo i contenitori dall'HTML
				const contenitore1 = document.getElementById('form-box1');
				const contenitore2 = document.getElementById('form-box2');

				const input1 = document.createElement('input');
				input1.type = 'text';
				input1.placeholder = 'Nome cartella ROOT';

				// Crea un pulsante per confermare l'aggiunta della cartella
				const confermaButton = document.createElement('button');
				confermaButton.textContent = 'CREA';

				// Aggiungi l'input e il pulsante nel FORM BOX sotto
				contenitore1.appendChild(input1);
				contenitore2.appendChild(confermaButton);

				// Event listener per il pulsante di conferma
				confermaButton.addEventListener('click', () => {
					const nomeFolder = input1.value.trim(); // prendo il nome inserito dall'utente

					// se l'utente non inserisce un nome
					if (nomeFolder === '') {
						alert('Inserisci un nome valido per la cartella!');
						return;
					}

					makeCall("POST", 'NewRootFolderServlet?nomeCartella=' + nomeFolder,
						function(x) {
							if (x.readyState == XMLHttpRequest.DONE) {
								if (x.status === 200) { // OK
									// Aggiungi dinamicamente la sottocartella al DOM
									const subfolder = document.createElement('li');
									subfolder.className = 'folder';
									subfolder.draggable = true;
									subfolder.dataset.token = x.responseText; // il server restituisce il token della nuova cartella
									subfolder.innerHTML = `
                                        ${nomeFolder}
                                        <input id="aggiungisottocartellabutton" class="addsubfolder" type="button" value="AGGIUNGI SOTTOCARTELLA" data-token="${x.responseText}">
                                        <input id="aggiungifilebutton" class="addfile" type="button" value="AGGIUNGI FILE" data-token="${x.responseText}">
                                    `;

									// Aggiungi manualmente gli event listeners ai miei bottoni nuovi
									const addSubfolderButton = subfolder.querySelector('.addsubfolder');
									const addFileButton = subfolder.querySelector('.addfile');

									if (addSubfolderButton) {
										addSubfolderButton.addEventListener('click', function() {

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
															if (x.status === 200) { // OK
																console.log('Cartella creata correttamente');
															} else {
																alert("C'è stato un errore del server durante la creazione della cartella");
																return;
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
                                    }

									if (addFileButton) {
										addFileButton.addEventListener('click', function() {

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
															if (x.status === 200) { // OK
																console.log('File creato correttamente');
															} else {
																alert("C'è stato un errore del server durante la creazione del file");
																return;
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
                                    }

									const list = document.querySelector('#outerlist');
									list.appendChild(subfolder);

									// Rimuovi input e pulsante
									input1.remove();
									confermaButton.remove();

									console.log('Cartella root creata correttamente');
								} else {
									alert("C'è stato un errore del server durante la creazione della cartella Root");
									return;
								}
							}
						}
					);
				});
			});
		});
	});
}








function setupDraggableItems() {
	// Recupero tutti gli elementi trascinabili
	document.addEventListener('DOMContentLoaded', function() {
		const draggableItems = document.querySelectorAll('.file, .folder'); // File e cartelle
		const dropzone = document.getElementById('dropzone'); // Zona cestino

		// Configuro ogni elemento trascinabile
		draggableItems.forEach(item => {
			item.addEventListener('dragstart', dragStart);
			item.addEventListener('dragend', dragEnd);
		});

		// Configuro la dropzone
		dropzone.addEventListener('dragover', event => {
			event.preventDefault(); // Necessario per consentire il drop ed evitare l'azione di default (apro il file trascinato)
			dropzone.classList.add('drag-over'); // Evidenzia la dropzone grazie al CSS
		});

		dropzone.addEventListener('dragleave', () => {
			dropzone.classList.remove('drag-over'); // Rimuove l'evidenziazione grazie a CSS
		});

		dropzone.addEventListener('drop', event => {
			event.preventDefault(); // Impedisce il comportamento predefinito
			dropzone.classList.remove('drag-over'); // Rimuove l'evidenziazione

			const token = event.dataTransfer.getData('token'); // Recupera il token del file o della cartella
			if (token) {
				const elementoTrascinato = document.querySelector(`[data-token="${token}"]`); // ${nome_variabile}
				if (elementoTrascinato) {
					// Mostriamo la finestra di dialogo con opzioni
					const conferma = confirm(`Stai eliminando: \n${elementoTrascinato.textContent.replace(/\s+/g, "\n").trim()} \nSei sicuro di voler proseguire?`);
					// s = Questo identifica una sequenza di uno o più caratteri di spazi vuoti, inclusi: Spazi ( ) Tabulazioni (\t) Nuove righe (\n)
					// g = significa sostituzione GLOBALE (in tutto il testo)
					// trim = elimina spazi, tabulazioni, a capo all'INIZIO

					if (conferma) {
						//funzione per cancellare 	
						makeCall("DELETE", 'DeleteServlet?token=' + token,
							function(x) {
								if (x.readyState == XMLHttpRequest.DONE) {
									if (x.status === 200) { // OK
										elementoTrascinato.remove(); // Elimina l'elemento dall'interfaccia senza necessità di ricaricare pagina
										alert("L'elemento è stato eliminato definitivamente.");
										console.log('Cancellazione avvenuta correttamente');
									} else {
										alert("C'è stato un errore del server durante l'operazione di cancellazione'");
										return;
									}
								}
							}
						);

					} else {
						alert("Operazione annullata!");
					}
				}
			}
		});




		// Funzione: Quando inizia il drag
		function dragStart(event) {
			const token = event.target.getAttribute('data-token'); // Recupera il token dal file o dalla cartella
			event.dataTransfer.setData('token', token); // Salva il token nel dataTransfer
			event.target.classList.add('dragging'); // Aggiunge un feedback visivo grazie al css
		}

		// Funzione: Quando termina il drag
		function dragEnd(event) {
			event.target.classList.remove('dragging'); // Rimuove il feedback visivo grazie al css
		}
	});
}


// chiamata istantanea quando carico il file JS
setupSubfolderCreation();
setupFileCreation();
setupDraggableItems();
setupAccediButtons();
setupFolderCreation();