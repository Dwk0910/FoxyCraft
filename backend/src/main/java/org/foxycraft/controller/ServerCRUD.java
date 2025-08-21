package org.foxycraft.controller;

import org.apache.commons.io.FileUtils;

import org.foxycraft.Util;
import org.foxycraft.FoxyCraft;
import org.foxycraft.dto.ServerCreateRequest;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.io.File;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
@RequestMapping("/servercrud")
@RestController
public class ServerCRUD {
    // Add server actions

    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody ServerCreateRequest server) {
        try {
            // 서버 식별자 랜덤생성
            UUID uuid = UUID.randomUUID();

            // 서버 파일/폴더들 위치 확인
            File path = new File(server.path());
            if (!path.exists()) Files.createDirectory(path.toPath());
            else {
                // path 비우기
                if (path.listFiles() != null) FileUtils.cleanDirectory(path);
            }

            if (!server.servericon_path().isEmpty()) {
                File servericon = new File(server.servericon_path());
                if (!servericon.exists()) return ResponseEntity.status(515).body("servericon");
            }

            File runner;
            String jre;

            JSONArray serverList = Util.getContent("serverlist.dat", JSONArray.class);
            if (server.isCustom()) {
                // 커스텀 구동기 사용
                File custom_runner = new File(server.custom_runner_path());
                if (!custom_runner.exists())
                    return ResponseEntity.status(515).body("custom_runner");
                Files.move(custom_runner.toPath(), Paths.get(path.toPath().toString(), File.separator, custom_runner.getName()), StandardCopyOption.REPLACE_EXISTING);
                runner = new File(path.toPath() + File.separator + custom_runner.getName());

                // 요청 JRE 검사
                if (!FoxyCraft.compatibleJRE.contains(server.custom_jre())) return ResponseEntity.badRequest().body("custom_jre");
                else jre = server.custom_jre();
            } else {
                // 일반 구동기 사용
                Util.RunnerInfo runnerInfo = FoxyCraft.runnerOriginMap.get(server.runner());
                if (runnerInfo == null) return ResponseEntity.badRequest().build();
                // runner 등록
                runner = new File(path.toPath() + File.separator + server.runner() + ".jar");
                Util.downloadFileFromURL(runnerInfo.url(), runner);
                jre = runnerInfo.reqJRE();
            }

            // 객체 만들어서 리스트에 추가
            serverList.put(new JSONObject()
                    .put("UUID", uuid)
                    .put("name", server.name())
                    .put("runner", runner.toPath())
                    .put("jre", jre)
                    .put("port", server.port())
                    .put("status", "offline")
            );

            // 커스텀 서버 아이콘 사용
            if (!server.servericon_path().isEmpty()) {
                File f = new File(server.servericon_path());
                if (!f.exists()) return ResponseEntity.status(515).body("servericon");
                Files.move(f.toPath(), Paths.get(path.toPath() + File.separator + "server-icon.png"), StandardCopyOption.REPLACE_EXISTING);
            }

            // DB에 반영
            Util.writeToFile("serverlist.dat", serverList);

            return ResponseEntity.ok().body(uuid.toString());
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Server information responses

    @PostMapping("/get")
    public ResponseEntity<? extends Map<String, ?>> getServerList(@RequestParam("type") String type) {
        switch (type) {
            case "serverlist" -> {
                // 각 서버의 runner가 살아있는지 확인하고 올바른 서버만 반영 배열에 추가
                Map<String, Map<String, Object>> result = new HashMap<>();
                JSONArray array = Util.getContent("serverlist.dat", JSONArray.class);
                JSONArray newArray = new JSONArray();
                for (Object o : array) {
                    try {
                        JSONObject obj = new JSONObject(o.toString());
                        File runner = new File(obj.getString("runner"));
                        if (runner.exists()) {
                            newArray.put(o);
                            result.put(obj.getString("UUID"), obj.toMap());
                        }
                    } catch (JSONException ignored) {
                    }
                }

                // result 내용을 DB에 반영
                Util.writeToFile("serverlist.dat", newArray);

                // result 반환
                return ResponseEntity.ok(result);
            }

            case "status" -> {
                // runner array
                JSONArray array = Util.getContent("serverlist.dat", JSONArray.class);
                Map<String, String> statusMap = new HashMap<>();

                // object내의 UUID를 key로, status를 value로 Map 만들어서 리턴
                for (Object o : array) {
                    JSONObject obj = new JSONObject(o.toString());
                    statusMap.put(obj.getString("UUID"), obj.getString("status"));
                }

                return ResponseEntity.ok(statusMap);
            }

            default -> { return ResponseEntity.badRequest().build(); }
        }
    }
}
