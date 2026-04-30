package rateLimiter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * The body that the client sends to POST /proxy.
 *
 * Example:
 * {
 * "path": "/orders", // required — endpoint to forward to
 * "method": "POST", // optional — defaults to POST
 * "data": { "item": "book" } // optional — forwarded as JSON body
 * }
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProxyRequest {

    /** The endpoint path to forward to, e.g. "/orders" */
    private String path;

    /**
     * HTTP method to use when forwarding (GET, POST, PUT, DELETE …).
     * Defaults to POST when omitted.
     */
    private String method = "POST";

    /** Optional payload that will be forwarded to the backend as JSON. */
    private Object data;

    public ProxyRequest() {
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
