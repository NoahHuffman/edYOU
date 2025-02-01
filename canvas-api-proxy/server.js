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
      "https://utchattanooga.instructure.com/api/v1/courses?enrollment_type=student&enrollment_state=active&per_page=100&page=1",
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

  try {
    console.log(courseId);
    const response = await axios.get(
      `https://utchattanooga.instructure.com/api/v1/courses/${courseId}/assignments`,
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
