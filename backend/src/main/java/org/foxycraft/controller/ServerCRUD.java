package org.foxycraft.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import org.json.JSONArray;
import org.json.JSONObject;

import org.foxycraft.object.Server;
import org.foxycraft.Util;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
@RestController
public class ServerCRUD {
    @PostMapping("/create")
    public Map<String, Object> create(@RequestBody Server server) {
        UUID uuid = UUID.randomUUID();

        JSONArray serverList = Util.getContent("serverlist.dat", JSONArray.class);
        serverList.put(new JSONObject()
                .put("uuid", uuid.toString())
                .put("name", server.name())
                .put("argument", new JSONArray(server.args()))
                .put("path", server.serverDirectory().toPath())
                .put("reqJRE", server.reqJRE())
                .put("port", server.port()));

        Util.writeToFile("serverlist.dat", serverList);

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("uuid", uuid);

        return result;
    }
}
