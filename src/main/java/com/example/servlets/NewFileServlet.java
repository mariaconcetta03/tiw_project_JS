package com.example.servlets;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.example.DAOs.*;

@WebServlet("/NewFileServlet")
public class NewFileServlet extends HttpServlet {

	DocumentoDao documentoDao = null;
	CartellaDao cartellaDao = null;

	// questa funzione viene eseguita solo una volta quando la servlet viene caricata in memoria
	@Override
	public void init() {
		documentoDao = new DocumentoDao();
		cartellaDao = new CartellaDao();
	}

	// metodo che viene chiamato nel momento in cui l'utente ha finito di inserire i dati nel form HTML
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		String user = null;
		String nome = request.getParameter("nome"); // nome del file da creare
		String tipo = request.getParameter("tipo"); // tipo del file da creare
		String sommario = request.getParameter("sommario"); // sommario del file da creare
		String folderToken = request.getParameter("folderToken"); // token della sopracartella
		Map<String, Integer> folderTokens = null;
		Map<String, Integer> fileTokens = null;
		String newToken = UUID.randomUUID().toString();
		Integer idSopracartella = null;
		Integer newId = null;

		// attributi
		if (session != null) {
			user = session.getAttribute("email").toString();
			folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
			fileTokens = (Map<String, Integer>) session.getAttribute("fileTokens");
		}

		idSopracartella = folderTokens.get(folderToken);

		if (idSopracartella != null) {
			newId = documentoDao.createFile(user, nome, Date.valueOf(LocalDate.now()), sommario, tipo, idSopracartella);
			fileTokens.put(newToken, newId);
			
			session.setAttribute("fileTokens", fileTokens); // aggiorno i filetokens con il token del nuovo file
			
			response.setContentType("text");
			response.getWriter().print(newToken); // glielo passiamo al browser (js)
		}

	}

}
