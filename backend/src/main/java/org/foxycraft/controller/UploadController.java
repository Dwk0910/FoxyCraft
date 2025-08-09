package org.foxycraft.controller;


import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.multipart.MultipartFile;

import org.foxycraft.FoxyCraft;

import java.io.File;
import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
@RequestMapping("/fileio")
@RestController
public class UploadController {
    @PostMapping("/upload")
    public ResponseEntity<String> onUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("File is empty");
        try {
            File targetFile = new File(FoxyCraft.tempDir.getPath() + File.separator + file.getOriginalFilename());
            if (!targetFile.getParentFile().exists() && !targetFile.getParentFile().mkdirs()) throw new IOException("Could not create directory");
            file.transferTo(targetFile);
            return ResponseEntity.ok(targetFile.getAbsolutePath());
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
            return ResponseEntity.status(500).body("Internal Server Error.");
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> onCancel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("File is empty");
        try {
            File targetFile = new File(FoxyCraft.tempDir.getPath() + File.separator + file.getOriginalFilename());
            if (!targetFile.exists()) throw new IOException("Parent folder does not exist.");
            if (!targetFile.delete()) throw new IOException("Could not delete file.");
            return ResponseEntity.ok("success");
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
            return ResponseEntity.status(500).body("Internal Server Error.");
        }
    }
}
