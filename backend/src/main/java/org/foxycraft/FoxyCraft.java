package org.foxycraft;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class FoxyCraft {
    public static Logger logger = LogManager.getLogger();
    public static File tempDir = new File(System.getProperty("java.io.tmpdir") + File.separator + "foxycraft");
    public static File tokenFile = new File(tempDir.toPath() + File.separator + "token.tk");
    public static String dataPath = System.getProperty("APP_DATA_PATH");
    public static List<String> compatibleJRE = new ArrayList<>();
    public static Map<String, File> fileList = new HashMap<>();
    public static Map<String, Util.RunnerInfo> runnerOriginMap = new HashMap<>();


    public static void main(String[] args) {
        SpringApplication.run(FoxyCraft.class, args);
    }
}
