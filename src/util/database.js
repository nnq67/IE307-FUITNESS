import * as SQLite from 'expo-sqlite';

// Mở database blog_app.db
const db = SQLite.openDatabaseSync('blog_app.db');

/**
 * Khởi tạo bảng blogs. 
 */
export function init() {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY NOT NULL,
        userName TEXT NOT NULL,
        title TEXT NOT NULL,
        imageUri TEXT,
        date TEXT NOT NULL
      );
    `);
    console.log("✅ Blog Database initialized successfully");
  } catch (error) {
    console.error("❌ Database init error:", error);
  }
}

/**
 * Thêm một bài blog mới vào máy
 */
export function insertBlog(userName, title, imageUri) {
  try {
    const date = new Date().toLocaleDateString('vi-VN');
    
    const finalImageUri = imageUri ? imageUri : "";

    const result = db.runSync(
      'INSERT INTO blogs (userName, title, imageUri, date) VALUES (?, ?, ?, ?)',
      [userName, title, finalImageUri, date]
    );
    console.log("✅ Blog inserted with ID:", result.lastInsertRowId);
    return result;
  } catch (error) {
    console.error("❌ Insert blog error:", error);
    throw error;
  }
}

/**
 * Lấy tất cả bài viết từ mới nhất đến cũ nhất
 */
export function fetchBlogs() {
  try {
    const allRows = db.getAllSync('SELECT * FROM blogs ORDER BY id DESC');
    return allRows;
  } catch (error) {
    console.error("❌ Fetch blogs error:", error);
    return [];
  }
}

/**
 * Xóa một bài blog theo ID
 */
export function deleteBlog(id) {
  try {
    db.runSync('DELETE FROM blogs WHERE id = ?', [id]);
    console.log(`✅ Blog with ID ${id} deleted`);
  } catch (error) {
    console.error("❌ Delete blog error:", error);
  }
}