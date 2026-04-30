package rateLimiter.dto;

public class ThrottleRequest {
    private String apiKey;
    private String method;
    private String targetUrl;
    private String path;
    private byte[] body;

    public ThrottleRequest() {
    }

    public ThrottleRequest(String apiKey, String method, String targetUrl, String path, byte[] body) {
        this.apiKey = apiKey;
        this.method = method;
        this.targetUrl = targetUrl;
        this.path = path;
        this.body = body;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public byte[] getBody() {
        return body;
    }

    public void setBody(byte[] body) {
        this.body = body;
    }
}
