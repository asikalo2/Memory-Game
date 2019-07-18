/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.comtrade.edit.chat.model;

import java.util.Vector;

/**
 *
 * @author user
 */
public class Game {

    private int key;
    private String username;
    private int status;
    private int level;
    private Vector gameField = new Vector();

    
    public int getKey() {
        return key;
    }

    public void setKey(int key) {
        this.key = key;
    }
    public void setGameField(Vector gameField) {
        this.gameField = gameField;
    }

    public Vector getGameField() {
        return gameField;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
       this.username=username;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
    
    public int getLevel() {
        return level;
    }
    
    public void setLevel(int level) {
        this.level = level;
    }
    
}
