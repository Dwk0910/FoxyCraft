package org.foxycraft.controller;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import org.jetbrains.annotations.NotNull;

import org.foxycraft.FoxyCraft;
import org.foxycraft.Util;

import org.json.JSONObject;

import java.io.IOException;

import java.net.URI;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/server")
@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
public class ServerController {
    public static final class WebSocketHandler extends TextWebSocketHandler {
        public static WebSocketSession SESSION;
        public static UUID uuid;

        private static final List<Thread> taskList = new ArrayList<>();

        public static String getUUID(URI uri) {
            String id;
            try {
                String query = Objects.requireNonNull(uri).getQuery();
                String[] querySplit = query.split("id=");
                if (!Util.isUUID(querySplit[querySplit.length - 1])) throw new NullPointerException();
                else id = querySplit[querySplit.length - 1];
            } catch (NullPointerException e) {
                return null;
            }
            return id;
        }

        @Override
        public void afterConnectionEstablished(@NotNull WebSocketSession session) {
            SESSION = session;

            try {
                String id = getUUID(SESSION.getUri());
                if (id == null) {
                    SESSION.close(CloseStatus.BAD_DATA);
                    return;
                }

                uuid = UUID.fromString(id);

                SESSION.sendMessage(new TextMessage(new JSONObject().put("content", "Connection Established").toString()));
                FoxyCraft.logger.info("Connection established : UUID: {}", uuid.toString());

                // 이벤트성 테스크 등록
                taskList.add(new Thread(() -> {
                    do {
                        try {
                            JSONObject receiveHeader = new JSONObject().put("page", "Console");
                            SESSION.sendMessage(new TextMessage(Util.cloneJSONObject(receiveHeader).put("content", "a").toString()));
                            Thread.sleep(1000);
                            SESSION.sendMessage(new TextMessage(Util.cloneJSONObject(receiveHeader).put("content", "b").toString()));
                            Thread.sleep(1000);
                            SESSION.sendMessage(new TextMessage(Util.cloneJSONObject(receiveHeader).put("content", "c").toString()));
                            Thread.sleep(1000);
                        } catch (InterruptedException | IOException e) {
                            FoxyCraft.logger.error(e);
                        }
                    } while (true);
                }));

                for (Thread t : taskList) {
                    if (!t.isAlive()) t.start();
                }
            } catch (IOException e) {
                FoxyCraft.logger.error(e);
            }
        }

        @Override
        public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) {
            for (Thread t : taskList) {
                t.interrupt();
            }

            FoxyCraft.logger.info("[session {}] Connection endded.", session.getId());
            if (status.getReason() != null) FoxyCraft.logger.warn("with reason : {}", status.getReason());
        }

        @Override
        protected void handleTextMessage(WebSocketSession session, TextMessage message) {
            String msg = new String(message.asBytes());
            FoxyCraft.logger.info("text message received(session:{}) : {}", session.getId(), msg);
        }
    }
}
