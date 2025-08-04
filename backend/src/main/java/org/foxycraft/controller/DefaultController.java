package org.foxycraft.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(origins = "http://localhost:5173", methods = RequestMethod.POST)
@RestController
public class DefaultController {
    @PostMapping("/health")
    public String health() {
        return "OK";
    }
}
