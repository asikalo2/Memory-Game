package com.comtrade.edit.chat.controller;

import com.comtrade.edit.chat.model.Game;
import com.comtrade.edit.chat.model.Key;
import com.comtrade.edit.chat.model.Message;
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.ThreadLocalRandom;
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
    
    
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/sendMessage")
    @SendTo("/topic/public/{96}")
    public Message sendMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            sessionAttributes.put("username", message.getSender());
        }

        return message;
    }
    @MessageMapping("/getKey")
    @SendTo("/topic/newGame")
    public Key getKey(@Payload Key key) {
        int group_id = ThreadLocalRandom.current().nextInt(1000, 9999);
        key.setKey(group_id);
        
       // dodati hashid
       
        return key;
    }
    
    
    @MessageMapping("/loadGame")
//    @SendTo("/topic/group-id1234")
    public void loadGame(@Payload Game game) {
       
      //genarate game field
      
      int array[]=new int[]{1,7,6,5,8,4,1,3,2,3,7,5,8,6,4,2};
       Vector fields=new Vector(Arrays.asList(array));
       
       game.setGameField(fields);
       simpMessagingTemplate.convertAndSend("/topic/group-id"+game.getKey(), game);
    }

}
