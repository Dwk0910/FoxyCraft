package org.foxycraft.controller;

import org.foxycraft.FoxyCraft;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/server")
@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
public class ServerController {
    private final SimpMessageSendingOperations messagingTemplate;

    public ServerController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/msg")
    public void message(@RequestParam("serverID") String id, @RequestParam("content") String content) {
        messagingTemplate.convertAndSend("/subscription/serversocket/" + id, content);
        FoxyCraft.logger.info("Content {} has been sent to room {}", content, id);
    }

//    @PostMapping("start")
//    public ResponseEntity<String> startServer(@RequestParam("targetID") String targetUUID) {
//        JSONObject targetObject = Util.getServer(targetUUID);
//        if (targetObject == null) return ResponseEntity.badRequest().build();
//        Util.setServer(targetUUID, targetObject.put("status", "pending"));
//        return ResponseEntity.ok().build();
//    }
}
