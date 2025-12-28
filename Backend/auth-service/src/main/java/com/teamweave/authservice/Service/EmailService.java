package com.teamweave.authservice.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Value("${brevo.api.key}") // Stored in application.properties
    private String apiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    private final RestTemplate restTemplate;

    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String sendEmail(String to, String subject, String text) {
        String url = "https://api.brevo.com/v3/smtp/email";

        // ✅ Construct JSON dynamically using String.format
        String jsonPayload = String.format(
                "{\n" +
                        "   \"sender\": {\n" +
                        "      \"name\": \"%s\",\n" +
                        "      \"email\": \"%s\"\n" +
                        "   },\n" +
                        "   \"to\": [\n" +
                        "      { \"email\": \"%s\", \"name\": \"User\" }\n" +
                        "   ],\n" +
                        "   \"subject\": \"%s\",\n" +
                        "   \"htmlContent\": \"<html><head></head><body><p>%s</p></body></html>\"\n" +
                        "}", senderName, senderEmail, to, subject, text
        );

        // ✅ Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("accept", "application/json");
        headers.set("api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // 🔍 Helpful logging to debug
            System.err.println("❌ Brevo API error: " + e.getStatusCode());
            System.err.println("Response: " + e.getResponseBodyAsString());
            return "Failed to send email: " + e.getMessage();
        }
    }
}