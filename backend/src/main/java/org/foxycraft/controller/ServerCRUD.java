package org.foxycraft.controller;

import org.apache.logging.log4j.core.util.FileUtils;

import org.foxycraft.Util;
import org.foxycraft.FoxyCraft;
import org.foxycraft.dto.ServerCreateRequest;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
@RestController
public class ServerCRUD {
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody ServerCreateRequest server) {
        try {
            // 서버 식별자 랜덤생성
            UUID uuid = UUID.randomUUID();

            // 서버 파일/폴더들 위치 확인
            File path = new File(server.path());
            if (!path.exists()) FileUtils.mkdir(path, true);

            if (!server.servericon_path().isEmpty()) {
                File servericon = new File(server.servericon_path());
                if (!servericon.exists()) return ResponseEntity.status(515).body("servericon");
            }

            File runner;

            JSONArray serverList = Util.getContent("serverlist.dat", JSONArray.class);
            if (server.isCustom()) {
                // 커스텀 구동기 사용
                File custom_runner = new File(server.custom_runner_path());
                if (!custom_runner.exists())
                    return ResponseEntity.status(515).body("custom_runner");
                Files.move(custom_runner.toPath(), Paths.get(path.toPath().toString(), File.separator, custom_runner.getName()), StandardCopyOption.REPLACE_EXISTING);
                runner = new File(path.toPath() + File.separator + custom_runner.getName());
            }

            // 일반 구동기 사용
            Util.RunnerInfo runnerInfo = Util.runnerOriginMap.get(server.runner());
            if (runnerInfo == null) return ResponseEntity.badRequest().build();
            // runner 등록
            runner = new File(path.toPath() + File.separator + server.runner() + ".jar");
            Util.downloadFileFromURL(runnerInfo.url(), runner);

            serverList.put(new JSONObject()
                    .put("name", server.name())
                    .put("runner", runner.toPath())
                    .put("port", server.port())
            );

//            Util.writeToFile("serverlist.dat", serverList);
//

        } catch (IOException e) {
            FoxyCraft.logger.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return null;
    }
}
