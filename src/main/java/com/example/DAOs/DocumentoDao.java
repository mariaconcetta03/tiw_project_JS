package com.example.DAOs;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.example.beans.File;

public class DocumentoDao {

	Connection connection = null; // questa è la connessione attuale al DB

	// Questo metodo connette al DB
	private void getConnection() {
		final String JDBC_URL = "jdbc:mysql://localhost:3306/tiw_project?serverTimezone=UTC";
		final String JDBC_USER = "root";
		final String JDBC_PASSWORD = "iononsonotu";

		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
		} catch (ClassNotFoundException | SQLException e) {
			System.out.println("Impossibile stabilire la connessione col DB");
		}
	}

	// Questo metodo chiude la connessione con il DB
	private void closeConnection() {
		try {
			connection.close();
		} catch (SQLException e) {
			System.out.println("Impossibile chiudere la connessione col DB");
		}
	}

	// Questo metodo cancella un documento dal DB
	public void deleteDocumento(Integer idToDelete) {
		getConnection();
		PreparedStatement preparedStatement = null;

		String sql = "DELETE FROM documento WHERE id = ?";
		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idToDelete);

			// cancelliamo l'elemento dalla tabella
			preparedStatement.executeUpdate();

		} catch (SQLException e) {
			System.out.println("Impossibile eseguire la query SQL");
		} finally {
			// Chiudere risorse
			try {
				if (preparedStatement != null)
					preparedStatement.close();
				closeConnection();
			} catch (SQLException e) {
				System.out.println("Impossibile chiudere le risorse");
			}
		}
	}

	// Questo metodo restituisce un documento dato il suo ID
	public File findDocumentoByID(Integer fileId) {
		getConnection();
		File f = null;
		ResultSet resultSet = null;
		String sql = "SELECT * FROM documento WHERE id = ?";
		PreparedStatement preparedStatement = null;

		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, fileId);

			// riceviamo il risultato della query SQL
			resultSet = preparedStatement.executeQuery();
			Integer id;
			String proprietario;
			String nome;
			Date data_creazione;
			String sommario;
			String tipo;
			Integer cartella;

			if (resultSet.next()) { // se trovo il file
				id = resultSet.getInt("id");
				proprietario = resultSet.getString("proprietario");
				nome = resultSet.getString("nome");
				data_creazione = resultSet.getDate("data_creazione");
				sommario = resultSet.getString("sommario");
				tipo = resultSet.getString("tipo");
				cartella = resultSet.getInt("cartella");
				f = new File(id, proprietario, nome, data_creazione, sommario, tipo, cartella);
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
		return f;
	}

	// Metodo per recuperare tutti i documenti in una determinata cartella del database
	public List<File> getDocsFromFolder(String user, Integer folder) {
		getConnection();
		List<File> foundDocs = new ArrayList<>();

		// inizializzazione delle variabili necessarie per la query
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;

		// prepared statements per evitare SQL-Injection
		String sql = "SELECT * FROM documento WHERE cartella = ?";
		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, folder);

			// riceviamo il risultato della query SQL
			resultSet = preparedStatement.executeQuery();

			while (resultSet.next()) {
				Integer id = resultSet.getInt("id");
				String proprietario = resultSet.getString("proprietario");
				String nome = resultSet.getString("nome");
				Date data_creazione = resultSet.getDate("data_creazione");
				String sommario = resultSet.getString("sommario");
				String tipo = resultSet.getString("tipo");
				Integer cartella = resultSet.getInt("cartella");
				File docsToAdd = new File(id, proprietario, nome, data_creazione, sommario, tipo, cartella);
				foundDocs.add(docsToAdd);
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
		return foundDocs;
	}

	// Metodo per creare file
	public Integer createFile(String proprietario, String nome, Date data_creazione, String sommario, String tipo,
			Integer sopracartella) {
		getConnection();
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;
		Integer generatedId = null;

		// PreparedStatement per evitare SQL-Injection
		String sql = "INSERT INTO documento (proprietario, nome, data_creazione, sommario, tipo, cartella) values (?,?,?,?,?,?)";
		try {
			preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			preparedStatement.setString(1, proprietario);
			preparedStatement.setString(2, nome);
			preparedStatement.setDate(3, data_creazione);
			preparedStatement.setString(4, sommario);
			preparedStatement.setString(5, tipo);
			preparedStatement.setInt(6, sopracartella);

			preparedStatement.executeUpdate();

			// Recuperiamo l'ID generato automaticamente dal server SQL
			ResultSet generatedKeys = preparedStatement.getGeneratedKeys();
			if (generatedKeys.next()) {
				generatedId = generatedKeys.getInt(1); // Ottieni l'ID generato
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
		return generatedId;
	}


	// Questo metodo server per spostare un documento da una cartella all'altra
	public void updateFilePosition(Integer newFolderID, Integer fileID) {
		getConnection();
		PreparedStatement preparedStatement = null;

		// prepared statements per evitare SQL-Injection
		String sql = "UPDATE documento SET cartella = ? WHERE id = ? ";
		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, newFolderID);
			preparedStatement.setInt(2, fileID);

			// riceviamo il risultato della query SQL
			preparedStatement.executeUpdate();

		} catch (SQLException e) {
			System.out.println("Impossibile eseguire la query SQL");
		} finally {
			// Chiudere risorse
			try {
				if (preparedStatement != null)
					preparedStatement.close();
				closeConnection();
			} catch (SQLException e) {
				System.out.println("Impossibile chiudere le risorse del sistema");
			}
		}
	}

}
