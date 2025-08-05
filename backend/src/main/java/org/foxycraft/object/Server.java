package org.foxycraft.object;

import java.io.File;
import java.util.List;

public record Server (
        File serverDirectory,
        String name,
        String reqJRE,
        List<String> args,
        int port
) {

}
