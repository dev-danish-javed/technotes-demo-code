import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.security.KeyStore;
import java.security.cert.CertificateFactory;
import java.nio.file.Path;
import java.nio.file.Paths;

public class HitEndpoint {
    public static void main(String[] args) {
        String httpUrl = "http://localhost:3200/greet/danish";
        String httpUrls = "https://localhost:3300/greet/danish";

        System.out.println("===== HTTP CALL ========================");
        hitHttp(httpUrl);
        System.out.println("================================================");

        System.out.println();

        System.out.println("===== HTTPS CALL ========================");
        hitHttps(httpUrls);
        System.out.println("================================================");

    }

    static void hitHttp(String url) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Protocol : HTTP");
            System.out.println("Status: " + response.statusCode());
            System.out.println("Result of call: " + response.body());
        } catch (Exception e) {
            System.out.println("HTTP call failed: " + e.getMessage());
        }
    }

    static void hitHttps(String url) {
        try {
            // Load client keystore
            KeyStore clientKeyStore = KeyStore.getInstance("PKCS12");
            clientKeyStore.load(Files.newInputStream(Path.of("./../../certificates/client_data/java_client_identity.p12")), "Danish".toCharArray());

            // Set up the key manager with the client keystore
            KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            kmf.init(clientKeyStore, "Danish".toCharArray());

            // Load CA certificate
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("ca-cert", cf.generateCertificate(Files.newInputStream(Paths.get("./../../certificates/certificate_authority/ca_certificate.pem"))));

            // Set up trust manager with the CA certificate
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init(trustStore);

            // Initialize SSL context with key and trust managers
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);

            // Create HTTP client with SSL context
            HttpClient client = HttpClient.newBuilder().sslContext(sslContext).build();
//            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Protocol : HTTPS");
            System.out.println("Status: " + response.statusCode());
            System.out.println("Result of call: " + response.body());
        } catch (Exception e) {
            System.out.println("HTTPS setup failed: " + e.getClass());
        }
    }
}
