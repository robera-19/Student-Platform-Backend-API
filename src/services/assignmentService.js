const Assignment = require('../models/Assignment');

async function createAssignment({ title, courseId, content, dueDate }) {
  return Assignment.create({ title, courseId, content, dueDate });
}

async function listAssignmentsByCourse(courseId, page = 1, limit = 10) {
  const skip = (page - 1) * limit; // Calculate documents to skip for pagination

  // Fetch assignments and total count in parallel for efficiency
  const [items, total] = await Promise.all([
    Assignment.find({ courseId })        // Find assignments for the given course
      .skip(skip)                         // Skip previous pages
      .limit(limit)                       // Limit results per page
      .sort({ createdAt: -1 }),           // Sort by newest first
    Assignment.countDocuments({ courseId }) // Count total assignments for pagination
  ]);

  // Prepare pagination info
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total
  };

  return { items, pagination };
}

module.exports = { createAssignment, listAssignmentsByCourse };