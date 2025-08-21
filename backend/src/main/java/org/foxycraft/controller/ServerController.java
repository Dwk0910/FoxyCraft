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

import java.io.IOException;

import java.net.URI;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/server")
@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
public class ServerController {
    public static final class WebSocketHandler extends TextWebSocketHandler {
        public static UUID uuid;

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
            try {
                String id = getUUID(session.getUri());
                if (id == null) {
                    session.close(CloseStatus.BAD_DATA);
                    return;
                }

                uuid = UUID.fromString(id);

                session.sendMessage(new TextMessage(Map.of("content", "Connection Established").toString()));
                FoxyCraft.logger.info("Connection established : SESSION_ID: {}, UUID: {}", session.getId(), uuid.toString());
            } catch (IOException e) {
                FoxyCraft.logger.error(e);
            }
        }

        @Override
        public void afterConnectionClosed(WebSocketSession session, @NotNull CloseStatus status) {
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
