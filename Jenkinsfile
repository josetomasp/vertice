def version() {
    def matcher = readFile('package.json') =~ '"version": "(.+?)"'
    matcher ? matcher[1][1] : null
}

pipeline {
    agent {
        label ""
    }
    tools {
        maven 'M3'
        jdk 'JDK-11.0.1'
    }

     environment {
        VERSION = version()
        LOWERCASE_VERSION = VERSION.toLowerCase()
        // Where your Nexus is running
        NEXUS_URL = "dev-nexus.hestest.com"
        // Repository where we will upload the artifact
        NEXUS_REPOSITORY = "docker-nexus"

        // Jenkins credential id to authenticate to Nexus OSS
        //NEXUS_CREDENTIAL_ID = "svc_ocpjenkins_test"

        // Jenkins credential id to authenticate to Nexus OSS
        NEXUS_CREDENTIAL_ID = "e91653a5-9fb7-492e-9fe5-41ec3f4ce9e1"
        REPOSITORY = "https://nexus-docker.healthesystems.com"

    }
    stages {

        stage ('Build') {
          steps {
              echo "Building..."
              sh './mvnw clean package -D skipTests=true'
          }
        }


        stage('Build snapshot docker image and push to docker repository'){
            when {
                expression { return EVENT_KEY ==~ /(pr:merged)/ }
                expression { return BRANCH_NAME_TO ==~ /(master)/ }
            }
            steps{
                script{
                    sh "pwd"
                    def versionedImage = docker.build("", "-f ./docker/Dockerfile ./docker/")
                    versionedImage.push()
                    def latestImage = docker.build("dev-docker.hestest.com/healthesystems-docker-images/${Docker_Registry_Team_Section}/${Docker_Registry_Project_Section}/snapshots/latest:latest", "-f ./docker/Dockerfile ./docker/")
                    latestImage.push()
                }
            }
        }

        stage('Deploy image to Openshift int vertice'){
            when {
                expression { return EVENT_KEY ==~ /(pr:merged)/ }
                expression { return BRANCH_NAME_TO ==~ /(master)/ }
            }
            steps{
                openshiftDeploy(namespace: "int-vertice", depCfg: "int-vertice-pbm-link-service", authToken: "$AUTH_TOKEN_INT")
            }
        }

    }
}
