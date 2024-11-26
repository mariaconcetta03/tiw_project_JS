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

		// getting the parameters written by the user
		String username = StringEscapeUtils.escapeJava(request.getParameter("username"));
		String email = StringEscapeUtils.escapeJava(request.getParameter("email"));
		String password = StringEscapeUtils.escapeJava(request.getParameter("password"));
		String confirmPassword = StringEscapeUtils.escapeJava(request.getParameter("password_conf"));

		// username ed e-mail sono unici o no?
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

		// caso di errore nella comunicazione col server
		if (!unique && connectionError) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // status 500
			response.getWriter().println("C'è stato un errore durante la comunicazione con il server SQL");
			return;
		}

		if (username.length() > 50) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
			response.getWriter().println("L'username non può superare la lunghezza di 50 caratteri. Riprova.");
		} else {
			if (!unique) {

				response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
				response.getWriter().println("Lo username o l'e-mail sono già in uso. Riprova.");
			} else {
				// if confirmation password is different from the password
				if (!password.equals(confirmPassword)) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
					response.getWriter().println("Le due password non coincidono. Riprova");
				} else {
					String regex = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!£-]).{8,50}";
					if (!password.matches(regex)) {
						response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Status 400
						response.getWriter().println("La password non soddisfa i requisiti richiesti. Riprova.");
					} else {
						HttpSession session = request.getSession();
						session = request.getSession();
						session.setAttribute("email", email); // Salviamo l'email nella sessione, perchè è quella del
																// PROPRIETARIO
																// delle cartelle
						response.setStatus(HttpServletResponse.SC_OK); // Status 200 OK
						response.setCharacterEncoding("UTF-8");
						response.getWriter().println(email);
					}
				}
			}
		}
	}
}