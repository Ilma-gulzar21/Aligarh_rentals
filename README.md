# 🏠 Aligarh Rentals
### A Full-Stack Web Application for Rental Property Discovery and Management

Aligarh Rentals is a full-stack web application designed to simplify the process of finding, listing, and managing rental properties in Aligarh, Uttar Pradesh. The platform connects property owners with tenants and helps users discover suitable rental accommodations based on their preferences, budget, and location.

The application aims to make property discovery easier, more accessible, and more convenient, especially for students, families, working professionals, and people who are new to Aligarh.

---

## 🌟 Project Overview

Finding suitable rental accommodation in a new city can be challenging. People often struggle to find reliable property information, compare rental options, and connect with property owners.

**Aligarh Rentals** provides a centralized platform where:

- Tenants can explore available rental properties.
- Property owners can list and manage their properties.
- Users can search and filter properties according to their requirements.
- Tenants can view property details, images, locations, and reviews.
- Users can explore roommate availability and connect with suitable accommodation options.

The goal is to create a user-friendly rental property ecosystem specifically focused on the needs of people living in or moving to Aligarh.

---

## ✨ Key Features

### 👤 User Authentication and Authorization
- User registration and login functionality.
- Secure authentication using Passport.js.
- Session-based authentication.
- Role-based access for property owners and tenants.
- Protected routes to prevent unauthorized access.
- Authorization to ensure owners can manage their own property listings.

### 🏡 Property Management
- Property owners can create rental property listings.
- Upload and manage multiple property images.
- Update and delete property listings.
- Display detailed property information.
- Manage property availability and rental information.

### 🔍 Property Discovery and Search
- Browse available rental properties.
- Search properties according to user requirements.
- Filter properties based on relevant criteria.
- View property descriptions, pricing, and facilities.
- Explore property locations through interactive maps.

### 👥 Roommate Listings
- Display roommate availability information.
- Provide roommate details associated with properties.
- Support accommodation discovery for people looking for shared living arrangements.
- Login-protected access to private roommate information.

### ⭐ Reviews and Ratings
- Users can submit property reviews.
- Rating system for rental properties.
- Display user feedback and reviews.
- Help tenants make informed rental decisions.

### 📍 Location and Map Integration
- Interactive maps using Leaflet.
- Display property locations.
- Help users understand the geographical location of rental properties.

### ☁️ Image Management
- Cloudinary integration for property image storage.
- Multer for handling image uploads.
- Support for multiple property images.

### 📱 Responsive User Interface
- User-friendly interface.
- Responsive layouts for different screen sizes.
- Easy navigation and property browsing experience.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript, EJS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | Passport.js |
| Session Management | Express Session |
| Image Upload | Multer |
| Cloud Storage | Cloudinary |
| Maps | Leaflet |
| Version Control | Git and GitHub |
| Development Tools | VS Code, Postman |

---

## 🏗️ Application Architecture

Aligarh Rentals follows the **Model-View-Controller (MVC)** architectural pattern.

- **Model:** Handles database schemas and data management using Mongoose and MongoDB.
- **View:** Handles the user interface and dynamic page rendering using EJS.
- **Controller:** Manages application logic and processes user requests.
- **Routes:** Define application endpoints and connect requests with the appropriate controllers and middleware.
- **Middleware:** Handles authentication, authorization, validation, and other request-processing tasks.

This architecture helps maintain organized, reusable, and manageable application code.

---

## 📂 Project Structure

```text
Aligarh-Rentals/
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── views/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── utils/
│
├── init/
│
├── uploads/
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

*Note: The structure above represents the main application organization. Actual folders may vary depending on the project implementation.*

---

## ⚙️ Installation and Setup

Follow these steps to run Aligarh Rentals locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Ilma-gulzar21/Aligarh_rentals.git
```

### 2. Navigate to the Project Directory

```bash
cd Aligarh_rentals
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

Add the environment variables required by your application.

Example:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

**Important:** Use the exact environment variable names expected by your application. Never upload your actual `.env` file, database credentials, or API secrets to GitHub.

### 5. Start the Application

```bash
npm start
```

If your project uses a different development script, use the corresponding command from `package.json`.

### 6. Open in Browser

```text
http://localhost:8080
```

---

## 🔐 Security Considerations

- Authentication and authorization for protected application routes.
- Password handling through secure authentication mechanisms.
- Session-based user authentication.
- Server-side validation of user inputs.
- Protected property management operations.
- Sensitive environment variables stored outside the source code.

---

## 🎯 Target Users

Aligarh Rentals is designed for:

- **Students:** Students looking for rental accommodation near their educational institutions.
- **Families:** Families searching for suitable residential properties.
- **Working Professionals:** Individuals relocating to Aligarh for employment.
- **Property Owners:** Owners who want to list and manage their rental properties.
- **Roommate Seekers:** People interested in shared accommodation.

---

## 🚀 Future Enhancements

The following features can further improve the platform:

- Online rent payment integration through UPI.
- Advanced property recommendation system.
- Real-time chat between tenants and property owners.
- Email and notification services.
- Advanced location-based property search.
- Saved properties and personalized user dashboards.
- Enhanced property verification mechanisms.

---

## 💡 Project Objective

The primary objective of Aligarh Rentals is to simplify rental property discovery and management in Aligarh by providing a centralized digital platform that connects property owners and potential tenants.

The project focuses on improving accessibility, transparency, and convenience in the rental accommodation process.

---

## 👩‍💻 Developer

**Ilma Gulzar**

MCA Student | Full Stack Web Developer

- GitHub: [Ilma-gulzar21](https://github.com/Ilma-gulzar21)
- Project Repository: [Aligarh Rentals](https://github.com/Ilma-gulzar21/Aligarh_rentals)

---

## 📄 License

This project is developed for educational and development purposes.

---

<p align="center">
  <b>Aligarh Rentals – Making Rental Property Discovery Easier! 🏠</b>
</p>
