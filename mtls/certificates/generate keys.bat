@echo off

mkdir server_data 2>nul
mkdir client_data 2>nul
mkdir certificate_authority 2>nul

REM Create OpenSSL config file for server certificate
echo [ req ] > server_data\server_cert.conf
echo distinguished_name = req_distinguished_name >> server_data\server_cert.conf
echo req_extensions = v3_req >> server_data\server_cert.conf
echo prompt = no >> server_data\server_cert.conf
echo. >> server_data\server_cert.conf
echo [ req_distinguished_name ] >> server_data\server_cert.conf
echo CN = localhost >> server_data\server_cert.conf
echo. >> server_data\server_cert.conf
echo [ v3_req ] >> server_data\server_cert.conf
echo basicConstraints = CA:FALSE >> server_data\server_cert.conf
echo keyUsage = nonRepudiation, digitalSignature, keyEncipherment >> server_data\server_cert.conf
echo subjectAltName = @alt_names >> server_data\server_cert.conf
echo. >> server_data\server_cert.conf
echo [ alt_names ] >> server_data\server_cert.conf
echo DNS.1 = localhost >> server_data\server_cert.conf
echo IP.1 = 127.0.0.1 >> server_data\server_cert.conf

echo ============================================
echo GENERATING CA KEYS
echo ============================================
echo generating private key
openssl genpkey -algorithm RSA -out certificate_authority/ca_private_key.pem

echo generate self signed certificate
openssl req -new -x509 -key certificate_authority/ca_private_key.pem -out certificate_authority/ca_certificate.pem -days 365 -subj "/CN=Danish"

echo.
echo ============================================
echo GENERATING SERVER KEYS
echo ============================================
echo generating private key
openssl genpkey -algorithm RSA -out server_data/node_server_private_key.pem

echo generating CSR for server
openssl req -new -key server_data/node_server_private_key.pem -out server_data/node_server_csr.csr -config server_data/server_cert.conf

echo generate CA signed certificate
openssl x509 -req -in server_data/node_server_csr.csr -CA certificate_authority/ca_certificate.pem -CAkey certificate_authority/ca_private_key.pem -CAcreateserial -out server_data/node_server_certificate.pem -days 365 -extfile server_data/server_cert.conf -extensions v3_req

echo generate self signed certificate (for testing purpose only)
openssl req -x509 -key server_data/node_server_private_key.pem -out server_data/node_server_self_signed_certificate.pem -days 365 -subj "/CN=localhost"

echo.
echo ============================================
echo GENERATING CLIENT KEYS
echo ============================================
echo generating private key
openssl genpkey -algorithm RSA -out client_data/java_client_private_key.pem

echo generating CSR for client
openssl req -new -key client_data/java_client_private_key.pem -out client_data/java_client_csr.csr -subj "/CN=client"

echo generate CA signed certificate
openssl x509 -req -in client_data/java_client_csr.csr -CA certificate_authority/ca_certificate.pem -CAkey certificate_authority/ca_private_key.pem -CAcreateserial -out client_data/java_client_certificate.pem -days 365

echo generate pkcs12 file to be used in java
openssl pkcs12 -export -inkey client_data/java_client_private_key.pem -in client_data/java_client_certificate.pem -certfile certificate_authority/ca_certificate.pem -out client_data/java_client_identity.p12 -name "java_client_cert_alias" -passout pass:Danish

echo generate self signed certificate ()

pause