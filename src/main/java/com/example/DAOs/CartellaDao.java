package com.example.DAOs;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import com.example.beans.*;

public class CartellaDao {

	Connection connection = null; // Questa è la connessione attuale al DB

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

	// Questo metodo cancella la cartella dal DB
	public void deleteCartella(String user, Integer idToDelete) {
		getConnection();
		PreparedStatement preparedStatement = null; // PreparedStatement per evitare sql injection
		String sql = "DELETE FROM cartella WHERE id = ? and proprietario = ?";

		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idToDelete);
			preparedStatement.setString(2, user);
			
			preparedStatement.executeUpdate(); // Cancelliamo l'elemento dalla tabella
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

	// Questo metodo ritorna il nome di una cartella dato il suo ID
	public String getNomeCartellaById(String user, Integer idCartella) {
		String nomeCartella = null;
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;
		getConnection();

		String sql1 = "SELECT nome FROM cartella WHERE id = ? and proprietario = ?";

		try {
			preparedStatement = connection.prepareStatement(sql1);
			preparedStatement.setInt(1, idCartella);
			preparedStatement.setString(2, user);

			resultSet = preparedStatement.executeQuery(); // riceviamo il risultato della query SQL

			if (resultSet.next()) { // se cartella trovata
				nomeCartella = resultSet.getString("nome");
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
		return nomeCartella;
	}

	// Metodo per recuperare tutte le cartelle in una determinata cartella del
	// database
	public List<Folder> getSubfoldersFromDB(String user, Integer cartella) {
		List<Folder> foundFolders = new ArrayList<>();

		getConnection();

		// inizializzazione delle variabili necessarie per la query
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;

		// prepared statements per evitare SQL-Injection
		String sql = "SELECT * FROM cartella WHERE sopracartella = ? and proprietario = ?";

		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, cartella);
			preparedStatement.setString(2, user);
			
			// riceviamo il risultato della query SQL
			resultSet = preparedStatement.executeQuery();

			while (resultSet.next()) { // per ogni elemento trovato
				Integer id = resultSet.getInt("id");
				String proprietario = resultSet.getString("proprietario");
				String nome = resultSet.getString("nome");
				Date data_creazione = resultSet.getDate("data_creazione");
				Integer sopracartella = resultSet.getInt("sopracartella");
				Folder folderToAdd = new Folder(id, proprietario, nome, data_creazione, sopracartella);

				folderToAdd.setSottocartelle(getSubfoldersFromDB(user, id));
				foundFolders.add(folderToAdd);
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
		return foundFolders;
	}

	// Metodo per recuperare tutte le cartelle dal database in una lista (comprese
	// le sottocartelle)
	public List<Folder> getAllUserFolder(String user) {
		getConnection();

		List<Folder> allFolders = new ArrayList<>();

		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;

		// prepariamo la query SQL
		// prepared statements per evitare SQL-Injection
		String sql = "SELECT * FROM cartella WHERE sopracartella is NULL and proprietario = ?";
		try {
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setString(1, user);
			// prendiamo in considerazione le cartelle più esterne
			// (le quali potranno avere sottocartelle)

			// riceviamo il risultato della query SQL
			resultSet = preparedStatement.executeQuery();

			while (resultSet.next()) {
				Integer id = resultSet.getInt("id");
				String proprietario = resultSet.getString("proprietario");
				String nome = resultSet.getString("nome");
				Date data_creazione = resultSet.getDate("data_creazione");

				// se sopracartella è diverso da null, allora metto ID della sopracartella,
				// altrimenti metto NULL
				Integer sopracartella = resultSet.getObject("sopracartella") != null ? resultSet.getInt("sopracartella")
						: null;
				Folder folderToAdd = new Folder(id, proprietario, nome, data_creazione, sopracartella); // aggiungo la
																										// cartella più
																										// esterna
				folderToAdd.setSottocartelle(null); // default
				folderToAdd.setSottocartelle(getSubfoldersFromDB(user, folderToAdd.getId()));
				allFolders.add(folderToAdd);
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
		return allFolders;
	}

	// Metodo per creare una nuova sottocartella nel DB
	public Integer createSubfolderIntoDB(String proprietario, String nome, Date data_creazione, Integer sopracartella) {
		Integer generatedId = null;
		getConnection();

		// inizializzazione delle variabili necessarie per la query
		PreparedStatement preparedStatement = null;

		// prepared statements per evitare SQL-Injection
		String sql = "INSERT INTO cartella (proprietario, nome, data_creazione, sopracartella) values (?,?,?,?)";
		try {
			preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

			preparedStatement.setString(1, proprietario);
			preparedStatement.setString(2, nome);
			preparedStatement.setDate(3, data_creazione);
			preparedStatement.setInt(4, sopracartella);

			preparedStatement.executeUpdate();

			// recuperiamo l'ID generato automaticamente dal server SQL
			ResultSet generatedKeys = preparedStatement.getGeneratedKeys();
			if (generatedKeys.next()) {
				generatedId = generatedKeys.getInt(1); // Ottieni l'ID generato
			}

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
		return generatedId;
	}

	// Metodo per creare cartelle ROOT (non hanno una sopracartella) nel DB
	public Integer createRootFolderIntoDB(String proprietario, String nome, Date data_creazione) {
		Integer generatedId = null;
		getConnection();

		// inizializzazione delle variabili necessarie per la query
		PreparedStatement preparedStatement = null;

		// prepared statements per evitare SQL-Injection
		String sql = "INSERT INTO cartella (proprietario, nome, data_creazione, sopracartella) values (?,?,?,?)";
		try {
			preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

			preparedStatement.setString(1, proprietario);
			preparedStatement.setString(2, nome);
			preparedStatement.setDate(3, data_creazione);
			preparedStatement.setNull(4, java.sql.Types.INTEGER);

			preparedStatement.executeUpdate();

			// recuperiamo l'ID generato automaticamente dal server SQL
			ResultSet generatedKeys = preparedStatement.getGeneratedKeys();
			if (generatedKeys.next()) {
				generatedId = generatedKeys.getInt(1); // Ottieni l'ID generato
			}

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
		return generatedId;
	}

}
