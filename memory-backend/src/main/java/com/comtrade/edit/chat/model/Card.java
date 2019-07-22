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
public class Card {

    
    private int fieldValue;
    private boolean status;

    public Card(int fieldValue, boolean status) {
        this.fieldValue = fieldValue;
        this.status = status;
    }
    

    public int getFieldValue() {
        return fieldValue;
    }

    public void setFieldValue(int fieldValue) {
        this.fieldValue = fieldValue;
    }
    

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
    
    
}
