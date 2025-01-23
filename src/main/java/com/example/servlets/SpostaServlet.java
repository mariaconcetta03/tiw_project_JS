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

@WebServlet("/SpostaServlet")
public class SpostaServlet extends HttpServlet {
	
	DocumentoDao documentoDao = null;
	
	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init(){
		documentoDao = new DocumentoDao();
	}
	
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession(); 
		String fileToken = null;
		String folderToken = null;
		Map<String, Integer> folderTokens = null; // nome del folder in cui ci spostiamo
		Map<String, Integer> fileTokens = null; // nome del file spostato
		String user = null;
		
		if (session != null){
		folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
		fileTokens = (Map<String, Integer>) session.getAttribute("fileTokens");
		user = session.getAttribute("email").toString();
		}
		
		fileToken = request.getParameter("sourceToken");
		folderToken = request.getParameter("targetToken");
			
		Integer fileID = fileTokens.get(fileToken);
		Integer newFolderID = folderTokens.get(folderToken);
	
		documentoDao.updateFilePosition(user, newFolderID, fileID);
	
	}
	
}
	