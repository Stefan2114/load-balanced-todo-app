# Load-Balanced TODO App with Secure Reverse Proxy

A production-ready, full-stack application featuring a Go backend, Vite/React frontend, and a highly available PostgreSQL cluster, all orchestrated via Docker Compose.

## Architecture Overview



* **Reverse Proxy & Load Balancer**: Nginx handles all incoming traffic on port **8443 (HTTPS)**. It performs SSL termination and distributes requests between two Web App replicas using **Round Robin**.
* **Web Tier**: Two Go (Gin) replicas provide the API. They are stateless, using **JWT (JSON Web Tokens)** for session preservation across replicas.
* **Database Tier**: A PostgreSQL cluster with **Bitnami Master-Slave replication**. Writes go to the Master; the Slave stays synchronized for high availability.
* **Monitoring**: **GoAccess** provides real-time traffic analytics via a centralized logging volume, accessible at `/logs`.

## Key Features

* **Full HTTPS**: Traffic is secured via self-signed SSL certificates.
* **Network Security**: API access is restricted via Nginx **ACLs** (Allow/Deny lists).
* **Environment Driven**: All ports, secrets, and database credentials are managed via a centralized `.env` file.
* **Stateless Authentication**: Sessions survive container restarts and replica switching thanks to shared JWT secrets.

## Quick Start

1. **Setup Environment**: Create a `.env` file based on the provided template.
2. **Generate Certs**: Place `fullchain.pem` and `privkey.pem` in the `./certs` folder.
3. **Launch Stack**:
   ```bash
   docker-compose up --build -d
4. **Access App**:
* **Frontend**: https://localhost:8443

* **API**: https://localhost:8443/api/

* **Logs**: https://localhost:8443/logs

* **Database Admin**: http://localhost:8081 (pgAdmin)