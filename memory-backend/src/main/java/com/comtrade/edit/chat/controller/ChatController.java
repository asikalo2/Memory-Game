package com.comtrade.edit.chat.controller;

import com.comtrade.edit.chat.listener.WebSocketEventListener;
import com.comtrade.edit.chat.model.Card;
import com.comtrade.edit.chat.model.Game;
import com.comtrade.edit.chat.model.User;
import com.comtrade.edit.chat.model.Message;
import com.comtrade.edit.chat.model.Move;
import com.comtrade.edit.chat.model.VisibleGameData;
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
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
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
    public static Integer numberOfCodes = 1;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/createGame")
    @SendTo("/topic/newGame")
    public VisibleGameData getStartGame(@Payload VisibleGameData gameV) {

        //Generating code of game and codes of players 
        Game game = new Game();
        game.setUsername(gameV.getUsername());
        game.setNumberOfPlayers(gameV.getNumberOfPlayers());
        game.setRows(gameV.getRows());

        Hashids hashids = new Hashids("this is my salt", 4, "abcdefghijklmnopqrstuvwxyz1234567890");
        ArrayList<User> users = new ArrayList<User>();

        //for game
        String gameCode = hashids.encode(numberOfCodes);
        numberOfCodes++;
        game.setGameCode(gameCode);

        for (int i = numberOfCodes; i < game.getNumberOfPlayers() + numberOfCodes; i++) {
            String id = hashids.encode(i);
            User user = new User();
            user.setUserCode(id);
            users.add(user);
        }

        numberOfCodes = numberOfCodes + game.getNumberOfPlayers();
        //for players
        game.setUsers(users);
        gameV.setUsers(users);

        //Generate field for game
        Vector fields = new Vector();
        for (int i = 0; i < game.getRows() * game.getRows() / 2; i++) {
            fields.add(i + 1);
            fields.add(i + 1);
        }

        //Reshuffle field
        Collections.shuffle(fields);
        
        Vector<Card> cards = new Vector<Card>();
        for (int i=0;i<fields.size();i++) {
            
            Card card=new Card(i,false);
            cards.add(card);
        }

        game.setGameField(cards);

        //Add new game in HashMap
        Games.put(game.getGameCode(), game);

        return gameV;
    }

    @MessageMapping("/findRoom")
    public void findRoom(@Payload User user, SimpMessageHeaderAccessor headerAccessor) {

        String gameCode = null;
        Boolean found = false;
        //Find room for player with code user.getKey()
        for (Map.Entry<String, Game> entry : Games.entrySet()) {
            String code = entry.getKey();
            Game game = entry.getValue();
            ArrayList<User> allUsers = game.getUsers();
            for (User u : allUsers) {
                if (u.getUserCode().equals(user.getUserCode())) {
                    if (u.getUsername() == null) {
                        u.setUsername(user.getUsername());
                        gameCode = code;
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                break;
            }
        }

        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            sessionAttributes.put("userCode", user.getUserCode());
            sessionAttributes.put("gameCode", gameCode);
        }

        JSONObject documentObj = new JSONObject();
        documentObj.put("gameCode", gameCode);
        simpMessagingTemplate.convertAndSend("/topic/user" + user.getUserCode(), documentObj);
    }

    @MessageMapping("/startGame")
    public void startGame(@Payload Game game) {

        String gameCode = game.getGameCode();

        Boolean found = false;
        //Find game status for room with code gameCode
        for (Map.Entry<String, Game> entry : Games.entrySet()) {
            String code = entry.getKey();
            Game game1 = entry.getValue();
            if (code.equals(gameCode)) {
                game = game1;
                break;
            }

            if (found) {
                break;
            }
        }

        JSONArray array = new JSONArray();
        for (User user : game.getUsers()) {
            JSONObject o = new JSONObject();
            o.put("username", user.getUsername());
            o.put("points", user.getPoints());
            array.add(o);
        }
        JSONObject obj = new JSONObject();
        obj.put("rows", game.getRows());
        obj.put("users", array);

        simpMessagingTemplate.convertAndSend("/topic/room" + gameCode, obj);
    }

    @MessageMapping("/sendMove")
    public void getCardValue(@Payload Move move) {

        //find gamecode
        String gameCode = null;
        Boolean found = false;
        int cardValue=0;
        //Find room for player with code user.getKey()
        
        for (Map.Entry<String, Game> entry : Games.entrySet()) {
            String code = entry.getKey();
            Game game = entry.getValue();
            ArrayList<User> allUsers = game.getUsers();
            for (User u : allUsers) {
                if (u.getUserCode().equals(move.getUserCode())) {
                    gameCode = code;
                    found = true;
                    cardValue=game.getGameField().get(move.getPosition()).getFieldValue();
                    game.getGameField().get(move.getPosition()).setStatus(true);
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        JSONObject obj=new JSONObject();
        obj.put("cardValue",cardValue);
        
     
        simpMessagingTemplate.convertAndSend("/topic/room" + gameCode, obj);
    }
   
}
