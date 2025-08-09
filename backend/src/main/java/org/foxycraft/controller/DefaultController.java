package org.foxycraft.controller;

import org.foxycraft.FoxyCraft;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;

import java.nio.file.Files;

@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
@RestController
public class DefaultController {
    @PostMapping("/health")
    public String health() {
        try {
            return Files.readString(FoxyCraft.tokenFile.toPath());
        } catch (IOException e) {
            FoxyCraft.logger.error(e);
            return e.toString();
        }
    }
}
