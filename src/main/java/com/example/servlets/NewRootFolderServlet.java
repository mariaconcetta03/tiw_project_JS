package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.LinkedList;
import java.time.LocalDate;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.example.DAOs.*;

// 1. Cartella nella ROOT (sovracartella = NULL)
// 2. Cartella all'interno di una cartella (sovracartella != NULL)
// 3. file SOLO all'interno di una cartella

@WebServlet("/NewRootFolderServlet")
public class NewRootFolderServlet extends HttpServlet {

	CartellaDao cartellaDao = null;
	
	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init(){
		cartellaDao = new CartellaDao();
	}
	
	


	  // metodo che viene chiamato nel momento in cui l'utente ha finitpo di inserire i dati nel form HTML
	  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();        // Recupero dei dati dal form
        String user = null;
        String nome = request.getParameter("nomeCartella");
        // ricevo nome utente (email) dalla sessione e metto i foldertokens come attributi
		if (session != null) {
			user = session.getAttribute("email").toString();
			}
        cartellaDao.createRootFolderIntoDB(user, nome, Date.valueOf(LocalDate.now()));
        //si crea il valore della data automaticamente
                
     }
	  
	  
	 
	
}