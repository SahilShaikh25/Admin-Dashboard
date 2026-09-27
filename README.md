# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, Tailwind CSS, and Axios**, using the [DummyJSON](https://dummyjson.com/) API.

The dashboard allows an authenticated user to view, search, filter, sort, paginate, and manage products.

---

## Features

### Authentication
- Login using DummyJSON authentication.
- Protected product dashboard.
- Logout functionality.
- Authentication token stored in `localStorage`.
- Axios interceptor automatically attaches the token to API requests.
- Unauthorized (`401`) responses redirect the user to the login page.
- Login button is disabled while authentication is in progress to prevent duplicate requests.

### Product Management
- View products in a responsive table/card layout.
- View product details.
- Add products.
- Edit products.
- Delete products with confirmation.
- Client-side form validation.
- Prevent duplicate Save requests while a mutation is in progress.

### Search, Filter & Sort
- Product search using DummyJSON search API.
- Debounced search input.
- Category filtering.
- Sort by:
  - Price
  - Rating
  - Title
- Search takes priority when both search and category are selected.

### Pagination
- Server-side pagination using `limit` and `skip`.
- Page sizes:
  - 10
  - 20
  - 50
- Previous/Next navigation.
- Page number navigation.
- Displays the current result range, for example:
  `Showing 21 - 40 of 194`

### URL State
Search, category, sorting, page, and page size are reflected in the URL.

For example:

```text
/?page=2&limit=20&search=phone&sort=price
