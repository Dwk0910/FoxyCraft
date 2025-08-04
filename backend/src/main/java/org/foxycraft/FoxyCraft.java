package org.foxycraft;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.IOException;

import java.net.ServerSocket;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class FoxyCraft {
    public static Logger logger = LogManager.getLogger();
    public static File serverList = new File(System.getProperty("user.dir") + File.separator + "serverList.dat");

    public static void main(String[] args) {
        int port = 3001;

        logger.info("Started to find free port...");

        do {
            if (port > 3010) {
                logger.error("un-free port exceed the range of the usable port. {}", port);
                System.exit(-1);
            }

            // 비어있는 포트 구하기
            try (ServerSocket ignored = new ServerSocket(port)) {
                logger.info("Port found : {}", port);
                break;
            } catch (IOException e) {
                logger.info("Already registered : {}", port);
                port++;
            }
        } while (true);

        logger.info("Running springboot in port {}...", port);

        List<String> argList = new ArrayList<>(Arrays.asList(args));
        String argument = "--server.port=%d".formatted(port);
        if (!argList.contains(argument)) argList.add(argument);

        String[] newArgs = argList.toArray(new String[0]);

        SpringApplication.run(FoxyCraft.class, newArgs);
    }
}
