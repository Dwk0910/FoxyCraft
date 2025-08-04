package org.foxycraft.object;

import java.io.File;
import java.util.List;

public record Server (
        File serverDirectory,
        String name,
        List<String> args,
        int port
) {

}
