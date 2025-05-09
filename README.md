# Inventory Management Application

A full‑stack inventory management system built with **React** (frontend) and **Django + Django REST Framework** (backend), styled with **Bootstrap**. It supports CRUD operations for inventory items, incoming/outgoing orders, and a real‑time conversation/message feature.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **Inventory Items:** Create, read, update, and delete inventory records.
- **Order Management:** Track incoming (`ordersIn`) and outgoing (`ordersOut`) orders.
- **User Authentication:** JWT‑based authentication with token refresh.
- **Real‑Time Conversations:** ModelViewSets for conversations and messages.
- **REST API:** Fully documented API using DRF routers and viewsets.
- **Responsive UI:** Built with React, Bootstrap, and a custom sidebar.

---

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap, Axios
- **Backend:** Django, Django REST Framework
- **Authentication:** djangorestframework-simplejwt, PyJWT
- **Database:** PostgreSQL (via `psycopg2-binary`)
- **Others:** `asgiref`, `django-cors-headers`, `python-dotenv`, `pytz`, `sqlparse`, `django-money`

---

## ⚙️ Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/inventory-management-app.git
    cd inventory-management-app
    ```

2. **Backend Setup**
    ```bash
    cd backend
    python -m venv env
    source env/bin/activate    # macOS/Linux
    env\Scripts\activate     # Windows
    pip install -r requirements.txt
    ```

3. **Apply migrations & create superuser**
    ```bash
    python manage.py migrate
    python manage.py createsuperuser
    ```

4. **Run the Django server**
    ```bash
    python manage.py runserver
    ```

5. **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm start
    ```

Open `http://localhost:3000` for the React app and `http://localhost:8000/api/` for the API.

---

## 🔧 Environment Variables

Create a `.env` file in the backend root with:

```env
DEBUG=True
SECRET_KEY=your_django_secret_key
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
```

---

## 📡 API Endpoints

Routes registered with DRF’s DefaultRouter in `backend/api/urls.py`:

```http
# Inventory Items
GET    /api/items/
POST   /api/items/
GET    /api/items/{id}/
PUT    /api/items/{id}/
DELETE /api/items/{id}/

# Incoming Orders (ordersIn)
GET    /api/ordersIn/
POST   /api/ordersIn/
... CRUD

# Outgoing Orders (ordersOut)
GET    /api/ordersOut/
POST   /api/ordersOut/
... CRUD

# Conversations
GET/POST /api/conversations/

# Messages
GET/POST /api/messages/

# Authentication & Users
POST   /api/user/register/      # Register new user
POST   /api/token/              # Obtain JWT token pair
POST   /api/token/refresh/      # Refresh access token
GET    /api/users/              # List users
GET    /api/users/{id}/         # Retrieve user
``` 

All API URLs are prefixed with `/api/` as configured in the main `urls.py`.

---

## 📂 Project Structure

```
inventory-management-app/
├── backend/
│   ├── api/                  # Django app for all API logic
│   │   ├── admin.py          # Admin model registrations
│   │   ├── apps.py
│   │   ├── forms.py          # Optional forms if used
│   │   ├── models.py         # InventoryItem, IncomingOrder, etc.
│   │   ├── serializers.py    # DRF serializers
│   │   ├── tests.py          # Unit tests
│   │   ├── urls.py           # DRF router registrations
│   │   └── views.py          # ViewSets for each model
│   ├── backend/              # Django project folder
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py           # Includes `api/urls.py`
│   │   ├── wsgi.py
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Images, icons
│   │   ├── components/       # UI components
│   │   │   ├── Context/      # AuthContext, ConversationContext
│   │   │   ├── Forms/        # ItemForm, LoginRegisterForm, etc.
│   │   │   ├── Hooks/        # useGetReceiver hook
│   │   │   ├── Item.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrdersIn.jsx
│   │   │   ├── PotentialConvos.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── UserCard.jsx
│   │   ├── pages/            # Routed pages
│   │   │   ├── Conversations.jsx
│   │   │   ├── CreateItem.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ItemView.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Register.jsx
│   │   ├── constants.js      # Shared constants/data
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── styles/               # Additional CSS
│   └── package.json
└── README-Inventory-Management.md
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/xyz`)
5. Open a Pull Request

Please follow code style conventions and include tests where appropriate.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 📬 Contact

- **Developer:** Brandon Boggs
- **Email:** youremail@example.com


