package com.pagepulse.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Jsoup HTTP client.
 */
@Configuration
@ConfigurationProperties(prefix = "app.jsoup")
public class JsoupConfig {

    private int timeout = 15000;
    private String userAgent = "Mozilla/5.0 (compatible; PagePulseBot/1.0; +https://pagepulse.app)";
    private boolean followRedirects = true;
    private int maxBodySize = 5242880; // 5MB

    public int getTimeout() { return timeout; }
    public void setTimeout(int timeout) { this.timeout = timeout; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public boolean isFollowRedirects() { return followRedirects; }
    public void setFollowRedirects(boolean followRedirects) { this.followRedirects = followRedirects; }

    public int getMaxBodySize() { return maxBodySize; }
    public void setMaxBodySize(int maxBodySize) { this.maxBodySize = maxBodySize; }
}

