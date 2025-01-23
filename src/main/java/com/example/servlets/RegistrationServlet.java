package com.example.servlets;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;

import com.example.DAOs.*;

@WebServlet("/RegistrationServlet")
public class RegistrationServlet extends HttpServlet {

	UserDao userDao = null;

	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init() {
		userDao = new UserDao();
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		// parametri dell'utente 
		// java escape = fa l'escape dei caratteri speciali (per Java)
		String username = StringEscapeUtils.escapeJava(request.getParameter("username"));
		String email = StringEscapeUtils.escapeJava(request.getParameter("email"));
		String password = StringEscapeUtils.escapeJava(request.getParameter("password"));
		String confirmPassword = StringEscapeUtils.escapeJava(request.getParameter("password_conf"));

		if (!password.equals(confirmPassword)) { // se non coincidono
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
			response.getWriter().println("Le due password non coincidono. Riprova");
			return; // non provo a mettere nulla nel database
		}
		
		// controllo se username ed e-mail sono unici o no
		List<Integer> value = userDao.insertUser(username, password, email);
		boolean unique, connectionError;

		if (value.get(0) == 0) {
			unique = false;
		} else {
			unique = true;
		}

		if (value.get(1) == 0) {
			connectionError = false;
		} else {
			connectionError = true;
		}
	
		// Setto lo STATO DEL SERVER e metto il messaggio nella RESPONSE
		// caso di errore nella comunicazione col server
		if (!unique && connectionError) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // status 500
			response.getWriter().println("C'è stato un errore durante la comunicazione con il server SQL");
			return;
		}

		// caso di errore per lunghezza dei campi eccessiva
		if (username.length() > 50) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
			response.getWriter().println("L'username non può superare la lunghezza di 50 caratteri. Riprova.");
		} else { // caso di username già usato
			if (!unique) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
				response.getWriter().println("Lo username o l'e-mail sono già in uso. Riprova.");
			} else {
				// se la password di coonferma è diversa dalla password
				if (!password.equals(confirmPassword)) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
					response.getWriter().println("Le due password non coincidono. Riprova");
				} else { // caso di password che non rispetta i vincoli di caratteri
					// (?=.*\d) ALMENO UN NUMERO
					// (?=.*[a-z]) ALMENO UNA MINUSCOLA
					// (?=.*[A-Z]) ALMENO UNA MAIUSCOLA
					// (?=.*[@#$%^&+=]) ALMENO UN CARATTERE SPECIALE
					// {8,} MINIMO 8 CARATTERI 					       
					String regex = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!£-]).{8,50}";
					if (!password.matches(regex)) {
						response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
						response.getWriter().println("La password non soddisfa i requisiti richiesti. Riprova.");
					} else { // CASO OK
						HttpSession session = request.getSession();
						session = request.getSession();
						session.setAttribute("email", email); // Salviamo l'email nella sessione, perchè è quella del PROPRIETARIO delle cartelle
															
						response.setStatus(HttpServletResponse.SC_OK); // Status 200 OK
						response.setCharacterEncoding("UTF-8");
						response.getWriter().println(email);
					}
				}
			}
		}
	}
}