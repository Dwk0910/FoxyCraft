package org.foxycraft.controller;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import org.json.JSONArray;

import org.foxycraft.Util;

@RestController
@RequestMapping("server")
@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
public class ServerController {
    @PostMapping("start")
    public ResponseEntity<String> startServer(@RequestParam("targetID") String targetUUID) {
        JSONObject targetObject = Util.getServer(targetUUID);
        if (targetObject == null) return ResponseEntity.badRequest().build();
        Util.setServer(targetUUID, targetObject.put("status", "pending"));
        return ResponseEntity.ok().build();
    }
}
