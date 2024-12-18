import { CANVAS_KEY, USER_ID, CPSC_4910_ID } from "@/api/constants";
import { Assignment } from "@/api/interfaces";

const accessToken = CANVAS_KEY;
const coursesUrl = `https://utchattanooga.instructure.com/api/v1/planner/items?start_date=2024-12-04T05%3A00%3A00.000Z&order=asc`;
const canvasUrl =
  `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/planner/items`;
const assignmentsUrl =
  `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/courses/36686/assignments`;

export const fetchCourses = async () => {
  try {
    const response = await fetch(coursesUrl, {
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
