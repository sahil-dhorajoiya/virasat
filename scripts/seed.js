const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Connection URL
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

// User Schema (matching your existing schema)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create default users if they don't exist
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Shopkeeper User",
        email: "shopkeeper@example.com",
        password: "shop123",
        role: "shopkeeper",
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          ...userData,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await user.save();
        console.log(
          `Created ${userData.role} user with email: ${userData.email}`
        );
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seed function
seedDatabase();
