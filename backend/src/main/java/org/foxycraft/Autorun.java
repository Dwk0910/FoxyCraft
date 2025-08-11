package org.foxycraft;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import org.springframework.core.env.Environment;

import org.springframework.stereotype.Component;

import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Component
public class Autorun implements ApplicationRunner {

    private final Environment env;

    public Autorun(Environment env) {
        this.env = env;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String port = env.getProperty("local.server.port");
        String token = Files.readString(FoxyCraft.tokenFile.toPath());
        try (Writer writer = new OutputStreamWriter(new FileOutputStream(FoxyCraft.tokenFile), StandardCharsets.UTF_8)) {
            writer.write(port + "." + token);
        }
    }
}
