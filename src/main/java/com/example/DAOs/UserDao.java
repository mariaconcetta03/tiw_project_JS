package com.example.DAOs;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDao {

	Connection connection = null; // Questa è la connessione al DB

	// Questa funzione si connette al DB
	private void getConnection() {

		final String JDBC_URL = "jdbc:mysql://localhost:3306/tiw_project?serverTimezone=UTC";
		final String JDBC_USER = "root";
		final String JDBC_PASSWORD = "iononsonotu";

		try {
			Class.forName("com.mysql.cj.jdbc.Driver"); // Carichiamo in memoria il driver JDBC necessario per connettere
													   // applicazione Java a un database MySQL
			connection = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
		} catch (ClassNotFoundException | SQLException e) {
			System.out.println("Impossibile stabilire la connessione col DB");
		}
	}

	// Questa funzione chiude la connessione col DB
	private void closeConnection() {
		try {
			connection.close();
		} catch (SQLException e) {
			System.out.println("Impossibile chiudere la connessione col DB");
		}
	}

	// Questo metodo controlla che le credenziali siano corrette
	public List<Integer> checkCredentials(String email, String pw) {
		getConnection();

		List<Integer> value = new ArrayList<>(); // 1 = connectionError 	2 = wrongParam
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;

		if (connection != null) { // se non è avvenuto l'errore di connessione
			value.add(0);
		}

		// prepariamo la query SQL
		// prepared statements per evitare SQL-Injection
		String sql = "SELECT * FROM user WHERE email = ? AND password = ?";
		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setString(1, email);
			preparedStatement.setString(2, pw);

			// riceviamo il risultato della query SQL
			resultSet = preparedStatement.executeQuery();

			// controlliamo che nel risultato della query SQL esista una riga. Infatti
			// sarà solamente una riga corrispondente ad una tupla "e-mail - password".
			// se il risultato è nullo (nessuna riga) significa che email o password sono
			// incorretti
			if (resultSet.next()) {
				// wrongParam = false;
				value.add(0);
			} else {
				// wrongParam = true;
				value.add(1);
			}

		} catch (SQLException e) {
			System.out.println("Impossibile eseguire la query SQL");
		} finally {
			// Chiudere risorse
			try {
				if (resultSet != null)
					resultSet.close();
				if (preparedStatement != null)
					preparedStatement.close();
				closeConnection();
			} catch (SQLException e) {
				System.out.println("Impossibile chiudere le risorse del sistema");
			}
		}
		return value;
	}

	// Questo metodo inserisce un nuovo utente nel DB
	public List<Integer> insertUser(String user, String pass, String em) {
		getConnection();
		List<Integer> value = new ArrayList<>();
		/**
		 * Questo array VALUE ci serve per ritornare errori: 
		 - il primo elemento indica se lo username è unique o no 
		 - il secondo elemento indica se c'è un Connection Error oppure no
		 **/

		PreparedStatement preparedStatement = null;

		try {

			String insertSQL = "INSERT INTO user (username, password, email) VALUES (?, ?, ?)";
			preparedStatement = connection.prepareStatement(insertSQL);
			preparedStatement.setString(1, user);
			preparedStatement.setString(2, pass);
			preparedStatement.setString(3, em);

			preparedStatement.executeUpdate(); // esegue lo statement SQL
			value.add(1); // unique (inserito valore 1 se la registrazione è andata buon fine nel primo
							// posto)
			value.add(0); // connectionError (zero se non ci sono errori di connessione nel secondo campo)

		} catch (SQLException e) {
			if (e.getSQLState().equals("23000")) { // Codice di errore SQL per violazione di vincolo
				value.add(0); // unique
				value.add(0); // connectionError
			} else {
				System.out.println("Impossibile eseguire la query SQL");
				value.add(0); // unique
				value.add(1); // connectionerror
			}
		} finally {
			try {
				closeConnection();
				if (preparedStatement != null)
					preparedStatement.close(); // chiudo un oggetto e rilascio le risorse occupate dall'oggetto stesso
			} catch (SQLException e) {
				System.out.println("Impossibile chiudere le risorse del sistema");
			}
		}
		return value;
	}

}
