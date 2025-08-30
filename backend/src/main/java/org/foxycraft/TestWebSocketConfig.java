package org.foxycraft;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import org.foxycraft.controller.TestSocket;

@Configuration
@EnableWebSocket
public class TestWebSocketConfig  implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(getSocket(), "/testsocket").setAllowedOrigins("*");
    }

    public TestSocket getSocket() {
        return new TestSocket();
    }
}
