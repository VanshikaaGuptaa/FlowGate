
import urllib.request
import urllib.error
import threading
import time

# Configuration
URL = "http://localhost:8080/proxy/orders"
API_KEY = "test_api_key_1" # Ensure this key exists in Redis with capacity/refillRate
NUM_REQUESTS = 20

def send_request(i):
    # Create request
    req = urllib.request.Request(URL, method="POST")
    req.add_header("X-API-Key", API_KEY)
    req.data = b"" # Empty body

    start_time = time.time()
    try:
        with urllib.request.urlopen(req) as response:
            elapsed = time.time() - start_time
            print(f"Request {i}: Status {response.getcode()} (Time: {elapsed:.2f}s)")
            # Should be 202 Accepted immediately
    except urllib.error.HTTPError as e:
        print(f"Request {i}: HTTP Error {e.code}")
    except Exception as e:
        print(f"Request {i}: Connection Error: {e}")

print(f"Sending {NUM_REQUESTS} concurrent requests to {URL} with API Key '{API_KEY}'...")

threads = []
for i in range(NUM_REQUESTS):
    t = threading.Thread(target=send_request, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print("\nAll requests sent. Check the application logs to see the throttled processing.")
