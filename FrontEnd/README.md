**this can be a guidline for our structure for the frontend**
**this is an EXAMPLE ll hanemshy aleeh guideline not the ACTUALL pages that should be done**
**whats should be done isadmin,instructor,student,... student pages zay ma maktoob in the REQUIRMENTS NOT WHAT IS WRITTEN  HERE**

```plaintext
src/
├── components/
│   ├── common/       # Shared components "for example:"
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Notification.jsx
│   │   ├── Modal.jsx
│   │   └── LoadingSpinner.jsx
│   ├── student/ (when acessing the student home page da functionalities el student) "for example:"
│   │   ├── Dashboard.jsx
│   │   ├── CourseList.jsx
│   │   ├── CourseDetails.jsx
│   │   └── ProgressTracker.jsx
│   ├── instructor/(when acessing the instructor home page da functionalities el instructor) "for example:"
│   │   ├── Dashboard.jsx
│   │   ├── CourseBuilder.jsx
│   │   ├── Grading.jsx
│   │   └── Analytics.jsx
│   ├── admin/(when acessing the admin home page da functionalities el admin)"for example:"
│   │   ├── Dashboard.jsx
│   │   ├── UserManagement.jsx
│   │   ├── CourseApproval.jsx
│   │   └── Reports.jsx
│   └── auth/
│       ├── Login.jsx
│       ├── Register.jsx
│       └── ForgotPassword.jsx
├── pages/      (home pages)
│   ├── StudentPage.jsx
│   ├── InstructorPage.jsx
│   ├── AdminPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── App.jsx
└── index.js
