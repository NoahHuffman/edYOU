const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/getCourses", async (req, res) => {
  const accessToken = req.headers["authorization"];

  try {
    const response = await axios.get(
      "https://utchattanooga.instructure.com/api/v1/planner/items?start_date=2024-12-04T05%3A00%3A00.000Z&order=asc",
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/getAssignments", async (req, res) => {
  const accessToken = req.headers["authorization"];
  const courseId = req.body.courseId;
  const userId = req.body.userId;

  try {
    const response = await axios.get(
      `https://utchattanooga.instructure.com/api/v1/users/${userId}/courses/${courseId}/assignments`,
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
