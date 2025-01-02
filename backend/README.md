# SoftwareProject

Please follow this branching structure to make collaboration easy and stay organized.

## **Branch Structure**

- **Main Branch (`main`)**:  
  This is the production-ready branch.  
  Code in this branch should always be stable and deployable ("Final code").  

- **Development Branch (`dev`)**:  
  This is the staging branch for all team members' work.  
  Merge your work into `dev` after completing tasks and code reviews.  

- **Member Branches (`<name>`)**:  
  Each team member has their own branch to work on tasks and features.  

---
### **Check:**  
## **When creating your branch create it from dev not from main and when uploading your files upload into src folder in your owwn branch**
---

### **Important:**  
**Please upload your files to YOUR own branch, NOT the `main` or `dev` branch.**

---

### **note:**  
**You can find in div the src file which have the files structured download it develoop your feature and upload it i you OWN branch**
*You can add/remove DTOs in your feature depending on the requirements or whatever you want to do/develop.
also rename files and folders depending on your development*
---


## **Project Structure**

This is a simple interpretation of the structure of our project:  


```plaintext
src/
├── user-management/
│   ├── users.schema.ts
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   ├── user-management.controller.ts
│   ├── user-management.service.ts
│   ├── user-management.module.ts
├── course-management/
│   ├── courses.schema.ts
│   ├── modules.schema.ts
│   ├── dtos/
│   │   ├── create-course.dto.ts
│   │   ├── create-module.dto.ts
│   ├── course-management.controller.ts
│   ├── course-management.service.ts
│   ├── course-management.module.ts
├── interactive-modules/
│   ├── quizzes.schema.ts
│   ├── responses.schema.ts
│   ├── dtos/
│   │   ├── create-quiz.dto.ts
│   │   ├── submit-response.dto.ts
│   ├── interactive-modules.controller.ts
│   ├── interactive-modules.service.ts
│   ├── interactive-modules.module.ts
├── performance-tracking/
│   ├── progress.schema.ts
│   ├── dtos/
│   │   ├── update-progress.dto.ts
│   ├── performance-tracking.controller.ts
│   ├── performance-tracking.service.ts
│   ├── performance-tracking.module.ts
├── recommendation-engine/
│   ├── user-interactions.schema.ts
│   ├── recommendations.schema.ts
│   ├── dtos/
│   │   ├── generate-recommendation.dto.ts
│   ├── recommendation-engine.controller.ts
│   ├── recommendation-engine.service.ts
│   ├── recommendation-engine.module.ts

---

