pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('server') {
                    sh 'npm ci'
                    sh 'npm test -- --runInBand'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('client') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build --no-cache'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d --remove-orphans'
                sh 'docker image prune -f'
            }
        }

        stage('Smoke Test') {
            steps {
                sh 'sleep 8'
                sh 'curl --fail http://localhost/api/health'
            }
        }
    }

    post {
        always {
            sh 'docker compose ps || true'
        }
        success {
            echo 'DevTrack deployment successful.'
        }
        failure {
            echo 'DevTrack pipeline failed.'
        }
    }
}
