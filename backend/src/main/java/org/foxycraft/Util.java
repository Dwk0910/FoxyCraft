package org.foxycraft;

import org.jetbrains.annotations.NotNull;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;

import java.net.URI;
import java.net.URL;
import java.net.URISyntaxException;
import java.net.MalformedURLException;
import java.net.HttpURLConnection;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Util {
    public static String dataPath = System.getProperty("user.dir") + File.separator + "data";
    public static List<String> compatibleJRE = new ArrayList<>();
    public static Map<String, File> fileList = new HashMap<>();
    public static Map<String, RunnerInfo> runnerOriginMap = new HashMap<>();

    public record RunnerInfo(URL url, String reqJRE) {
        public RunnerInfo {
            if (!compatibleJRE.contains(reqJRE))
                throw new IllegalArgumentException("JRE version " + reqJRE + " is not compatible.");
        }
    }

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
                    "papermc-1.18.2", new RunnerInfo(new URI("https://fill-data.papermc.io/v1/objects/0578f18f4d632b494b468ec56b3b414b5b56fea087ee7d39cf6dcdf4c9d01f05/paper-1.18.2-388.jar").toURL(), "JRE17"),
                    "papermc-1.20.6", new RunnerInfo(new URI("https://fill-data.papermc.io/v1/objects/4b011f5adb5f6c72007686a223174fce82f31aeb4b34faf4652abc840b47e640/paper-1.20.6-151.jar").toURL(), "JRE17"),
                    "papermc-1.21.8", new RunnerInfo(new URI("https://fill-data.papermc.io/v1/objects/d310c61899acc608b683515c5c7ef929774bfd1b90262dac965e76c7e9ea8d22/paper-1.21.8-30.jar").toURL(), "JRE21")

                    // TODO: 나머지 구동기
            ));
        } catch (URISyntaxException | MalformedURLException e) {
            FoxyCraft.logger.error(e);
        }
    }

    public static <T> @NotNull T getContent(String fileName, Class<T> _class) {
        try {
            for (String fname : fileList.keySet()) {
                if (fname.equals(fileName)) {
                    return _class.cast(switch (_class.getSimpleName()) {
                        case "File" -> fileList.get(fname);
                        case "JSONObject" -> new JSONObject(Files.readString(fileList.get(fname).toPath(), StandardCharsets.UTF_8));
                        case "JSONArray" -> new JSONArray(Files.readString(fileList.get(fname).toPath(), StandardCharsets.UTF_8));
                        default -> throw new IllegalArgumentException("지원되지 않는 클래스입니다.");
                    });
                }
            }
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
        }

        throw new IllegalArgumentException("파일을 찾을 수 없습니다: " + fileName);
    }

    public static <T> void writeToFile(String fileName, T obj) {
        File f = fileList.get(fileName);
        try (Writer writer = new OutputStreamWriter(new FileOutputStream(f), StandardCharsets.UTF_8)) {

            // 일부 특정 클래스는 다르게 처리
            String className = obj.getClass().getSimpleName();

            switch (className) {
                case "JSONArray" -> writer.write(((JSONArray) obj).toString(4));
                case "JSONObject" -> writer.write(((JSONObject) obj).toString(4));
                default -> writer.write(obj.toString());
            }
        } catch (FileNotFoundException e) {
            FoxyCraft.logger.error("파일을 찾을 수 없습니다 : {}", fileName);
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
        }
    }

    public static void downloadFileFromURL(URL url, File target) {
        try {
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            if (!target.exists()) Files.createFile(target.toPath());
            FileOutputStream out = new FileOutputStream(target);
            BufferedInputStream bis = new BufferedInputStream(conn.getInputStream());

            int bytesRead;
            byte[] buffer = new byte[16384];
            while ((bytesRead = bis.read(buffer)) != -1) out.write(buffer, 0, bytesRead);

            bis.close();
            out.close();
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
        }
    }
}
