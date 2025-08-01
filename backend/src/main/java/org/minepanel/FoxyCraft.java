package org.minepanel;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

import java.net.ServerSocket;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class FoxyCraft {
    public static Logger logger = LogManager.getLogger();
    public static void main(String[] args) {
        int port = 3001;

        logger.info("포트 찾기를 시작합니다...");

        do {
            if (port > 3010) {
                logger.error("사용 가능한 포트의 범위를 초과했습니다. {}", port);
                System.exit(-1);
            }

            // 비어있는 포트 구하기
            try (ServerSocket ignored = new ServerSocket(port)) {
                logger.info("포트를 찾았습니다 : {}", port);
                break;
            } catch (IOException e) {
                logger.info("이미 등록된 포트 : {}", port);
                port++;
            }
        } while (true);

        logger.info("포트 {}로 springboot를 실행합니다...", port);

        List<String> argList = new ArrayList<>(Arrays.asList(args));
        String argument = "--server.port=%d".formatted(port);
        if (!argList.contains(argument)) argList.add(argument);

        String[] newArgs = argList.toArray(new String[0]);

        SpringApplication.run(FoxyCraft.class, newArgs);
    }
}
