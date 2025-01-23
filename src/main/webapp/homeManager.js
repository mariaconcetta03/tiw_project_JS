function setupAccediButtons() {


	document.querySelectorAll('.accedi').forEach(button => {

		button.addEventListener('click', function() {

			// Recupera il valore dell'attributo data-token
			const token = this.getAttribute('data-tokenf');

			// Effettua una chiamata GET usando la funzione makeCall
			makeCall("GET", 'AccediServlet?fileToken=' + token,
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						if (x.status === 200) { // OK
							// Convertiamo la risposta JSON in un oggetto JavaScript
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

}






function makeCall(method, url, cback) {
	var req = new XMLHttpRequest(); // creo una nuova richiesta HTTP

	// questa funzione chiama CALLBACK quando lo stato della richiesta cambia
	// ASSOCIO UN EVENTO AL CAMBIAMENTO DI STATO
	req.onreadystatechange = function() {
		if (req.readyState === XMLHttpRequest.DONE) {
			cback(req); // cback è la funzione che ho definito altrove e che chiamo
		}
	};

	req.open(method, url);
	req.send(); // invia  la richiesta

}



/* CHIUDI BOTTONE PER FILE */
function setupCloseButton() {
	// Prendo tutti gli elementi accedibutton e ci aggiungo un event listener
	document.querySelectorAll('#clearbutton').forEach(button => {

		button.addEventListener('click', function() {
			document.getElementById("nomedocumento").textContent = "";
			document.getElementById("email").textContent = "";
			document.getElementById("data").textContent = "";
			document.getElementById("sommario").textContent = "";
			document.getElementById("tipo").textContent = "";
			document.getElementById("nomecartella").textContent = "";
		}
		);
	});

}






/**----------------------------------------------------------**/
// adding new subfolder
// con event delegation: vale per tutti gli elementi .addsubfolder

function setupEventDelegation() {
	document.getElementById('outerlist').addEventListener('click', function(event) {
		if (event.target && event.target.classList.contains('addsubfolder')) {
			handleSubfolderCreation(event.target); //event.target == button
		}
	});
}


function handleSubfolderCreation(button) {

	const clickedButton = button; // Usa il parametro passato

	// Recupera il valore dell'attributo data-token (token della SOPRACARTELLA)
	const token = clickedButton.getAttribute('data-token');

	// Se il campo di input esiste già, non fare nulla
	const formBox = document.getElementById('form-box1');
	// Controlla se il form box contiene già elementi
	if (formBox && formBox.children.length > 0) {
		return; // Esci se il form box contiene elementi
	}

	// Crea il campo di input per far inserire all'utente il nome della sottocartella
	const input = document.createElement('input');
	const contenitore1 = document.getElementById('form-box1'); //contiene input
	const contenitore2 = document.getElementById('form-box2'); //contiene crea

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

		// il token è quello della sopracartella in cui si deve aggiungere il subfolder
		makeCall("POST", 'NewSubfolderServlet?folderToken=' + token + '&nome=' + nomeSottocartella,
			function(x) {
				if (x.readyState == XMLHttpRequest.DONE) {
					if (x.status === 200) { // OK
						// Aggiungi dinamicamente la sottocartella al DOM (document object model)
						const subfolder = document.createElement('li');
						subfolder.className = 'folder';
						subfolder.draggable = true;
						subfolder.dataset.token = x.responseText.trim(); // il server restituisce il token della nuova cartella
						subfolder.innerHTML = `
                                        ${nomeSottocartella}
                                        <input id="aggiungisottocartellabutton" class="addsubfolder" type="button" value="AGGIUNGI SOTTOCARTELLA" data-token="${x.responseText}">
                                        <input id="aggiungifilebutton" class="addfile" type="button" value="AGGIUNGI FILE" data-token="${x.responseText.trim()}">`; // tolgo A CAPO

						// Aggiungi manualmente gli event listeners ai miei bottoni nuovi
						const addSubfolderButton = subfolder.querySelector('.addsubfolder');
						const addFileButton = subfolder.querySelector('.addfile');

						// il bottone addsubfolderbutton non deve essere settato a causa dell'event delegation
						// setto addfilebutton
						if (addFileButton) {
							addFileButton.addEventListener('click', function(event) {

								const clickedButton = event.target; // bottone "aggiungi file" che è stato schiacciato

								// Recupera il valore dell'attributo data-token (token della CARTELLA)
								const token = this.getAttribute('data-token');

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

													// appendiamo dinamicamente il file alla lista della cartella
													const file = document.createElement('li');
													file.className = 'file';
													file.draggable = true;
													file.dataset.token = x.responseText.trim(); // il server restituisce il token del nuovo file
													file.dataset.tokenf = x.responseText.trim(); // il server restituisce il token del nuovo file
													file.innerHTML = `
																				    ${nomeFile}
																				    <input id="accedibutton" type="button" class="accedi" value="ACCEDI" data-tokenf="${x.responseText.trim()}">
																					`;

													// Aggiungi manualmente gli event listeners ai miei bottoni nuovi
													const accediButton = file.querySelector('.accedi'); // bottone appena creato sopra

													if (accediButton) {
														accediButton.addEventListener('click', function() {

															// Recupera il valore dell'attributo data-token
															const token = this.getAttribute('data-tokenf');

															// Effettua una chiamata GET usando la funzione makeCall
															makeCall("GET", 'AccediServlet?fileToken=' + token,
																function(x) {
																	if (x.readyState == XMLHttpRequest.DONE) {
																		if (x.status === 200) { // OK
																			// Convertiamo la risposta JSON in un oggetto JavaScript
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
																});
														});
													}

													// appendiamo il file con il relativo bottone alla lista del subfolder più vicino
													const parentFolderElement = clickedButton.closest('.folder'); // Trova la cartella più vicina
													let list = parentFolderElement.querySelector('ul'); // Trova la lista interna	

													if (!list) {
														list = document.createElement('ul');
														parentFolderElement.appendChild(list); // Aggiungi la nuova lista al parentFolderElement
													}
													list.appendChild(file); // mettto il file

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
								});
							});
						}


						// Configuro le cartelle come aree di drop per i file
						subfolder.addEventListener('dragover', allowDrop);
						subfolder.addEventListener('drop', dropFileIntoFolder); // sposto il file in una cartella
						subfolder.classList.add('folderDropzone');

						// Le cartelle sono anche draggable per l'eliminazione nel cestino
						subfolder.addEventListener('dragstart', dragStart);
						subfolder.addEventListener('dragend', dragEnd);


						// sia per file che per folder
						function dragStart(event) {
							const token = event.target.getAttribute('data-token');
							const itemType = event.target.classList.contains('folder') ? 'folder' : 'file'; // se contiene la classe "folder", allora è folder, altrimenti file
							event.dataTransfer.setData('sourceToken', token); // quello che io TRASCINO = sourceToken
							event.dataTransfer.setData('itemType', itemType);
							event.target.classList.add('dragging'); // CSS
						}

						// vale sia per file che per folder
						function dragEnd(event) {
							event.target.classList.remove('dragging');
						}

						// vale sia per file che per folder
						function allowDrop(event) {
							event.preventDefault();
						}


						function dropFileIntoFolder(event) {
							event.preventDefault(); // evito operazione predefinita di apertura file
							event.stopPropagation(); // Previene la propagazione dell'evento

							const folderElement = event.target.closest('.folder');

							const targetToken = folderElement.getAttribute('data-token'); // token della cartella in cui il file è stato rilasciato
							const sourceToken = event.dataTransfer.getData('sourceToken'); // quello che ho trascinato (file)
							const itemType = event.dataTransfer.getData('itemType'); // sarà file (nel caso corretto)

							if (!sourceToken || !targetToken) {
								alert('Operazione non valida.');
								return;
							}

							// Solo i file possono essere spostati nelle cartelle !!!
							if (itemType !== 'file') {
								alert('Solo i documenti possono essere spostati nelle cartelle. Non è possibile spostare una cartella.');
								return;
							}

							// Chiamata per spostare il file sul server
							const params = `sourceToken=${sourceToken}&targetToken=${targetToken}`;
							makeCall("POST", 'SpostaServlet?' + params, function(x) {
								if (x.readyState == XMLHttpRequest.DONE) {
									if (x.status === 200) {
										// Aggiorna l'interfaccia utente per riflettere lo spostamento SENZA ricaricare la pagina
										const draggedElement = document.querySelector(`[data-token="${sourceToken}"]`);
										const targetElement = folderElement; // deve essere la cartella in cui ho rilasciato il file

										// Rimuovi l'elemento dalla posizione precedente
										if (draggedElement.parentNode) { // tolgo il file dalla lista
											draggedElement.parentNode.removeChild(draggedElement);
										}

										// Aggiungi l'elemento alla nuova cartella
										let targetList = targetElement.querySelector('ul');

										if (!targetList) { // se la cartella non ha figli (è il nuovo elemento)
											targetList = document.createElement('ul');
											targetElement.appendChild(targetList); // metto la lista nuova (vuota)
										}
										targetList.appendChild(draggedElement); // metto l'elemento nella lista
									} else {
										alert("Errore durante lo spostamento del documento.");
									}
								}
							});
						}

						const parentFolderElement = clickedButton.closest('.folder'); // Trova la cartella più vicina
						let list = parentFolderElement.querySelector('ul'); // Trova la lista interna	

						if (!list) {
							list = document.createElement('ul');
							parentFolderElement.appendChild(list); // Aggiungi la nuova lista al parentFolderElement
						}
						list.appendChild(subfolder);

						// Rimuovi input e pulsante
						input.remove();
						confermaButton.remove();
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
	});
}




/**----------------------------------------------------------**/
// adding new file

function setupFileCreation() {


	// Trova tutti i bottoni "AGGIUNGI FILE"
	document.querySelectorAll('.addfile').forEach(button => {
		button.addEventListener('click', function(event) {

			const clickedButton = event.target; // bottone "aggiungi file" che è stato schiacciato

			// Recupera il valore dell'attributo data-token (token della CARTELLA)
			const token = this.getAttribute('data-token');

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
								// appendiamo dinamicamente il file alla lista della cartella
								const file = document.createElement('li');
								file.className = 'file';
								file.draggable = true;
								file.dataset.token = x.responseText.trim(); // il server restituisce il token del nuovo file
								file.dataset.tokenf = x.responseText.trim(); // il server restituisce il token del nuovo file
								file.innerHTML = `
									    ${nomeFile}
									    <input id="accedibutton" type="button" class="accedi" value="ACCEDI" data-tokenf="${x.responseText.trim()}">
										`;

								// Aggiungi manualmente gli event listeners ai miei bottoni nuovi
								const accediButton = file.querySelector('.accedi'); // bottone appena creato sopra

								if (accediButton) {
									accediButton.addEventListener('click', function() {
										// Recupera il valore dell'attributo data-token
										const token = this.getAttribute('data-tokenf');
										// Effettua una chiamata GET usando la funzione makeCall
										makeCall("GET", 'AccediServlet?fileToken=' + token,
											function(x) {
												if (x.readyState == XMLHttpRequest.DONE) {
													if (x.status === 200) { // OK
														// Convertiamo la risposta JSON in un oggetto JavaScript
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
											});
									});
								}

								// appendiamo il file con il relativo bottone alla lista del subfolder più vicino
								const parentFolderElement = clickedButton.closest('.folder'); // Trova la cartella più vicina
								let list = parentFolderElement.querySelector('ul'); // Trova la lista interna	
								if (!list) {
									list = document.createElement('ul');
									parentFolderElement.appendChild(list); // Aggiungi la nuova lista al parentFolderElement
								}
								list.appendChild(file);

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
			});
		});
	});

}





/** ------------------------ **/
//adding a root folder

function setupFolderCreation() {
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
                                        <input id="aggiungifilebutton" class="addfile" type="button" value="AGGIUNGI FILE" data-token="${x.responseText.trim()}">`; // tolgo A CAPO

								// Aggiungi manualmente gli event listeners ai miei bottoni nuovi
								// NON aggiungiamo event listener ad "addSubfolderButton" perchè è gestito tramite event delegation
								const addFileButton = subfolder.querySelector('.addfile');

								if (addFileButton) {
									addFileButton.addEventListener('click', function(event) {

										const clickedButton = event.target; // bottone "aggiungi file" che è stato schiacciato

										// Recupera il valore dell'attributo data-token (token della CARTELLA)
										const token = this.getAttribute('data-token');

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
															// appendiamo dinamicamente il file alla lista della cartella
															const file = document.createElement('li');
															file.className = 'file';
															file.draggable = true;
															file.dataset.token = x.responseText.trim(); // il server restituisce il token del nuovo file
															file.dataset.tokenf = x.responseText.trim(); // il server restituisce il token del nuovo file
															file.innerHTML = `
																			    ${nomeFile}
																			    <input id="accedibutton" type="button" class="accedi" value="ACCEDI" data-tokenf="${x.responseText.trim()}">
																				`;

															// Aggiungi manualmente gli event listeners ai miei bottoni nuovi
															const accediButton = file.querySelector('.accedi'); // bottone appena creato sopra

															if (accediButton) {
																accediButton.addEventListener('click', function() {
																	// Recupera il valore dell'attributo data-token
																	const token = this.getAttribute('data-tokenf');
																	// Effettua una chiamata GET usando la funzione makeCall
																	makeCall("GET", 'AccediServlet?fileToken=' + token,
																		function(x) {
																			if (x.readyState == XMLHttpRequest.DONE) {
																				if (x.status === 200) { // OK
																					// Convertiamo la risposta JSON in un oggetto JavaScript
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
																		});
																});
															}

															// appendiamo il file con il relativo bottone alla lista del subfolder più vicino
															const parentFolderElement = clickedButton.closest('.folder'); // Trova la cartella più vicina
															let list = parentFolderElement.querySelector('ul'); // Trova la lista interna	
															if (!list) {
																list = document.createElement('ul');
																parentFolderElement.appendChild(list); // Aggiungi la nuova lista al parentFolderElement
															}
															list.appendChild(file);

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
										});
									});
								}

								// Configuro le cartelle come aree di drop per i file
								subfolder.addEventListener('dragover', allowDrop);
								subfolder.addEventListener('drop', dropFileIntoFolder); // sposto il file in una cartella
								subfolder.classList.add('folderDropzone');

								// Le cartelle sono anche draggable per l'eliminazione nel cestino
								subfolder.addEventListener('dragstart', dragStart);
								subfolder.addEventListener('dragend', dragEnd);


								// sia per file che per folder
								function dragStart(event) {
									const token = event.target.getAttribute('data-token');
									const itemType = event.target.classList.contains('folder') ? 'folder' : 'file'; // se contiene la classe "folder", allora è folder, altrimenti file
									event.dataTransfer.setData('sourceToken', token); // quello che io TRASCINO = sourceToken
									event.dataTransfer.setData('itemType', itemType);
									event.target.classList.add('dragging'); // CSS
								}

								// vale sia per file che per folder
								function dragEnd(event) {
									event.target.classList.remove('dragging');
								}

								// vale sia per file che per folder
								function allowDrop(event) {
									event.preventDefault();
								}

								function dropFileIntoFolder(event) {
									event.preventDefault(); // evito operazione predefinita di apertura file
									event.stopPropagation(); // Previene la propagazione dell'evento

									const folderElement = event.target.closest('.folder');
									const targetToken = folderElement.getAttribute('data-token'); // token della cartella in cui il file è stato rilasciato
									const sourceToken = event.dataTransfer.getData('sourceToken'); // quello che ho trascinato (file)
									const itemType = event.dataTransfer.getData('itemType'); // sarà file (nel caso corretto)

									if (!sourceToken || !targetToken) {
										alert('Operazione non valida.');
										return;
									}

									// Solo i file possono essere spostati nelle cartelle !!!
									if (itemType !== 'file') {
										alert('Solo i documenti possono essere spostati nelle cartelle. Non è possibile spostare una cartella.');
										return;
									}

									// Chiamata per spostare il file sul server
									const params = `sourceToken=${sourceToken}&targetToken=${targetToken}`;
									makeCall("POST", 'SpostaServlet?' + params, function(x) {
										if (x.readyState == XMLHttpRequest.DONE) {
											if (x.status === 200) {
												// Aggiorna l'interfaccia utente per riflettere lo spostamento SENZA ricaricare la pagina
												const draggedElement = document.querySelector(`[data-token="${sourceToken}"]`);
												const targetElement = folderElement; // deve essere la cartella in cui ho rilasciato il file
												// Rimuovi l'elemento dalla posizione precedente
												if (draggedElement.parentNode) { // tolgo il file dalla lista
													draggedElement.parentNode.removeChild(draggedElement);
												}

												// Aggiungi l'elemento alla nuova cartella
												let targetList = targetElement.querySelector('ul');

												if (!targetList) { // se la cartella non ha figli (è il nuovo elemento)
													targetList = document.createElement('ul');
													targetElement.appendChild(targetList); // metto la lista nuova (vuota)
												}
												targetList.appendChild(draggedElement); // metto l'elemento nella lista
											} else {
												alert("Errore durante lo spostamento del documento.");
											}
										}
									});
								}

								const list = document.querySelector('#outerlist');
								list.appendChild(subfolder);

								// Rimuovi input e pulsante
								input1.remove();
								confermaButton.remove();

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

}








function setupDraggableItems() {
	// Recupero tutti gli elementi trascinabili
	const draggableFiles = document.querySelectorAll('.file'); // files -> verso cestino e verso altre cartelle
	const folders = document.querySelectorAll('.folder'); // folders -> verso cestino
	const dropzone = document.getElementById('dropzone'); // Zona cestino

	// Configuro i file come elementi trascinabili, si ain cestino che in altre cartelle
	draggableFiles.forEach(item => {
		item.addEventListener('dragstart', dragStart);
		item.addEventListener('dragend', dragEnd);
	});

	// Configuro le cartelle come aree di drop per i file
	folders.forEach(folder => {
		folder.addEventListener('dragover', allowDrop);
		folder.addEventListener('drop', dropFileIntoFolder); // sposto il file in una cartella
		folder.classList.add('folderDropzone');

		// Le cartelle sono anche draggable per l'eliminazione nel cestino
		folder.addEventListener('dragstart', dragStart);
		folder.addEventListener('dragend', dragEnd);
	});


	// Configuro la dropzone (cestino)
	dropzone.addEventListener('dragover', allowDrop);
	dropzone.addEventListener('drop', dropToTrash); // consento il drop nel cestino

	// sia per file che per folder
	function dragStart(event) {
		const token = event.target.getAttribute('data-token');
		const itemType = event.target.classList.contains('folder') ? 'folder' : 'file'; // se contiene la classe "folder", allora è folder, altrimenti file
		event.dataTransfer.setData('sourceToken', token); // quello che io TRASCINO = sourceToken
		event.dataTransfer.setData('itemType', itemType);
		event.target.classList.add('dragging'); // CSS
	}

	// vale sia per file che per folder
	function dragEnd(event) {
		event.target.classList.remove('dragging');
	}

	// vale sia per file che per folder
	function allowDrop(event) {
		event.preventDefault();
	}

	function dropFileIntoFolder(event) {
		event.preventDefault(); // evito operazione predefinita di apertura file
		event.stopPropagation(); // prevengo la propagazione dell'evento

		const folderElement = event.target.closest('.folder');
		const targetToken = folderElement.getAttribute('data-token'); // token della cartella in cui il file è stato rilasciato
		const sourceToken = event.dataTransfer.getData('sourceToken'); // quello che ho trascinato (file)
		const itemType = event.dataTransfer.getData('itemType'); // sarà file (nel caso corretto)

		if (!sourceToken || !targetToken) {
			alert('Operazione non valida.');
			return;
		}

		// Solo i file possono essere spostati nelle cartelle !!!
		if (itemType !== 'file') {
			alert('Solo i documenti possono essere spostati nelle cartelle. Non è possibile spostare una cartella.');
			return;
		}

		// Chiamata per spostare il file sul server
		const params = `sourceToken=${sourceToken}&targetToken=${targetToken}`;
		makeCall("POST", 'SpostaServlet?' + params, function(x) {
			if (x.readyState == XMLHttpRequest.DONE) {
				if (x.status === 200) {
					// Aggiorna l'interfaccia utente per riflettere lo spostamento SENZA ricaricare la pagina
					const draggedElement = document.querySelector(`[data-token="${sourceToken}"]`);
					const targetElement = folderElement; // deve essere la cartella in cui ho rilasciato il file

					// Rimuovi l'elemento dalla posizione precedente
					if (draggedElement.parentNode) { // tolgo il file dalla lista
						draggedElement.parentNode.removeChild(draggedElement);
					}

					// Aggiungi l'elemento alla nuova cartella
					let targetList = targetElement.querySelector('ul');

					if (!targetList) { // se la cartella non ha figli (è il nuovo elemento)
						targetList = document.createElement('ul');
						targetElement.appendChild(targetList); // metto la lista nuova (vuota)
					}
					targetList.appendChild(draggedElement); // metto l'elemento nella lista
				} else {
					alert("Errore durante lo spostamento del documento.");
				}
			}
		});
	}


	// vale sia per file sia per cartelle
	function dropToTrash(event) {
		event.preventDefault();
		const sourceToken = event.dataTransfer.getData('sourceToken'); // da eliminare: file o cartella

		if (!sourceToken) {
			alert('Operazione non valida.');
			return;
		}

		const elementoTrascinato = document.querySelector(`[data-token="${sourceToken}"]`);

		if (elementoTrascinato) {
			const conferma = confirm(`Stai eliminando: \n${elementoTrascinato.textContent.split('\n').map(line => line.trim()).filter(line => line !== "").join("\n")} \nSei sicuro di voler proseguire?`);
			if (conferma) { // utente preme OK
				// Chiamata per eliminare l'elemento
				makeCall("DELETE", 'DeleteServlet?token=' + sourceToken, function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						if (x.status === 200) {
							elementoTrascinato.remove(); // Rimuove l'elemento dall'interfaccia
							alert("L'elemento è stato eliminato definitivamente.");
						} else {
							alert("Errore durante l'eliminazione dell'elemento.");
						}
					}
				});
			} else { // utente preme ANNULLA
				alert("Operazione annullata!");
			}
		}
	}

}




// CHIAMATA ISTANTANEA QUANDO CARICO IL FILE JS
// Queste funzioni vengono chiamate istantaneamente per configurare i bottoni
// Solamente quando l'HTML è caricato (DOM Document Object Model)
document.addEventListener('DOMContentLoaded', function() {
	setupFileCreation();
	setupDraggableItems();
	setupAccediButtons();
	setupFolderCreation();
	setupEventDelegation();
	setupCloseButton();
});
