package org.foxycraft;

import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import org.springframework.context.annotation.Configuration;

import org.foxycraft.controller.ServerController;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(getNewWebSocketHandler(), "/websocket")
                .setAllowedOrigins("http://localhost:5173", "http://127.0.0.1:5173");
    }

    public ServerController.WebSocketHandler getNewWebSocketHandler() {
        return new ServerController.WebSocketHandler();
    }
}
