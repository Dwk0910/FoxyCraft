package org.foxycraft.controller;

import org.foxycraft.FoxyCraft;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Paths;

import java.util.List;

import org.jetbrains.annotations.NotNull;

public class TestSocket extends TextWebSocketHandler {
    public static Process process;
    public static volatile boolean isProcessRunning = false;

    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) {
        FoxyCraft.logger.info("연결 감지됨. 프로세스를 시작합니다. (세션:{})", session);

        Thread thread = new Thread(() -> {
            isProcessRunning = true;
            try {
                ProcessBuilder pb = new ProcessBuilder();
                pb.command(List.of(Paths.get(FoxyCraft.resourcesPath, "jre_mac", "bin", "java").toString(), "-jar", Paths.get(FoxyCraft.resourcesPath, "test.jar").toString()));
                process = pb.start();

                session.sendMessage(new TextMessage("프로세스 시작됨, " + process.isAlive()));
                BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;
                while ((line = br.readLine()) != null) {
                    if (!isProcessRunning) break;
                    FoxyCraft.logger.info("프로세스 출력: {}", line);
                    session.sendMessage(new TextMessage(line));
                }
            } catch (IOException e) {
                FoxyCraft.logger.error(e);
            }
        });
        thread.start();
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) {
        FoxyCraft.logger.info("연결 종료 감지됨. 프로세스를 종료합니다. (세션:{}, 상태:{})", session, status);
        isProcessRunning = false;
    }
}
