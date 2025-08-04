package org.foxycraft;

import org.jetbrains.annotations.NotNull;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.io.OutputStreamWriter;
import java.io.FileOutputStream;
import java.io.FileNotFoundException;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import java.util.HashMap;
import java.util.Map;

public class Util {
    public static String dataPath = System.getProperty("user.dir") + File.separator + "data";
    public static Map<String, File> fileList = new HashMap<>();

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
    }

    public static <T> @NotNull T getContent(String fileName, Class<T> _class) {
        try {
            for (String fname : fileList.keySet()) {
                FoxyCraft.logger.info(fname);
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
        try {
            File f = fileList.get(fileName);
            Writer writer = new OutputStreamWriter(new FileOutputStream(f), StandardCharsets.UTF_8);

            // 일부 특정 클래스는 다르게 처리
            String className = obj.getClass().getSimpleName();
            if (className.equals("JSONArray")) writer.write(((JSONArray) obj).toString(4));
            else if (className.equals("JSONObject")) writer.write(((JSONObject) obj).toString(4));
            else {
                writer.write(obj.toString());
            }
            writer.close();
        } catch (FileNotFoundException e) {
            FoxyCraft.logger.error("파일을 찾을 수 없습니다 : {}", fileName);
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
        }
    }
}
