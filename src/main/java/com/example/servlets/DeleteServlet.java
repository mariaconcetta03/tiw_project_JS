package com.example.servlets;

import java.io.IOException;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.example.DAOs.*;


@WebServlet("/DeleteServlet") 
public class DeleteServlet extends HttpServlet {

  	DocumentoDao documentoDao = null;
	CartellaDao cartellaDao = null;

	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init() {
		documentoDao = new DocumentoDao();
		cartellaDao = new CartellaDao();
	}

	
	// Questo metodo serve per cancellare FILE oppure CARTELLE
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String token = request.getParameter("token"); // Recupera il token dell'elemento da eliminare
		Map<String, Integer> folderTokens = null;
		Map<String, Integer> fileTokens = null;
		Integer idToDelete = null;
		Boolean isFile = false;
		HttpSession session = request.getSession();
		
		if (session != null) {
			folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
			fileTokens = (Map<String, Integer>) session.getAttribute("fileTokens");
		}
		
        if (token == null) {
			System.out.println("L'elemento da eliminare non esiste");
            return;
        }
        
        idToDelete = folderTokens.get(token); // controllo prima se c'è il folder da eliminare (se il token è del folder)

       if (idToDelete == null) { // se non è un token del folder, allora è un file
		    idToDelete = fileTokens.get(token);
			isFile = true;
	   }
	   
	   if (isFile) {
		   documentoDao.deleteDocumento(idToDelete);
	   } else {
		   cartellaDao.deleteCartella(idToDelete);
	   }
}
}
