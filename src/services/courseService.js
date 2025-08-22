const Course = require('../models/Course');

async function createCourse({ title, description, teacherId }) {
    // Directly create a new course in MongoDB
  return Course.create({ title, description, teacherId });
}

async function listCourses(query = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  // Run both queries in parallel for efficiency
  const [items, total] = await Promise.all([
    Course.find(query)               // Find courses matching the query
      .skip(skip)                    // Skip previous pages
      .limit(limit)                  // Limit results per page
      .sort({ createdAt: -1 }),      // Sort by newest first
    Course.countDocuments(query)     // Total number of matching courses
  ]);
  
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total
  };

  return { items, pagination };
}

module.exports = { createCourse, listCourses };