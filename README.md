# 🧺 LaundryLink

> A modern, full-stack laundry management system designed for university students and laundry staff to streamline the laundry service process.

![LaundryLink Banner](https://img.shields.io/badge/Status-Production%20Ready-success)
![Node](https://img.shields.io/badge/Node.js-20.x-green)
![React](https://img.shields.io/badge/React-19.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**LaundryLink** is a comprehensive laundry management system that bridges the gap between university students and laundry staff. It provides a seamless digital platform for students to request laundry pickups, track their items, and communicate with staff about any issues. Staff members can efficiently manage all laundry operations, update statuses, and maintain service quality.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 🎨 **Modern UI/UX** - Clean, responsive design with maroon and white theme
- 📊 **Real-time Tracking** - Live status updates for laundry items
- 🔍 **Advanced Filtering** - Search, filter, and sort laundry items
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- ⚡ **Fast & Efficient** - Built with performance in mind

## ✨ Features

### For Students

- ✅ **User Registration & Authentication**
  - Register with university email (@rishihood.edu.in)
  - Secure login with JWT tokens
  - Persistent sessions across page refreshes

- 🧺 **Laundry Management**
  - Create detailed laundry tickets with item counts
  - Track status: Pending → Washed → Picked Up
  - View complete laundry history
  - Mark items as picked up when ready
  - Delete unwanted tickets

- 🔍 **Smart Dashboard**
  - Summary statistics (pending, picked up, washed items)
  - Search by bag number or date
  - Filter by status
  - Sort by newest/oldest
  - Tab-based navigation (All, Active, History)

- 💬 **Issue Reporting**
  - Report issues with laundry items
  - View staff responses
  - Edit existing issues

### For Staff

- 🔐 **Staff Portal**
  - Secure staff login
  - Dedicated staff dashboard

- 📊 **Comprehensive Management**
  - View all student laundry items
  - Update laundry status (Pending/Washed)
  - Filter by status
  - View detailed student information
  - Item breakdown for each ticket

- 🛠️ **Issue Management**
  - Add/edit issues for laundry items
  - Inline editing interface
  - Communicate problems to students

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Vite** - Fast build tool
- **CSS3** - Custom styling with animations
- **React Icons** - Icon library

### Backend
- **Node.js 20.x** - JavaScript runtime
- **Express 5** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - Modern ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** (Neon) - Cloud-hosted database
- **Prisma ORM** - Type-safe database queries

### DevOps
- **Git** - Version control
- **Render** - Backend hosting
- **Vercel/Netlify** - Frontend hosting

## 🏗️ Architecture
