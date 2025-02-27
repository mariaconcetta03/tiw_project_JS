package com.example.servlets;

import java.io.IOException;
import java.sql.Date;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDate;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.example.DAOs.*;


@WebServlet("/NewRootFolderServlet")
public class NewRootFolderServlet extends HttpServlet {

	CartellaDao cartellaDao = null;
	
	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init(){
		cartellaDao = new CartellaDao();
	}
	
	

	  // metodo che viene chiamato nel momento in cui l'utente ha finito di inserire i dati nel form HTML
	  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();        
        String user = null;
        String nome = request.getParameter("nomeCartella");
        String newToken = UUID.randomUUID().toString(); 
        Map<String, Integer> folderTokens =  null;
        Integer id = null;
        
        // ricevo nome utente (email) dalla sessione e metto i foldertokens come attributi
		if (session != null) {
			folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
			user = session.getAttribute("email").toString();
			}

        id = cartellaDao.createRootFolderIntoDB(user, nome, Date.valueOf(LocalDate.now()));
		folderTokens.put(newToken, id); 
		
		session.setAttribute("folderTokens", folderTokens);

        response.setContentType("text");
        response.getWriter().print(newToken);
                
     }
	  
	
}