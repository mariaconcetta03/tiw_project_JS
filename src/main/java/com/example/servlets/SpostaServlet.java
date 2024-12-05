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
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession(); // false -> check se sessione esiste oppure no (nel caso in cui non esista restituisce null)
		String user = null;
		
		String fileToMoveToken = request.getParameter("fileToken");
		session.setAttribute("originServlet", "SpostaServlet");

		response.sendRedirect("HomeServlet?fileToken=" + fileToMoveToken);	
	}
	
	
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession(); // Recupero dei dati dal form
		String fileToken = null;
		String folderToken = null;
		Map<String, Integer> folderTokens = null; // nome del folder in cui ci spostiamo
		Map<String, Integer> fileTokens = null; // nome del file spostato

		if (session != null){
		folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
		fileTokens = (Map<String, Integer>) session.getAttribute("fileTokens");
		}
		
		
		
		fileToken = request.getParameter("sourceToken");
		folderToken = request.getParameter("targetToken");
		System.out.println("QUESTO E IL TARGET TOKEN: " + folderToken);
		System.out.println("QUESTA E TUTTA LA MAPPA: " + folderTokens);

		
		Integer fileID = fileTokens.get(fileToken);
		Integer newFolderID = folderTokens.get(folderToken);
		System.out.println("QUESTO E IL FILE ID: " + fileID);
		System.out.println("QUESTO E IL NEW FOLDER ID: " + newFolderID);

		
		documentoDao.updateFilePosition(newFolderID, fileID);
	
	}
	
}
	