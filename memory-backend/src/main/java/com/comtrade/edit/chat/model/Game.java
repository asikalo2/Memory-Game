/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.comtrade.edit.chat.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 *
 * @author user
 */
public class Game {
   
    private String username;
    private int numberOfPlayers;
    private int rows;
    private Vector <Card> gameField = new Vector<Card>();

    public Vector<Card> getGameField() {
        return gameField;
    }

    public void setGameField(Vector<Card> gameField) {
        this.gameField = gameField;
    }
    private ArrayList<User> users = new ArrayList<User>();
    private String gameCode;

    
    
    public ArrayList<User> getUsers() {
        return users;
    }

    public void setUsers(ArrayList<User> users) {
        this.users = users;
    }
    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

   

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(int numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
       this.username=username;
    }

    
}
