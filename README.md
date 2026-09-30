# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, Tailwind CSS, and Axios**, using the [DummyJSON](https://dummyjson.com/) API.

The application allows an authenticated user to view, search, filter, sort, paginate, and manage products through a responsive admin interface.

## Live Demo

> https://nexgensis-dashboard.netlify.app/

## GitHub Repository

[Product Admin Dashboard](https://github.com/SahilShaikh25/Admin-Dashboard)

---

## Features

### Authentication

* Login using DummyJSON authentication.
* Protected dashboard route for authenticated users.
* Logout functionality.
* Authentication token stored in `localStorage`.
* Shared Axios instance automatically attaches the token to requests.
* Centralized handling of unauthorized (`401`) responses.
* Redirects unauthenticated users to the login page.
* Login button is disabled while authentication is in progress to prevent duplicate requests.

**Test credentials:**

```text
Username: emilys
Password: emilyspass
```

---

### Product Management

* Display products in a responsive layout.
* Desktop: table view.
* Mobile: card view.
* View individual product details.
* Add products.
* Edit products.
* Delete products with confirmation.
* Client-side form validation.
* Prevent duplicate Save requests while a mutation is in progress.

Product information includes:

* Image
* Title
* Category
* Price
* Rating
* Stock
* Description

---

### Search

* Product search using the DummyJSON `/products/search` endpoint.
* Search input is debounced before making an API request.
* Pagination resets to page 1 when the search changes.
* Previous search requests are cancelled when a newer request is triggered.
* This prevents stale search results from replacing newer results.

### Category Filter

* Categories are loaded from the DummyJSON categories endpoint.
* Products can be filtered by category.
* Pagination resets to page 1 when the category changes.

### Sorting

Products can be sorted by:

* Price
* Rating
* Title

Sorting also resets pagination to page 1.

---

### Pagination

Pagination is handled using the API's `limit` and `skip` parameters.

Supported page sizes:

```text
10
20
50
```

The dashboard provides:

* Previous button
* Next button
* Page number buttons
* Page size selection
* Current result range

Example:

```text
Showing 21 - 40 of 194
```

Invalid or out-of-range page values are handled without breaking the application.

---

### URL State

Search, category, sorting, page number, and page size are reflected in the URL.

Example:

```text
/?page=2&limit=20&search=phone&sort=price
```

This allows the current dashboard state to be:

* Refreshed without losing the current view.
* Shared through a URL.
* Restored when navigating back to the page.

Invalid values such as:

```text
?page=abc
?page=999
```

are handled safely.

---

### Product Details

Each product has a dedicated route:

```text
/products/[id]
```

The details page displays:

* Product images
* Description
* Price
* Reviews
* Other relevant product information

Invalid product IDs are handled with a not-found state.

---

### Loading, Empty and Error States

The application handles common API states:

**Loading**

Displays a loading state while products are being fetched.

**Empty**

Displays:

```text
No products found.
```

when a valid request returns no products.

**Error**

Displays an error message with a **Retry** button when product loading fails.

---

# Technical Stack

| Technology   | Purpose                                     |
| ------------ | ------------------------------------------- |
| Next.js      | Application framework and routing           |
| React        | UI and state management                     |
| Tailwind CSS | Styling and responsive layout               |
| Axios        | API communication                           |
| DummyJSON    | Backend/API for authentication and products |
| JavaScript   | Application logic                           |

---

# Project Structure

```text
src/
│
├── app/
│   ├── page.js
│   ├── layout.js
│   │
│   ├── login/
│   │   └── page.js
│   │
│   └── products/
│       └── [id]/
│           └── page.js
│
├── components/
│   └── ProductForm.jsx
│
└── services/
    ├── axios.js
    ├── authApi.js
    └── productApi.js
```

### `app/`

Contains the application pages and routes.

* `page.js` → Product dashboard
* `login/page.js` → Authentication page
* `products/[id]/page.js` → Product details page
* `layout.js` → Root application layout

### `components/`

Contains reusable UI components.

* `ProductForm.jsx` → Add/Edit product form

### `services/`

Contains API-related logic.

* `axios.js` → Shared Axios instance and interceptors
* `authApi.js` → Authentication requests
* `productApi.js` → Product API requests

API calls are kept separate from the UI components so that API communication and presentation logic remain independent.

---

# Architecture

The application follows a simple separation between UI, application logic, and API communication.

```text
                    ┌─────────────────────┐
                    │      Next.js UI     │
                    │                     │
                    │ Dashboard / Login   │
                    │ Product Details     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React State &     │
                    │   Event Handlers    │
                    │                     │
                    │ Search              │
                    │ Filter / Sort       │
                    │ Pagination          │
                    │ CRUD                │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    API Services     │
                    │                     │
                    │ authApi.js          │
                    │ productApi.js       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Shared Axios      │
                    │      Instance       │
                    │                     │
                    │ Token Interceptor   │
                    │ Error Handling      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     DummyJSON       │
                    └─────────────────────┘
```

---

# Engineering Decisions

## 1. Shared Axios Instance

Instead of creating Axios requests independently throughout the application, a shared Axios instance is used.

The shared instance is responsible for:

* Base API URL
* Adding the authentication token
* Handling unauthorized responses

This keeps authentication-related request logic centralized.

---

## 2. API Calls Separate From UI

API functions are kept inside:

```text
src/services/
```

For example:

```text
getProducts()
searchProducts()
getProductById()
addProduct()
updateProduct()
deleteProduct()
```

This prevents API implementation details from being mixed directly into UI components.

It also makes the API layer easier to modify independently from the dashboard UI.

---

## 3. URL-Based Dashboard State

Search, filters, sorting, page number, and page size are stored in the URL.

For example:

```text
/?page=2&limit=20&search=phone&sort=price
```

I chose this approach because dashboard state should survive page refreshes and should be shareable through a URL.

The application also validates URL values before using them. For example, an invalid page number should not cause the application to crash.

---

## 4. Debounced Search and Request Cancellation

Search requests are not sent on every keystroke.

A short debounce delay is used before calling the API.

Additionally, an `AbortController` is used to cancel the previous request when a new search request is triggered.

The flow is:

```text
User types
    ↓
Wait for debounce period
    ↓
Send search request
    ↓
User changes search
    ↓
Cancel previous request
    ↓
Send latest request
```

This is important because a slower previous request could otherwise finish after the newer request and overwrite the UI with stale results.

This was tested using the API's artificial delay option.

---

## 5. Search and Category Filter

DummyJSON does not provide a combined endpoint for searching and filtering by category.

I decided that when both values are present:

```text
Search → takes priority
Category → ignored while search is active
```

The UI also informs the user when this happens instead of silently applying only one of the filters.

This keeps the behavior predictable and matches the limitation of the API.

---

## 6. Preventing Duplicate Requests

The application prevents accidental duplicate requests in important actions.

For login:

```text
Loading → Login button disabled
```

For product mutations:

```text
Saving → Save action disabled
```

There is also a guard in the event handler so that another request is not started while the previous operation is still running.

This handles cases such as rapidly clicking Login or Save multiple times.

---

## 7. Responsive Product Display

The assignment requires different layouts for desktop and mobile.

The application therefore uses:

```text
Desktop → Product table
Mobile  → Product cards
```

This keeps the desktop interface information-dense while making the mobile version easier to use.

---

# Handling DummyJSON Limitations

DummyJSON simulates product mutations rather than providing a persistent backend database.

This means that operations such as:

```text
POST
PUT
DELETE
```

can return successful responses, but the changes are not permanently stored by the API.

The application therefore handles the UI state separately so that the user can see the result of the operation during the current session.

This limitation is documented rather than treating the API as a persistent production backend.

---

# Validation

The Add/Edit Product form performs client-side validation before submitting data.

Current validation includes:

* Title is required.
* Price is required.
* Price must be greater than `0`.
* Category is required.
* Description is required.

Invalid input prevents the API request from being sent and displays an appropriate validation message.

---

# Error Handling

The application handles errors at multiple levels.

### Authentication

Invalid login credentials display an error message.

### API Authentication

A `401 Unauthorized` response is handled centrally by the Axios response interceptor.

The stored token is removed and the user is redirected to the login page.

### Product Loading

If loading products fails:

```text
Error message
     +
Retry button
```

is displayed.

### Product Mutations

Add, update, and delete failures are handled separately so that the user receives feedback when an operation fails.

---

# Edge Cases Considered

The application was implemented with the following edge cases in mind:

| Edge Case                        | Handling                             |
| -------------------------------- | ------------------------------------ |
| Invalid login                    | Error message                        |
| Rapid Login clicks               | Login request guard                  |
| Unauthenticated dashboard access | Redirect to login                    |
| API returns `401`                | Token removed + redirect             |
| Rapid search changes             | Debounce + request cancellation      |
| Stale search response            | Previous request cancelled           |
| Search + category selected       | Search takes priority                |
| `?page=abc`                      | Falls back to a valid page           |
| `?page=999`                      | Corrected when total pages are known |
| Empty search results             | Empty state                          |
| Product API failure              | Error + Retry                        |
| Rapid Save clicks                | Saving guard                         |
| Delete action                    | Confirmation before request          |
| Invalid product ID               | Not-found state                      |

---

# Testing Approach

The application was manually tested against the major functional requirements.

### Authentication

* Login with valid credentials
* Login with invalid credentials
* Access dashboard without authentication
* Logout
* Rapid Login clicks

### Product Listing

* Product data displayed correctly
* Desktop table
* Mobile cards
* Product details navigation
* Loading state
* Empty state
* Error state

### Pagination

* Page navigation
* Previous/Next
* Page size 10
* Page size 20
* Page size 50
* Result range
* Invalid page values

### Search

* Search results
* Debounced requests
* Clearing search
* Page reset after search
* Rapid search changes
* Stale request handling

### Filtering and Sorting

* Category filtering
* Price sorting
* Rating sorting
* Title sorting
* Search + category behavior

### CRUD

* Add product
* Edit product
* Delete product
* Delete confirmation
* Form validation
* Duplicate Save prevention

---

# Problem Faced During Development

One of the main problems I faced occurred during deployment.

The application worked correctly in the local development environment, but the production build failed because `useSearchParams()` was being used on the dashboard page.

The dashboard relies on URL parameters for:

```text
page
limit
search
category
sort
```

During the production build, Next.js handles rendering differently from the development environment, and the use of `useSearchParams()` required the page to be handled correctly for client-side rendering.

### Solution

I investigated how `useSearchParams()` works with Next.js rendering and added the required `Suspense` boundary around the part of the application using the search parameters.

After making the change, the production build completed successfully and the application could be deployed.

This was useful because it highlighted a difference between something working in development and being correctly handled during a production build.

---

# AI Usage

AI tools were used during development as a learning and debugging aid.

AI assistance was mainly used for:

* Understanding Next.js concepts.
* Debugging errors.
* Understanding Axios and request cancellation.
* Discussing implementation approaches.
* Reviewing edge cases.
* Improving documentation.

The generated suggestions were reviewed, tested, and adapted to the application's requirements.

I also made sure to understand the implemented code rather than treating AI-generated code as a black box, since the project needs to be explained and modified during the evaluation.

---

# Setup

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

## Clone the repository

```bash
git clone https://github.com/SahilShaikh25/Admin-Dashboard.git
```

## Navigate into the project

```bash
cd Admin-Dashboard
```

## Install dependencies

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Login Credentials

Use the DummyJSON test credentials:

```text
Username: emilys
Password: emilyspass
```

---

# API

The application uses the following DummyJSON endpoints:

### Authentication

```text
POST /auth/login
```

### Products

```text
GET /products
GET /products/search
GET /products/categories
GET /products/{id}
POST /products/add
PUT /products/{id}
DELETE /products/{id}
```

The application communicates with these endpoints through Axios.

---

# Assignment Requirements Covered

The implementation covers the major requirements of the assignment:

* [x] Authentication
* [x] Protected dashboard
* [x] Logout
* [x] Responsive product list
* [x] Desktop table
* [x] Mobile cards
* [x] Pagination
* [x] Page size selection
* [x] Search
* [x] Debounced search
* [x] Stale request handling
* [x] Category filtering
* [x] Sorting
* [x] Product details
* [x] Add product
* [x] Edit product
* [x] Delete product
* [x] Delete confirmation
* [x] Form validation
* [x] Loading state
* [x] Empty state
* [x] Error state
* [x] Retry functionality
* [x] URL-based state
* [x] Invalid URL handling
* [x] Duplicate request prevention
* [x] Shared Axios configuration
* [x] Centralized authentication error handling
* [x] API services separated from UI

---

# Known Limitation

This project uses DummyJSON as the backend, which is intended for testing and demonstration.

Product mutations are simulated by the API and are not equivalent to persistent database operations in a production application.

For a production implementation, the product data would normally be connected to a persistent backend/database.

---

# Future Improvements

If this application were extended beyond the assignment, possible improvements would include:

* Persistent backend/database.
* More granular reusable dashboard components.
* Better notification/toast system.
* More advanced pagination for very large datasets.
* Automated unit and integration tests.
* Role-based authentication and authorization.
* Improved accessibility testing.
* Server-side authentication using a production authentication mechanism.

---

## Author

**Sahil Shaikh**

Built as a frontend development assessment project using Next.js, React, Tailwind CSS, Axios, and DummyJSON.
