package com.example.servlets;

import java.io.IOException;





/*
			------------------  # TODO  --------------------
				
			2. Creare il cestino con drag and drop. Attenzione
				poichè è possibile cancellare sia singoli file
				sia intere cartelle (cancellazione a cascata).
				Prima di inviare il comando di cancellazione 
				al server l’utente vede una 
				finestra modale di conferma e può decidere se 
				annullare l’operazione o procedere.
				
			3. Errori lato server devono essere comunicati
				attraverso messaggi di errori nella pagina
				
			4. Se in tempo tasto close per info dei documenti
			
			5. Genera cartella nella ROOT
			
*/


import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.example.DAOs.CartellaDao;
import com.example.DAOs.DocumentoDao;
import com.example.beans.*;

@WebServlet("/HomeServlet")
public class HomeServlet extends HttpServlet {

	DocumentoDao documentoDao = null;
	CartellaDao cartellaDao = null;

	// questa funzione viene eseguita solo una volta quando la servlet
	// viene caricata in memoria
	@Override
	public void init() {
		documentoDao = new DocumentoDao();
		cartellaDao = new CartellaDao();
	}

	// Metodo per generare il codice HTML ricorsivamente dell'albero delle cartelle
	// Inizia a mettere il primo folder
	private void generateHtmlForFolder(PrintWriter out, Folder f, HttpSession session) {
		String user = null;
		// Prendiamo la map dei token dalla sessione
		Map<String, Integer> folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");
	
		if (session != null) {
			user = session.getAttribute("email").toString();
		}
		// aggiungiamo il token della nuova cartella
		String token = UUID.randomUUID().toString(); // Un token casuale o identificatore offuscato
		folderTokens.put(token, f.getId());

		// aggiorniamo i token della sessione
		session.setAttribute("folderTokens", folderTokens);

		out.println("<li class=\"folder\">" + f.getNome()); // creo la cartella più esterna
		out.println("<input id=\"aggiungisottocartellabutton\" class =\"addsubfolder\" type=\"button\" value=\"AGGIUNGI SOTTOCARTELLA\" data-token=\""+ token+"\">"
				+ "<link rel=\"stylesheet\" href=\"Home.css\">");
		out.println("<input id=\"aggiungifilebutton\" class =\"addfile\" type=\"button\" value=\"AGGIUNGI FILE\" data-token=\""+ token +"\">"
				+ "<link rel=\"stylesheet\" href=\"Home.css\">");
		// lista di files contenuti in questa cartella
		List<File> files = documentoDao.getDocsFromFolder(user, f.getId());

		out.println("<ul>"); // inizia la lista non ordinata
		// stampo i files in una cartella
		Map<String, Integer> fileTokens = (Map<String, Integer>) session.getAttribute("fileTokens");
		for (File file : files) { // docs
			String tokenf = UUID.randomUUID().toString(); // Un token casuale o identificatore offuscato

			out.println("<li class=\"file\">" + file.getNome() + "     "
					+ "<input id = \"accedibutton\" type=\"button\" class=\"accedi\" value=\"ACCEDI\" data-tokenf=\""+ tokenf +"\">"
					+ "<link rel=\"stylesheet\" href=\"Home.css\">" + "</li>");
			fileTokens.put(tokenf, file.getId());
		}
		session.setAttribute("fileTokens", fileTokens);

		if (f.getSottocartelle() != null) { // se ho sottocartelle, allora chiamo la funzione ricorsivamente per tutte
											// le
			// sottocartelle
			for (Folder sub : f.getSottocartelle()) {
				generateHtmlForFolder(out, sub, session); // chiamata ricorsiva
			}
		}
		out.println("</ul>"); // fine della lista non ordinata --- per sottocartelle uso le "ul"
		out.println("</li>"); // fine della cartella più esterna -- list item
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		Map<String, Integer> folderTokens = new HashMap<>();
		List<Folder> allFolders = new ArrayList<>();
		String user = null;
		String nomeFile = null;
		String nomeCartella = null;
		HttpSession session = request.getSession(); // false -> check se sessione esiste oppure no (nel caso in cui
													// non esista restituisce null)
		String origin = (String) session.getAttribute("originServlet");
		Integer IDCartella = null;
		Map<String, Integer> fileTokens = new HashMap<>();


		// ricevo nome utente (email) dalla sessione e metto i foldertokens come
		// attributi
		if (session != null) {
			user = session.getAttribute("email").toString();
			session.setAttribute("folderTokens", folderTokens);
			session.setAttribute("fileTokens", fileTokens);
		}

		// Connessione al database e recupero delle cartelle (vengono messe in
		// allFolders)
		allFolders = cartellaDao.getAllUserFolder(user);

		// Impostazione della risposta (pagina HTML)
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();

		out.println(
				"<html lang=\"it\"><head><meta charset=\"UTF-8\"><title>Home Page</title><meta charset=\"UTF-8\">\r\n"
						+ "<title>Home Page</title>\r\n"
						+ "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n"
						+ "<link rel=\"stylesheet\" href=\"ContenutiStyle.css\"><link rel=\"stylesheet\" href=\"Home.css\"><script src=\"homeManager.js\"></script></head><body>");
	


		// Link per fare il logout (rimando alla servlet di logout)
		out.println("<a href=\"LogoutServlet\">Logout</a>");
		out.println("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"); // spaziatura
		out.println("<a href=\"GestioneContenutiServlet\">Nuova cartella nella ROOT</a>");

		out.println("<h1>Le tue cartelle:</h1>");
		out.println("<div class=\"tree\">");
		out.println("<ul>");
		
		
		// Generazione ricorsiva del codice HTML
		for (Folder folder1 : allFolders) {
			generateHtmlForFolder(out, folder1, session);
		}

		out.println("</ul>");
		out.println("</div>");
		
		// separazione delle parti
		out.println("<br>");
		out.println("<br>");
		out.println("<br>");


		// qui creo uno spazio per mostrare i dettagli del file selezionato
		// SPAN: utilizzato con lo scopo di raggruppare parti di testo o elementi HTML con lo scopo di applicare stili CSS o manipolazioni JavaScript
		out.println("<h2> Informazioni del documento selezionato: </h2>");
		out.println("<b>Nome documento:</b> <span id=\"nomedocumento\"></span><br>");
		out.println("<b>E-mail del proprietario:</b> <span id=\"email\"></span><br>");
		out.println("<b>Data di creazione:</b> <span id=\"data\"></span><br>");
		out.println("<b>Sommario:</b> <span id=\"sommario\"></span><br>");
		out.println("<b>Tipo:</b> <span id=\"tipo\"></span><br>");
		out.println("<b>Cartella:</b> <span id=\"nomecartella\"></span><br>");
		
		
		out.println("<br><br><br><br>");
		out.println("<div id=\"form-box1\">");
		out.println("</div>");
		out.println("<div id=\"form-box2\">");
		out.println("</div>");
		out.println("<div id=\"form-box3\">");
		out.println("</div>");
		out.println("<div id=\"form-box4\">");
		out.println("</div>");
	
		
		out.println("</body></html>");

	}

	private void generateHtmlForMovingFolder(PrintWriter out, Folder f, HttpSession session, Integer originFolderID,
			String fileToken) {
		if (!f.getId().equals(originFolderID)) {

			// Prendiamo la map dei token dalla sessione
			Map<String, Integer> folderTokens = (Map<String, Integer>) session.getAttribute("folderTokens");

			// aggiungiamo il token della nuova cartella
			String token = UUID.randomUUID().toString(); // Un token casuale o identificatore offuscato
			folderTokens.put(token, f.getId());

			// aggiorniamo i token della sessione
			session.setAttribute("folderTokens", folderTokens);

			// VIRTUALIZZAZIONE DEL TASTO "SPOSTA" (ogni singola cartella è come un bottone
			// SPOSTA)
			out.println("<li class=\"folder\">");
			out.println("<form action='SpostaServlet' method='POST' style='display:inline;'>");
			out.println("<input type='hidden' name='folderToken' value='" + token + "'>");
			out.println("<input type='hidden' name='fileToken' value='" + fileToken + "'>");

			out.println(
					"<button type='submit' style='background:none; border:none; color:blue; text-decoration:underline; cursor:pointer;'>");
			out.println(f.getNome());
			out.println("</button>");
			out.println("</form>");
			out.println("</li>"); // esterna

			if (f.getSottocartelle() != null) { // se ho sottocartelle, allora chiamo la funzione ricorsivamente per
												// tutte le
				// sottocartelle
				out.println("<ul>"); // inizia la lista non ordinata
				for (Folder sub : f.getSottocartelle()) {
					generateHtmlForMovingFolder(out, sub, session, originFolderID, fileToken); // chiamata ricorsiva
				}
				out.println("</ul>"); // fine della lista non ordinata --- per sottocartelle uso le "ul"
			}
			out.println("</li>"); // fine della cartella più esterna -- list item
		} else {
			out.println("<li class=\"folder\" style='background:none; border:none; color:red;'>");
			out.println(f.getNome());

			// se ho delle sottocartelle, allora non posso saltarle. Infatti è possibile
			// spostare un file da una cartella
			// principale ad una sua sottocartella
			if (f.getSottocartelle() != null) { // se ho sottocartelle, allora chiamo la funzione ricorsivamente per
												// tutte le
				// sottocartelle
				out.println("<ul>"); // inizia la lista non ordinata
				for (Folder sub : f.getSottocartelle()) {
					// tolgo la formattazione precedente, poichè i figli non devono essere
					// evidenziati in giallo
					out.println("<li class=\"folder\" style='background:none; border:none; color:black;'>");
					generateHtmlForMovingFolder(out, sub, session, originFolderID, fileToken); // chiamata ricorsiva
					out.println("</li>");
				}
				out.println("</ul>"); // fine della lista non ordinata --- per sottocartelle uso le "ul"
			}
			out.println("</li>"); // fine della cartella più esterna -- list item

		}
	}

}
