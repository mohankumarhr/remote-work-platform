package com.teamweave.callservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
		"com.teamweave.callservice",
		"com.localutil"
})
public class CallServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CallServiceApplication.class, args);
	}

}
