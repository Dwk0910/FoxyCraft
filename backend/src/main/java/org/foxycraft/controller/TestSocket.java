package org.foxycraft.controller;

import io.methvin.watcher.DirectoryChangeEvent;
import io.methvin.watcher.DirectoryWatcher;
import org.foxycraft.FoxyCraft;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.nio.file.*;

import org.jetbrains.annotations.NotNull;

public class TestSocket extends TextWebSocketHandler {
    public static DirectoryWatcher directoryWatcher;
    public static Path testPath = Paths.get(FoxyCraft.dataPath);
    public static Path targetPath = Paths.get(FoxyCraft.dataPath, "test.txt");

    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) {
        FoxyCraft.logger.info("연결 감지됨. 감시를 시작합니다. (세션:{})", session);

        try {
            directoryWatcher = DirectoryWatcher.builder()
                    .path(testPath)
                    .listener(event -> {
                        if (event.eventType() == DirectoryChangeEvent.EventType.MODIFY && event.path().equals(targetPath)) {
                            session.sendMessage(new TextMessage(Files.readString(targetPath)));
                            FoxyCraft.logger.info("{} MODIFIED", event.path());
                        }
                    })
                    .build();
            directoryWatcher.watchAsync();
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
        }
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) throws Exception {
        directoryWatcher.close();
    }
}
