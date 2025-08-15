package org.foxycraft;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.json.JSONArray;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.foxycraft.Util.writeToFile;

import java.io.File;
import java.io.IOException;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;

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

    static {
        File dataFolder = new File(dataPath);
        if (!dataFolder.exists()) if(!dataFolder.mkdirs()) FoxyCraft.logger.error("data폴더 생성 실패");

        // create file instance
        File serverList = new File(dataPath + File.separator + "serverlist.dat");
        fileList.put("serverlist.dat", serverList); // serverList

        // initialize file
        if (!serverList.exists()) {
            try {
                if (!serverList.createNewFile()) throw new IOException("Creation Failed");
                writeToFile("serverlist.dat", new JSONArray());
            } catch (IOException e) {
                FoxyCraft.logger.error(e);
            }
        }

        // register compatible JRE's version
        compatibleJRE.addAll(List.of("JRE8", "JRE11", "JRE17", "JRE21"));

        // register runner origin's URL
        try {
            runnerOriginMap.putAll(Map.of(
                    "papermc-1.18.2", new Util.RunnerInfo(new URI("https://fill-data.papermc.io/v1/objects/0578f18f4d632b494b468ec56b3b414b5b56fea087ee7d39cf6dcdf4c9d01f05/paper-1.18.2-388.jar").toURL(), "JRE17"),
                    "papermc-1.20.6", new Util.RunnerInfo(new URI("https://fill-data.papermc.io/v1/objects/4b011f5adb5f6c72007686a223174fce82f31aeb4b34faf4652abc840b47e640/paper-1.20.6-151.jar").toURL(), "JRE17"),
                    "papermc-1.21.8", new Util.RunnerInfo(new URI("https://fill-data.papermc.io/v1/objects/d310c61899acc608b683515c5c7ef929774bfd1b90262dac965e76c7e9ea8d22/paper-1.21.8-30.jar").toURL(), "JRE21")

                    // TODO: 나머지 구동기
            ));
        } catch (URISyntaxException | MalformedURLException e) {
            FoxyCraft.logger.error(e);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(FoxyCraft.class, args);
    }
}
