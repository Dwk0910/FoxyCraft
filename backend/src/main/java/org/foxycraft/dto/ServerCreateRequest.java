package org.foxycraft.dto;

public record ServerCreateRequest (
        String name,
        boolean isCustom,
        String runner,
        String custom_jre,
        String custom_runner_path,
        String path,
        int port,
        String servericon_path,
        String motd,
        int max_player,
        boolean online_mode,
        boolean auto_backup,
        int auto_backup_period,
        int auto_backup_max_count,
        String world_name
) {
}
