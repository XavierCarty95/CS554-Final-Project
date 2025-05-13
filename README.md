# CS554-Final-Project

## Overview

StudentBridge is a web application designed to connect students with resources, mentors, and opportunities to enhance their academic journey.

## Features

- User authentication and profile management
- Resource sharing and discovery
- Mentor-student matching
- Event calendar and notifications
- Discussion forums

## Technologies Used

- Frontend: React, HTML, CSS
- Backend: Node.js, Express
- Database: MongoDB

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/StudentBridge.git
    ```
2. Install dependencies for both the backend and the StudentBridge frontend:

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../studentbridge
    npm install
    ```

3. Set up environment variables as described in `.env.example` for both backend and frontend.

4. Start the development servers:

    ```bash
    # Start backend server
    cd backend
    npm start

    # In a new terminal, start frontend server
    cd ../studentbridge
    npm start
    ```

    ## Running with Docker

    Alternatively, you can use Docker to run both the backend and frontend:

    1. Ensure you have [Docker](https://www.docker.com/get-started) installed.
    2. Build and start the containers:

        ```bash
        docker-compose up --build
        ```

    3. The backend and frontend will be available at their respective ports as defined in the `docker-compose.yml` file.

    4. To stop the containers, press `Ctrl+C` and run:

        ```bash
        docker-compose down
        ```

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.