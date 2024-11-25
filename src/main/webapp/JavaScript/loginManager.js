// Selezioniamo il form dal documento HTML
// document = DOM (document object model), che è una rappresentazione dell'HTML'
const form = document.getElementById('login-form');

// Aggiungiamo un event listener per intercettare il submit del form
form.addEventListener('submit', (e) => {
        e.preventDefault(); // Previeni il comportamento predefinito (invio del form come GET)
    var form = e.target.closest("form");
    if (form.checkValidity()) {
      makeCall("POST", 'LoginServlet', e.target.closest("form"),
        function(x) {
			if (x.readyState == XMLHttpRequest.DONE) {
		            var message = x.responseText;
				switch (x.status) {
				              case 200:
				                window.location.href = "home_page.html";
				                break;
				              case 401: // unauthorized
				                  document.getElementById("errormessage").textContent = message;
				                  break;
				            }}
});
}
});


