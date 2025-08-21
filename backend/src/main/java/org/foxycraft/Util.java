package org.foxycraft;

import org.jetbrains.annotations.NotNull;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.Writer;
import java.io.BufferedInputStream;
import java.io.OutputStreamWriter;
import java.io.FileOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import java.net.URL;
import java.net.HttpURLConnection;
import java.util.UUID;

public class Util {
    public record RunnerInfo(URL url, String reqJRE) {
        public RunnerInfo {
            if (!FoxyCraft.compatibleJRE.contains(reqJRE))
                throw new IllegalArgumentException("JRE version " + reqJRE + " is not compatible.");
        }
    }

    public static JSONObject getServer(String UUID) {
        try {
            for (Object o : getContent("serverlist.dat", JSONArray.class)) {
                JSONObject obj = new JSONObject(o.toString());
                if (obj.getString("UUID").equals(UUID)) return obj;
            }
            return null;
        } catch (JSONException e) {
            FoxyCraft.logger.error(e);
            throw new RuntimeException("The JSONException has been occured.");
        }
    }

    public static void setServer(String UUID, JSONObject targetObject) {
        JSONArray array = getContent("serverlist.dat", JSONArray.class);
        JSONObject obj = getServer(UUID);
        if (obj == null) throw new NullPointerException("The server you are looking for cannot be found. (UUID: " + UUID + ")");
        if (!UUID.equals(obj.getString("UUID"))) throw new RuntimeException("Restricted action: Server UUID is not changeable.");

        JSONArray newArray = new JSONArray();
        for (Object o : array) {
            JSONObject arrayObject = new JSONObject(o.toString());
            if (arrayObject.getString("UUID").equals(obj.getString("UUID"))) {
                newArray.put(targetObject);
            } else newArray.put(arrayObject);
        }
        writeToFile("serverlist.dat", newArray);
    }

    public static <T> @NotNull T getContent(String fileName, Class<T> _class) {
        try {
            for (String fname : FoxyCraft.fileList.keySet()) {
                if (fname.equals(fileName)) {
                    return _class.cast(switch (_class.getSimpleName()) {
                        case "File" -> FoxyCraft.fileList.get(fname);
                        case "JSONObject" -> new JSONObject(Files.readString(FoxyCraft.fileList.get(fname).toPath(), StandardCharsets.UTF_8));
                        case "JSONArray" -> new JSONArray(Files.readString(FoxyCraft.fileList.get(fname).toPath(), StandardCharsets.UTF_8));
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
        File f = FoxyCraft.fileList.get(fileName);
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

    public static JSONObject cloneJSONObject(JSONObject origin) {
        return new JSONObject(origin.toString());
    }

    public static boolean isUUID(String uuid) {
        try {
            UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
