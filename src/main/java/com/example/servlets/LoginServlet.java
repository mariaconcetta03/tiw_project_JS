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
	public void init(){
		userDao = new UserDao();
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
				
		HttpSession session = request.getSession(); // false = se non esiste una sessione, allora non la creo
	    if (session != null) {
	        session.invalidate(); // invalido una possibile sessione precedente
	    }

		// getting the parameters written by the user
		String email = StringEscapeUtils.escapeJava(request.getParameter("email"));
		String password = StringEscapeUtils.escapeJava(request.getParameter("password"));
		//response.setContentType("text/plain");
	
		String errorMessage;
		
			List<Integer> value = userDao.checkCredentials(email, password);

		if(value.get(0).equals(1)) { // connectionError = 1
			response.getWriter().println("C'è stato un errore durante la comunicazione con il server SQL");
			return;
		}
		
		if (value.get(1).equals(0)) { // wrongParam = 0
			session = request.getSession();
			session.setAttribute("email", email); // Salviamo l'email nella sessione, perchè è quella del PROPRIETARIO delle cartelle
  			response.setStatus(HttpServletResponse.SC_OK); // Status 200 OK
            response.getWriter().println("Successo");	// scrive Successo nella risposta	
            response.sendRedirect ("home_page.html");
            } else { // wrongParam = 1
			 response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Status 401
             response.getWriter().println("E-mail o password errate. Riprova.");
		}


	}

}