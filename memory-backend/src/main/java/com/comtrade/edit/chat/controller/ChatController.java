package com.comtrade.edit.chat.controller;

import com.comtrade.edit.chat.listener.WebSocketEventListener;
import com.comtrade.edit.chat.model.Game;
import com.comtrade.edit.chat.model.User;
import com.comtrade.edit.chat.model.Message;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.ThreadLocalRandom;
import org.hashids.Hashids;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@MessageMapping("/memory")
public class ChatController {
    public static HashMap<String, Game> Games = new HashMap<String, Game>();
    public static Integer numberOfCodes=1;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/createGame")
    @SendTo("/topic/newGame")
    public Game getStartGame(@Payload Game game) {
        
        //Generating code of game and codes of players 
        
        Hashids hashids = new Hashids("this is my salt", 4, "abcdefghijklmnopqrstuvwxyz1234567890");
        ArrayList<User> users=new ArrayList<User>();
       
        //for game
        String gameCode = hashids.encode(numberOfCodes);
        numberOfCodes++;
        game.setGameCode(gameCode); 
        
       for (int i=numberOfCodes; i<game.getNumberOfPlayers()+numberOfCodes; i++){
          String id = hashids.encode(i);
          User user = new User();
          user.setUserCode(id);
          user.setGameCode(gameCode);
          users.add(user);
       }
       
         numberOfCodes = numberOfCodes + game.getNumberOfPlayers();
       //for players
        game.setUsers(users);
        
        
        //Generate field for game
       Vector fields=new Vector();
       for(int i=0; i<game.getRows()*game.getRows()/2; i++) {
           fields.add(i+1);
           fields.add(i+1);
       }
       
       //Reshuffle field
       Collections.shuffle(fields); 
       
       game.setGameField(fields);
       
        //Add new game in HashMap
        Games.put(game.getGameCode(), game);
        
        return game;
    }
    
    
    @MessageMapping("/findRoom")
    public void findRoom(@Payload User user) {
       
    String gameCode = null;
    Boolean found = false;
    //Find room for player with code user.getKey()
    for(Map.Entry<String, Game> entry : Games.entrySet()) {
        String code = entry.getKey();
        Game game = entry.getValue();
        ArrayList<User> allUsers = game.getUsers();
        for (User u : allUsers) {
            if(u.getUserCode().equals(user.getUserCode())) {
                u.setUsername(user.getUsername());
                gameCode=u.getGameCode();
                found=true;
                break;
            }
        }
        if (found) break;
    }
    user.setGameCode(gameCode);
    
    simpMessagingTemplate.convertAndSend("/topic/user"+user.getUserCode(), user);
    }
    
    @MessageMapping("/startGame")
    public void startGame(@Payload Game game) {
       
    String gameCode = game.getGameCode();
    Boolean found = false;
    //Find game status for room with code gameCode
    for(Map.Entry<String, Game> entry : Games.entrySet()) {
        String code = entry.getKey();
        Game game1 = entry.getValue();
        if(code.equals(gameCode))  {
            game=game1;
            break;
         }
        
        if (found) break;
    }
    
    simpMessagingTemplate.convertAndSend("/topic/room"+gameCode, game);
    }
}
