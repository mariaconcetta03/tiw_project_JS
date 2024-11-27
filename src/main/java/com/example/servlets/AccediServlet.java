package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;
import java.util.Map;
import java.util.Date;
import com.google.gson.JsonObject;
import java.text.SimpleDateFormat;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.example.DAOs.*;
import com.example.beans.*;

@WebServlet("/AccediServlet")
public class AccediServlet extends HttpServlet {

	DocumentoDao documentoDao = null;
	CartellaDao cartellaDao = null;

	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init() {
		documentoDao = new DocumentoDao();
		cartellaDao = new CartellaDao();
	}

	
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		 response.setContentType("application/json");
		 response.setCharacterEncoding("UTF-8");
	
		 Map<String, Integer> fileTokens = null;
	     File f = null;
	
		// Dati da inviare (da mettere in un oggetto JSON)
		    String nomecartella = null;
		    String email = null;
		    Date data = null;
		    String sommario = null;
		    String tipo = null;

		HttpSession session = request.getSession(); // false -> check se sessione esiste oppure no (nel caso in cui
													// non esista restituisce null)
		
		if (session != null) {
			fileTokens = (Map<String, Integer>) session.getAttribute("fileTokens");
		}

		// prendo dall'URL il token del file selezionato
		String fileToken = request.getParameter("fileToken");

		
		Integer fileId = null;
		if (fileTokens != null && fileTokens.containsKey(fileToken)) { // se il token corrisponde ad uno effettivamente
																		// esistente
			fileId = fileTokens.get(fileToken); // ID della cartella
		}

		f = documentoDao.findDocumentoByID(fileId);

		
		// settiamo tutti gli attributi da mettere nel JSON file
		nomecartella = cartellaDao.getNomeCartellaById(f.getCartella());
		email = f.getProprietario();
	    data = f.getData_creazione();
	    sommario = f.getSommario();
	    tipo = f.getTipo();
	    
	    
	 // Creare un oggetto JSON
	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        String dataFormattata = dateFormat.format(data); // devo convertire la data come stringa altrimenti non posso metterla nei file JSON
        
	    JsonObject jsonResponse = new JsonObject();
	    jsonResponse.addProperty("nomecartella", nomecartella);
	    jsonResponse.addProperty("email", email);
	    jsonResponse.addProperty("data", dataFormattata); // sarà da riconvertire come data
	    jsonResponse.addProperty("sommario", sommario);
	    jsonResponse.addProperty("tipo", tipo);

	    // Scrivere la risposta
	    response.getWriter().write(jsonResponse.toString());
	    

	}
}