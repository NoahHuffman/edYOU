import { CANVAS_KEY, USER_ID, CPSC_4910_ID } from "@/api/constants";
import { Assignment } from "@/api/interfaces";

const accessToken = CANVAS_KEY;
// const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjQtMTItMDkgMDQ6NTk6NTkuMDAwMDAwIiw4NjY3NjFdXQ&per_page=10';
const canvasUrl =
  `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/courses`;
const assignmentsUrl =
  `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/courses/${CPSC_4910_ID}/assignments`;

export const fetchCourses = async () => {
  try {
    const response = await fetch(canvasUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data: any = await response.json();
    return data;
  } catch (error: any) {
    console.error("Errors:", error.message);
    throw error;
  }
};

export const fetchAssignments = async () => {
  try {
    const response = await fetch(assignmentsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching assignments");
    }

    const data: Assignment[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error:", error.message);
    throw error;
  }
};
