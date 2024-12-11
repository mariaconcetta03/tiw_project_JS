package com.example.beans;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

//Classe per rappresentare una cartella 
public class Folder {
	private Integer id;
	private String proprietario; // email proprietario (key)
	private String nome;
	private Date data_creazione;
	private Integer sopracartella; // (key) id == null se root else id == a id sopracartella
	private List<Folder> sottocartelle = new ArrayList<>();

	// COSTRUTTORE
	public Folder(Integer id, String proprietario, String nome, Date data_creazione, Integer sopracartella) {
		this.id = id;
		this.proprietario = proprietario;
		this.nome = nome;
		this.data_creazione = data_creazione;
		this.sopracartella = sopracartella;
		this.sottocartelle = null;
	}


	// -----------------------------------------------------
	// METODI GETTER 
	public Integer getId() {
		return id;
	}

	public String getProprietario() {
		return proprietario;
	}

	public String getNome() {
		return nome;
	}

	public Integer getSopracartella() {
		return sopracartella;
	}

	public Date getData_creazione() {
		return data_creazione;
	}

	public List<Folder> getSottocartelle() {
		return sottocartelle;
	}



	// -----------------------------------------------------
	// METODI SETTER 
	public void setId(Integer id) {
		this.id = id;
	}

	public void setProprietario(String proprietario) {
		this.proprietario = proprietario;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public void setData_creazione(Date data_creazione) {
		this.data_creazione = data_creazione;
	}

	public void setSopracartella(Integer sopracartella) {
		this.sopracartella = sopracartella;
	}

	public void setSottocartelle(List<Folder> sottocartelle) {
		this.sottocartelle = sottocartelle;
	}

}