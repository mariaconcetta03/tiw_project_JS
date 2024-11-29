package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.sql.ResultSet;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.example.beans.*;
import com.example.DAOs.*;

@WebServlet("/NewSubfolderServlet")
public class NewSubfolderServlet extends HttpServlet {

	CartellaDao cartellaDao = null;
	
	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
public void init(){
		cartellaDao = new CartellaDao();
	}
	




	// metodo che viene chiamato nel momento in cui l'utente ha finito di inserire i
	// dati nel form HTML
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession(); // Recupero dei dati dal form
		String user = null;
		String nome = request.getParameter("nome"); // nome cartella creata
		String folderToken = request.getParameter("folderToken");
		Map<String, Integer> folderTokens = new HashMap<>();
		Integer idSopracartella = null;
				
		// attributi
		if (session != null) {
			user = session.getAttribute("email").toString();
			folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
		}
		
		idSopracartella = folderTokens.get(folderToken);

		if (idSopracartella != null) {
			cartellaDao.createSubfolderIntoDB(user, nome, Date.valueOf(LocalDate.now()), idSopracartella);
		}

	}
}
