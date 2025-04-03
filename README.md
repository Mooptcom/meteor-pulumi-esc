# Meteor App Deployment with Pulumi ESC

This repository demonstrates how to securely deploy a Meteor 3 application to Google Cloud Run using Pulumi ESC for secret management. The application connects to a MongoDB Atlas database, with the connection string securely stored and accessed using Pulumi ESC.

*This project was created for the [Pulumi Deploy and Document Challenge: Shhh, It's a Secret!](https://dev.to/kafechew/a-mini-reddit-app-deployed-to-cloudrun-with-pulumi-esc-meteor-mongodb-atlas-1i59-temp-slug-9475936)*


![Pulumi ESC](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t97bub2fg7pqu593naph.png)

- **Real-time Demo**: https://meteor-app-service-b378141-szyom6qpxq-uc.a.run.app
or https://meteor-app-service-b378141-1099397202050.us-central1.run.app/ 

- **Demo video**: https://youtu.be/V2-wESswkV8 and https://www.youtube.com/watch?v=O5kcxLiycJM


## 🌟 Features

- **Secure Secret Management**: Using Pulumi ESC to securely store and access MongoDB connection strings
- **Containerized Meteor App**: Multi-stage Docker build optimized for Meteor 3 applications
- **Serverless Deployment**: Automatic deployment to Google Cloud Run
- **Infrastructure as Code**: Complete infrastructure defined using Pulumi
- **Voting Application**: Simple Meteor application with MongoDB integration

## 🏗️ Architecture

The architecture consists of:

- **Meteor Application**: A Meteor 3 app with BlazeJS and a todos feature
- **MongoDB Atlas**: A managed MongoDB database for data storage
- **Google Cloud Run**: A serverless platform for running containers
- **Google Artifact Registry**: A repository for storing Docker images
- **Pulumi ESC**: A secure way to manage configuration and secrets

## 🚀 Getting Started

### Prerequisites

- [Google Cloud Account](https://cloud.google.com/) with billing enabled
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Pulumi ESC CLI](https://www.pulumi.com/docs/esc/get-started/)
- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/Mooptcom/meteor-pulumi-esc.git
   cd meteor-pulumi-esc
   ```

2. Set up MongoDB Atlas:

   - Create a new cluster (free tier works fine)
   - Create a database user with read/write permissions
   - Configure network access to allow connections from anywhere (for development)
   - Get your connection string

3. Set up Google Cloud:

   ```bash
   # Create a new project (or use an existing one)
   gcloud projects create YOUR_PROJECT_ID --name="Meteor Pulumi ESC"
   gcloud config set project YOUR_PROJECT_ID
   
   # Enable required APIs
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable compute.googleapis.com
   
   # Create a service account for Pulumi
   gcloud iam service-accounts create pulumi-deployer \
       --description="Service account for Pulumi deployments" \
       --display-name="Pulumi Deployer"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
       --member="serviceAccount:pulumi-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/editor"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
       --member="serviceAccount:pulumi-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/run.admin"
   
   # Create and download a key file
   gcloud iam service-accounts keys create ~/pulumi-deployer-key.json \
       --iam-account=pulumi-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com
   
   # Set the environment variable for Pulumi to use
   export GOOGLE_APPLICATION_CREDENTIALS=~/pulumi-deployer-key.json
   ```

4. Set up Pulumi ESC:

   ```bash
   # Log in to Pulumi
   pulumi login
   esc login
   
   # Create an ESC environment
   esc env init meteor-pulumi/dev
   
   # Set your MongoDB connection string as a secret
   esc env set meteor-pulumi/dev mongodb_uri 'mongodb+srv://username:password@cluster.mongodb.net/database' --secret
   
   # Set your GCP configuration
   esc env set meteor-pulumi/dev gcp_project 'YOUR_PROJECT_ID'
   esc env set meteor-pulumi/dev gcp_region 'us-central1'
   ```

5. Install dependencies and deploy:

   ```bash
   # Navigate to the Pulumi infrastructure directory
   cd pulumi-infra
   
   # Install dependencies
   npm install
   
   # Create the script to fetch ESC values
   cat > get-esc-values-simple.js << 'EOF'
   const { execSync } = require('child_process');
   const fs = require('fs');
   
   try {
       // Get all values in JSON format
       const output = execSync(`esc env open meteor-pulumi/dev`, { encoding: 'utf8' });
       
       try {
           // Parse the JSON output
           const values = JSON.parse(output);
           
           // Write values to a file that can be imported by Pulumi
           fs.writeFileSync('esc-values.json', JSON.stringify(values, null, 2));
           console.log('ESC values written to esc-values.json');
       } catch (error) {
           console.error(`Error parsing JSON output:`, error.message);
           console.error(`Output:`, output);
       }
   } catch (error) {
       console.error(`Error getting ESC values:`, error.message);
   }
   EOF
   
   cat > pre-deploy.sh << 'EOF'
   #!/bin/bash
   set -e
   
   echo "Fetching ESC values..."
   node get-esc-values-simple.js
   
   echo "ESC values updated. Ready for deployment."
   EOF
   
   chmod +x pre-deploy.sh
   
   # Run the pre-deployment script
   ./pre-deploy.sh
   
   # Deploy the application
   pulumi up
   ```

6. Access your application:

   ```bash
   # Get the URL of your deployed application
   pulumi stack output url
   ```

## 🧩 Project Structure

```
meteor-pulumi-esc/
├── meteor-app/                      # Meteor application
│   ├── .meteor/                     # Meteor-specific files
│   ├── client/                      # Client-side code
│   │   ├── main.html                # Main HTML template
│   │   ├── main.js                  # Client entry point
│   │   └── main.css                 # Styles
│   ├── imports/                     # Shared code
│   │   └── api/                     # API code
│   │       └── collections.js       # MongoDB collections
│   ├── server/                      # Server-side code
│   │   └── main.js                  # Server entry point
│   └── Dockerfile                   # Docker build instructions
├── pulumi-infra/                    # Pulumi infrastructure code
│   ├── index.js                     # Main Pulumi program
│   ├── get-esc-values-simple.js     # Script to fetch ESC values
│   └── pre-deploy.sh                # Pre-deployment script
└── docs/                            # Documentation
    ├── deployment.md                # Deployment guide
    └── pulumi-esc-secrets.md        # ESC usage documentation
```

## 🔄 Workflow

### Development Workflow

1. Make changes to the Meteor app locally
2. Test the changes locally with `meteor`
3. Commit and push changes to GitHub
4. Pull changes in your deployment environment
5. Run the pre-deployment script: `./pre-deploy.sh`
6. Deploy with Pulumi: `pulumi up`

### Updating Secrets

To update your MongoDB connection string or other secrets:

```bash
# Update the MongoDB connection string
esc env set meteor-pulumi/dev mongodb_uri 'mongodb+srv://new-username:new-password@cluster.mongodb.net/database' --secret

# Run the pre-deployment script
./pre-deploy.sh

# Deploy the changes
pulumi up
```

## 🔒 Security Features

- **Encrypted Secrets**: MongoDB connection string is encrypted at rest and in transit
- **No Plaintext Secrets**: Secrets are never exposed in plaintext in code or logs
- **Separation of Concerns**: Infrastructure code is separated from application secrets
- **Access Control**: Access to secrets can be controlled and audited
- **Secret Rotation**: Secrets can be rotated without changing application code

## 🛠️ Customization

### Changing the Meteor App

The repository includes a simple todos application. You can modify it or replace it with your own Meteor application:

1. Update the files in the `meteor-app` directory
2. Commit and push your changes
3. Redeploy using the steps in the Workflow section

### Using a Different Database

To use a different MongoDB database:

1. Create a new MongoDB database (Atlas or self-hosted)

2. Update the connection string in Pulumi ESC:

   ```bash
   esc env set meteor-pulumi/dev mongodb_uri 'your-new-connection-string' --secret
   ```

3. Redeploy the application

### Changing the Region or Project

To deploy to a different region or project:

1. Update the configuration in Pulumi ESC:

   ```bash
   esc env set meteor-pulumi/dev gcp_project 'your-new-project-id'
   esc env set meteor-pulumi/dev gcp_region 'your-new-region'
   ```

2. Redeploy the application

## 🧹 Cleanup

To remove all resources created by this project:

```bash
cd pulumi-infra
pulumi destroy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- [Pulumi](https://www.pulumi.com/) for their excellent infrastructure as code platform
- [Meteor](https://www.meteor.com/) for their full-stack JavaScript platform
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for their managed MongoDB service
- [Google Cloud](https://cloud.google.com/) for their cloud platform and services

## 📚 Additional Resources

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Pulumi ESC Documentation](https://www.pulumi.com/docs/esc/)
- [Meteor Documentation](https://docs.meteor.com/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 📧 Contact

For questions or feedback, please open an issue on this [repository](https://github.com/Mooptcom/meteor-pulumi-esc) or contact [Kai Fong Chew](https://github.com/kafechew).
