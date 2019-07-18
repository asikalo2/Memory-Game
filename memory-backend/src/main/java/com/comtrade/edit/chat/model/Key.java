/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.comtrade.edit.chat.model;

/**
 *
 * @author user
 */
public class Key {
    private String sender;
    private int key;

    

    public int getKey() {
        return key;
    }

    public void setKey(int type) {
        this.key = type;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}
