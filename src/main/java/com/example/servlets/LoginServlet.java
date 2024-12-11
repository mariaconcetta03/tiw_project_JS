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
import com.example.DAOs.UserDao;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

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

		HttpSession session = request.getSession();
		if (session != null) {
			session.invalidate(); // invalido una possibile sessione precedente
		}

		// prendo i parametri scritti dall'utente
		String email = StringEscapeUtils.escapeJava(request.getParameter("email"));
		// ritorna una nuova stringa in cui sono stati "escapati" tutti i caratteri
		// speciali secondo le regole di Java
		String password = StringEscapeUtils.escapeJava(request.getParameter("password"));

		List<Integer> value = userDao.checkCredentials(email, password);

		// Settiamo solamente lo STATO DELLA RESPONSE. Questo verrà letto in
		// loginManager.js
		// e sarà il file javascript stesso a modificare la pagina con errore

		if (value.get(0).equals(1)) { // connectionError = 1
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // status 500
			response.getWriter().println("C'è stato un errore durante la comunicazione con il server SQL");
			return;
		}

		if (value.get(1).equals(0)) { // wrongParam = 0
			session = request.getSession();
			session.setAttribute("email", email); // Salviamo l'email nella sessione, perchè è quella del PROPRIETARIO delle cartelle
			response.setStatus(HttpServletResponse.SC_OK); // Status 200 OK
			response.setCharacterEncoding("UTF-8");
			response.getWriter().println(email); // scriviamo la mail nella response
		} else { // wrongParam = 1
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Status 401
			response.getWriter().println("E-mail o password errate. Riprova."); // scriviamo messaggio di errore nella risposta
		}

	}

}