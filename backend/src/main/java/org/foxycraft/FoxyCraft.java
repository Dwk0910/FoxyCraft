package org.foxycraft;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class FoxyCraft {
    public static Logger logger = LogManager.getLogger();
    public static File tempDir = new File(System.getProperty("java.io.tmpdir") + File.separator + "foxycraft");
    public static File tokenFile = new File(tempDir.toPath() + File.separator + "token.tk");
    public static File serverList = new File(System.getProperty("user.dir") + File.separator + "serverList.dat");

    public static void main(String[] args) {
        SpringApplication.run(FoxyCraft.class, args);
    }
}
