Here's a refined version of the `README.md` file for the **Babu Khushi Backend** project hosted at [Babukhushi Backend GitHub Repository](https://github.com/AdsBath/babakhushi-backend.git):

---

# BabuKhushi Backend

This is the backend service for the **BabuKhushi** e-commerce platform, developed and maintained by **AdsBath IT Office**. This backend serves the APIs and services required for the Babukhushi frontend application. It is built using Node.js, Express, and MongoDB, and provides a wide range of features from user authentication to product management.

## Features

- **Authentication**: Secure user authentication and authorization using JWT.
- **Product Management**: Create, read, update, and delete (CRUD) operations for managing products.
- **Order Management**: Full-featured order creation, tracking, and management.
- **Cart Management**: APIs for adding, updating, and managing cart items.
- **Category Management**: Organize products into categories for easy browsing.
- **Coupon Management**: Manage and apply discount coupons for customers.
- **Wishlist**: Add and manage wishlist items for users.
- **Shipping Rules**: Define and manage shipping rules and delivery options.
- **Blog**: Manage blogs to engage customers with content.
- **Custom Design Requests**: Allow customers to request and submit custom design orders.
- **Banner & Advertisement Management**: Manage banners and advertisements displayed on the frontend.
- **Abandoned Cart Recovery**: Implement features for recovering abandoned carts.
- **Notifications**: API for order-related notifications.
- **Inventory Management**: Keep track of product inventory and manage stock levels.
- **Multi-User Roles**: Admin and user role management to handle privileges across different sections of the platform.

## Table of Contents

- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run the backend server locally, follow these steps:

### Prerequisites

Make sure you have the following installed:

- **Node.js** (>=12.x)
- **MongoDB** (local or cloud instance)

### Clone the repository

```bash
git clone https://github.com/AdsBath/babukhushi-backend.git
cd babukhushi-backend
```

### Install dependencies

```bash
npm install -f
```

### Environment Variables fsdkjbgfjsdkbgisdub

Create a `.env` file in the root directory and configure the following variables:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/babukhushi
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### Running the Server

To start the development server, run:

```bash
npm run dev
```

This will start the server on `http://localhost:3000`.

To build and run the production version:

```bash
npm run build
npm start
```

## API Documentation

The API routes are grouped by feature/module. Below is a summary of the key routes. For detailed API documentation, please refer to the `routes` folder in the project or generate API docs using tools like Postman or Swagger.

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/login`    | Authenticate user   |
| POST   | `/auth/register` | Register a new user |

### User

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | `/user`     | Get all users     |
| GET    | `/user/:id` | Get user by ID    |
| PUT    | `/user/:id` | Update user by ID |
| DELETE | `/user/:id` | Delete user by ID |

### Products

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/products`     | Get all products     |
| POST   | `/products`     | Create a new product |
| GET    | `/products/:id` | Get product by ID    |
| PUT    | `/products/:id` | Update product by ID |
| DELETE | `/products/:id` | Delete product by ID |

... (Other endpoints follow the same format for Orders, Cart, Categories, etc.)

### API Endpoint

| HTTP Method            | Endpoint                  | Description                             |
| ---------------------- | ------------------------- | --------------------------------------- |
| **Auth**               |                           |                                         |
| `POST`                 | `/auth/login`             | Authenticate user (login).              |
| `POST`                 | `/auth/register`          | Register a new user.                    |
| `POST`                 | `/auth/logout`            | Logout the current user.                |
| `POST`                 | `/auth/refresh`           | Refresh JWT token for the user.         |
| **User**               |                           |                                         |
| `GET`                  | `/user`                   | Get all users.                          |
| `GET`                  | `/user/:id`               | Get user details by ID.                 |
| `POST`                 | `/user`                   | Create a new user.                      |
| `PUT`                  | `/user/:id`               | Update user information by ID.          |
| `DELETE`               | `/user/:id`               | Delete user by ID.                      |
| **Categories**         |                           |                                         |
| `GET`                  | `/categories`             | Get all categories.                     |
| `POST`                 | `/categories`             | Create a new category.                  |
| `GET`                  | `/categories/:id`         | Get category by ID.                     |
| `PUT`                  | `/categories/:id`         | Update category by ID.                  |
| `DELETE`               | `/categories/:id`         | Delete category by ID.                  |
| **Products**           |                           |                                         |
| `GET`                  | `/products`               | Get all products.                       |
| `POST`                 | `/products`               | Create a new product.                   |
| `GET`                  | `/products/:id`           | Get product details by ID.              |
| `PUT`                  | `/products/:id`           | Update product details by ID.           |
| `DELETE`               | `/products/:id`           | Delete product by ID.                   |
| **Orders**             |                           |                                         |
| `GET`                  | `/orders`                 | Get all orders.                         |
| `GET`                  | `/orders/:id`             | Get order details by ID.                |
| `POST`                 | `/orders`                 | Create a new order.                     |
| `PUT`                  | `/orders/:id`             | Update order details by ID.             |
| `DELETE`               | `/orders/:id`             | Delete order by ID.                     |
| **Product Collection** |                           |                                         |
| `GET`                  | `/product-collection`     | Get all product collections.            |
| `POST`                 | `/product-collection`     | Create a new product collection.        |
| `GET`                  | `/product-collection/:id` | Get a product collection by ID.         |
| `PUT`                  | `/product-collection/:id` | Update product collection by ID.        |
| `DELETE`               | `/product-collection/:id` | Delete product collection by ID.        |
| **Attributes**         |                           |                                         |
| `GET`                  | `/attribute`              | Get all attributes.                     |
| `POST`                 | `/attribute`              | Create a new attribute.                 |
| `GET`                  | `/attribute/:id`          | Get an attribute by ID.                 |
| `PUT`                  | `/attribute/:id`          | Update attribute by ID.                 |
| `DELETE`               | `/attribute/:id`          | Delete attribute by ID.                 |
| **Attribute Items**    |                           |                                         |
| `GET`                  | `/attribute-item`         | Get all attribute items.                |
| `POST`                 | `/attribute-item`         | Create a new attribute item.            |
| `GET`                  | `/attribute-item/:id`     | Get an attribute item by ID.            |
| `PUT`                  | `/attribute-item/:id`     | Update attribute item by ID.            |
| `DELETE`               | `/attribute-item/:id`     | Delete attribute item by ID.            |
| **Bundle Discounts**   |                           |                                         |
| `GET`                  | `/bundle-discount`        | Get all bundle discounts.               |
| `POST`                 | `/bundle-discount`        | Create a new bundle discount.           |
| `GET`                  | `/bundle-discount/:id`    | Get bundle discount by ID.              |
| `PUT`                  | `/bundle-discount/:id`    | Update bundle discount by ID.           |
| `DELETE`               | `/bundle-discount/:id`    | Delete bundle discount by ID.           |
| **Addresses**          |                           |                                         |
| `GET`                  | `/address`                | Get all addresses.                      |
| `POST`                 | `/address`                | Create a new address.                   |
| `GET`                  | `/address/:id`            | Get address by ID.                      |
| `PUT`                  | `/address/:id`            | Update address by ID.                   |
| `DELETE`               | `/address/:id`            | Delete address by ID.                   |
| **Cart**               |                           |                                         |
| `GET`                  | `/cart`                   | Get all cart items.                     |
| `POST`                 | `/cart`                   | Create a new cart.                      |
| `GET`                  | `/cart/:id`               | Get cart by ID.                         |
| `DELETE`               | `/cart/:id`               | Delete cart by ID.                      |
| **Abandoned Cart**     |                           |                                         |
| `GET`                  | `/abandoned-cart`         | Get all abandoned carts.                |
| **Cart Items**         |                           |                                         |
| `GET`                  | `/cart-item`              | Get all cart items.                     |
| `POST`                 | `/cart-item`              | Add a cart item.                        |
| `GET`                  | `/cart-item/:id`          | Get cart item by ID.                    |
| `DELETE`               | `/cart-item/:id`          | Delete cart item by ID.                 |
| **Images**             |                           |                                         |
| `GET`                  | `/image`                  | Get all images.                         |
| `POST`                 | `/image`                  | Upload a new image.                     |
| `GET`                  | `/image/:id`              | Get image by ID.                        |
| `DELETE`               | `/image/:id`              | Delete image by ID.                     |
| **Inventory**          |                           |                                         |
| `GET`                  | `/inventory`              | Get all inventory items.                |
| `POST`                 | `/inventory`              | Create a new inventory record.          |
| `GET`                  | `/inventory/:id`          | Get inventory record by ID.             |
| `PUT`                  | `/inventory/:id`          | Update inventory record by ID.          |
| `DELETE`               | `/inventory/:id`          | Delete inventory record by ID.          |
| **Coupons**            |                           |                                         |
| `GET`                  | `/coupon`                 | Get all coupons.                        |
| `POST`                 | `/coupon`                 | Create a new coupon.                    |
| `GET`                  | `/coupon/:id`             | Get coupon by ID.                       |
| `PUT`                  | `/coupon/:id`             | Update coupon by ID.                    |
| `DELETE`               | `/coupon/:id`             | Delete coupon by ID.                    |
| **Shipping Rules**     |                           |                                         |
| `GET`                  | `/shipping-rules`         | Get all shipping rules.                 |
| `POST`                 | `/shipping-rules`         | Create a new shipping rule.             |
| `GET`                  | `/shipping-rules/:id`     | Get shipping rule by ID.                |
| `PUT`                  | `/shipping-rules/:id`     | Update shipping rule by ID.             |
| `DELETE`               | `/shipping-rules/:id`     | Delete shipping rule by ID.             |
| **Wishlist**           |                           |                                         |
| `GET`                  | `/wishlist`               | Get wishlist items for a user.          |
| `POST`                 | `/wishlist`               | Add an item to the wishlist.            |
| `DELETE`               | `/wishlist/:id`           | Remove an item from the wishlist by ID. |
| **Banners**            |                           |                                         |
| `GET`                  | `/banner`                 | Get all banners.                        |
| `POST`                 | `/banner`                 | Create a new banner.                    |
| `GET`                  | `/banner/:id`             | Get banner by ID.                       |
| `PUT`                  | `/banner/:id`             | Update banner by ID.                    |
| `DELETE`               | `/banner/:id`             | Delete banner by ID.                    |
| **Banner Ads**         |                           |                                         |
| `GET`                  | `/banner-ad`              | Get all banner ads.                     |
| `POST`                 | `/banner-ad`              | Create a new banner ad.                 |
| `GET`                  | `/banner-ad/:id`          | Get banner ad by ID.                    |
| `DELETE`               | `/banner-ad/:id`          | Delete banner ad by ID.                 |

| **Pages**

| | |
| `GET` | `/page` | Get all pages. |
| `POST` | `/page` | Create a new page. |
| `GET` | `/page/:id` | Get page by ID. |
| `PUT` | `/page/:id` | Update page by ID. |
| `DELETE` | `/page/:id` | Delete page by ID. |
| **Careers** | | |
| `GET` | `/career` | Get all career listings. |
| `POST` | `/career` | Post a new career listing. |
| `GET` | `/career/:id` | Get career listing by ID. |
| `DELETE` | `/career/:id` | Delete career listing by ID. |
| **Blogs** | | |
| `GET` | `/blog` | Get all blog posts. |
| `POST` | `/blog` | Create a new blog post. |
| `GET` | `/blog/:id` | Get blog post by ID. |
| `PUT` | `/blog/:id` | Update blog post by ID. |
| `DELETE` | `/blog/:id` | Delete blog post by ID. |
| **Order Notifications** | | |
| `GET` | `/notifications` | Get all order notifications. |
| **Discount Banners** | | |
| `GET` | `/discount-banner` | Get all discount banners. |
| `POST` | `/discount-banner` | Create a new discount banner. |
| `GET` | `/discount-banner/:id` | Get discount banner by ID. |
| `DELETE` | `/discount-banner/:id` | Delete discount banner by ID. |
| **Applications** | | |
| `GET` | `/application` | Get all applications. |
| `POST` | `/application` | Submit a new application. |
| `GET` | `/application/:id` | Get application by ID. |
| `DELETE` | `/application/:id` | Delete application by ID. |
| **Custom Design** | | |
| `GET` | `/custom-design` | Get all custom designs. |
| `POST` | `/custom-design` | Create a new custom design. |
| `GET` | `/custom-design/:id` | Get custom design by ID. |
| `DELETE` | `/custom-design/:id` | Delete custom design by ID.

## Real-time Notifications

This backend now uses **Server-Sent Events (SSE)** instead of WebSockets for real-time notifications, making it compatible with Vercel deployment.

### Changes Made

1. **Replaced WebSocket with SSE**:

   - Removed `ws` dependency
   - Added `/api/sse` endpoint for real-time notifications
   - Added `/api/notifications/check` endpoint for polling fallback

2. **SSE Endpoint**: `/api/sse`

   - Establishes persistent connection for real-time updates
   - Sends notifications when orders are created
   - Automatically handles client disconnections

3. **Polling Fallback**: `/api/notifications/check`
   - Fallback mechanism when SSE fails
   - Returns notification status for polling clients

### Frontend Integration

The frontend automatically:

- Attempts SSE connection first
- Falls back to polling if SSE fails
- Retries SSE connection with exponential backoff
- Handles connection errors gracefully

### Environment Variables

Make sure your frontend has the correct SSE URL:

- Production: `https://api.youngheartbd.com/api/sse`
- Development: `http://localhost:5000/api/sse`

### Benefits of SSE over WebSocket

- ✅ **Vercel Compatible**: Works with serverless functions
- ✅ **HTTP-based**: Uses standard HTTP protocol
- ✅ **Automatic Reconnection**: Built-in reconnection handling
- ✅ **Fallback Support**: Can fall back to polling
- ✅ **Simpler Implementation**: No need for custom WebSocket handling

### Testing

1. Start the backend server
2. Open the dashboard in your browser
3. Check browser console for SSE connection status
4. Create a new order to test real-time notifications

### Troubleshooting

If SSE fails:

1. Check browser console for errors
2. Verify the SSE endpoint is accessible
3. The system will automatically fall back to polling
4. Check network tab for failed requests

## Project Structure

```bash
babukhushi-backend/
│
├── src/
│   ├── modules/               # All the feature modules like user, product, orders, etc.
│   ├── routes/                # Route definitions for each module
│   ├── config/                # Configuration files (DB, server, etc.)
│   ├── middleware/            # Custom middleware (authentication, etc.)
│   ├── controllers/           # Logic for handling requests for each feature
│   └── models/                # Mongoose models
│
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Environment Variables

Ensure the following environment variables are set:

- `PORT`: Port where the server will run (default: `3000`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWT tokens
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`: Cloudinary credentials for image storage

## Contributing

We welcome contributions! If you would like to contribute, please follow the steps below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit the changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a pull request.

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This `README.md` should give your team a clear and structured overview of the **Babukhushi Backend** project. Adjust the API documentation section as needed for any specific API features.
