# Sanghathi

This platform provides comprehensive tools for educators, mentors, and mentees as part of the digital education ecosystem.

## Technology Stack

- React (v17+)
- Material-UI (v5)
- Vite
- Redux
- Zod
- Next JS

## Features

1. **Authentication**: User authentication using JSON Web Tokens (JWT).
2. **Authorization**: Role-based access control for Mentor, Mentee, HoDs, and Admin.
3. **Admin Dashboard**: User management, mentor allocation, and reallocation.
4. **Chat**: Real-time communication between assigned mentors and mentees.5. **Info Bot**: A chatbot trained on college datasets to assist users.
5. **Student Profile / Career Management**: Record-keeping for historical use cases and performance evaluation. Stores both personal and semester-wise data (attendance, marks, etc.).
6. **Approval System**: Students submit or edit data, assigned mentors receive notifications and approve the data (2-level data confirmation).
7. **Report Generation**: HoDs can generate reports based on various data views, such as semester-wise data, students with the highest marks in a semester, and parent-teacher meeting records.

## Prerequisites

- Node.js (version 14.x or higher)

## Getting Started

### 1. Clone the repository

````bash
git clone https://github.com/dreadwing5/cmrit-mentoring-tool-frontend.git
cd cmrit-mentoring-tool-frontend

````

### 2. Install dependencies

````bash
yarn install
````

### 3. Configure environment variables

Create a `.env` file in the project root directory with the following variables:

`VITE_API_BASE_URL=<your_api_base_url>`

Replace `<your_api_base_url>` with the base URL of your backend server.

### 4. Start the development server

````bash
yarn run dev
````

This will start the frontend development server.

### 5. Open the application

Open your browser and navigate to `http://localhost:3000` to view the application.

## Building for Production

To create a production build, run the following command:

````bash
yarn build
````

After the build is completed, you can serve the production build using:

````bash
yarn serve
````

This will start the production server, and you can access the application on `http://localhost:5000`.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the [MIT License](LICENSE)
